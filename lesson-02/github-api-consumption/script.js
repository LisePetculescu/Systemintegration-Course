const usernameInput = document.getElementById("usernameInput");
const repoInput = document.getElementById("repoInput");
const fileInput = document.getElementById("fileInput");

const loadReposBtn = document.getElementById("loadReposBtn");
const loadRepoBtn = document.getElementById("loadRepoBtn");
const loadFileBtn = document.getElementById("loadFileBtn");

const reposList = document.getElementById("reposList");
const filesList = document.getElementById("filesList");
const fileContent = document.getElementById("fileContent");

let currentUser = null;
let currentRepo = null;

loadReposBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter a GitHub username.");
    return;
  }
  currentUser = username;
  await loadRepos(username);
});

loadRepoBtn.addEventListener("click", async () => {
  const repoName = repoInput.value.trim();
  if (!currentUser || !repoName) {
    alert("Enter a username and repo name.");
    return;
  }
  currentRepo = repoName;
  await loadFiles(repoName);
});

loadFileBtn.addEventListener("click", async () => {
  const path = fileInput.value.trim();
  if (!currentUser || !currentRepo || !path) {
    alert("Enter username, repo, and file path.");
    return;
  }
  const rawUrl = `https://raw.githubusercontent.com/${currentUser}/${currentRepo}/main/${path}`;
  await loadFileContent(rawUrl);
});

async function loadRepos(username) {
  reposList.innerHTML = "";
  filesList.innerHTML = "";
  fileContent.textContent = "";

  const url = `https://api.github.com/users/${username}/repos`;
  const repos = await fetchJson(url);

  if (!repos || repos.message) {
    reposList.innerHTML = "<li>Could not load repos.</li>";
    return;
  }

  repos.forEach((repo) => {
    const li = document.createElement("li");
    li.textContent = repo.name;
    li.addEventListener("click", () => {
      currentRepo = repo.name;
      repoInput.value = repo.name;
      loadFiles(repo.name);
    });
    reposList.appendChild(li);
  });
}

async function loadFiles(repoName) {
  filesList.innerHTML = "";
  fileContent.textContent = "";

  const url = `https://api.github.com/repos/${currentUser}/${repoName}/contents`;
  const items = await fetchJson(url);

  if (!items || items.message) {
    filesList.innerHTML = "<li>Could not load files.</li>";
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.path;

    if (item.type === "file") {
      li.addEventListener("click", () => {
        fileInput.value = item.path;
        loadFileContent(item.download_url);
      });
    } else if (item.type === "dir") {
      li.addEventListener("click", () => loadDir(repoName, item.path));
    }

    filesList.appendChild(li);
  });
}

async function loadDir(repoName, path) {
  filesList.innerHTML = "";
  fileContent.textContent = "";

  const url = `https://api.github.com/repos/${currentUser}/${repoName}/contents/${path}`;
  const items = await fetchJson(url);

  if (!items || items.message) {
    filesList.innerHTML = "<li>Could not load folder.</li>";
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.path;

    if (item.type === "file") {
      li.addEventListener("click", () => {
        fileInput.value = item.path;
        loadFileContent(item.download_url);
      });
    } else if (item.type === "dir") {
      li.addEventListener("click", () => loadDir(repoName, item.path));
    }

    filesList.appendChild(li);
  });
}

// async function loadFileContent(rawUrl) {
//   fileContent.textContent = "Loading...";
//   try {
//     const res = await fetch(rawUrl);
//     const text = await res.text();
//     fileContent.textContent = text;
//   } catch (err) {
//     fileContent.textContent = "Error loading file content.";
//   }
// }

// ...existing code...

async function loadFileContent(rawUrl) {
  fileContent.textContent = "Loading...";
  try {
    const res = await fetch(rawUrl);

    // Detect content type
    const contentType = res.headers.get("content-type") || "";

    if (contentType.startsWith("image/")) {
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Clear previous content and show image
      fileContent.textContent = "";
      const img = document.createElement("img");
      img.src = objectUrl;
      img.alt = "Image preview";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      fileContent.appendChild(img);
    } else {
      const text = await res.text();
      fileContent.textContent = text;
    }
  } catch (err) {
    fileContent.textContent = "Error loading file content.";
  }
}

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    return null;
  }
}
