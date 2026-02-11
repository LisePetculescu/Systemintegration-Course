import { log } from "console";
import { readFile } from "fs/promises";
import { parse } from "url";

const filename = "danish_companies.yml";

async function start(file) {
  console.log("YAML parser starting...");

  if (!file) {
    console.error("No file to parse! pls give YAML file to parse to JSON");
  }

  const YAMLtoParse = await readYAMLFile(file);

  const jsonContent = parseFile(YAMLtoParse);
  //   console.log(jsonContent);
  return jsonContent;
}

async function readYAMLFile(fileToParse) {
  try {
    const YAMLFileContent = await readFile(fileToParse, "utf-8");
    return YAMLFileContent;
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

function parseFile(filecontent) {
  const filteredData = filecontent.split("-").filter((row) => row.trim());

  const parsedFile = filteredData.map((dataEntry) => {
    const lineItems = dataEntry
      .split("\n")
      .filter((lineItem) => lineItem.trim());

    const obj = {};

    lineItems.forEach((lineItem) => {
      // split key and value by ':'
      const colonIndex = lineItem.indexOf(":");
      if (colonIndex !== -1) {
        const key = lineItem.substring(0, colonIndex).trim();
        const value = lineItem.substring(colonIndex + 1).trim();

        // add key and value pairs to obj & remove qoutes if present
        obj[key] = value.replace(/^['"]|['"]$/g, "");
      }
    });
    return obj;
  });

  // console.log(parsedFile);
  console.log(JSON.stringify(parsedFile, null, 2));

  return JSON.stringify(parsedFile, null, 2);
}

start(filename);
