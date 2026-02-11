import { readFile } from "fs/promises";

// Header row:
// cvr,name,street,number,postal_code,city,email

const filename = "danish_companies.csv";

async function start(file) {
  console.log("CSV parser starting...");

  if (!file) {
    console.error("No file to parse! pls give CSV file to parse to JSON");
  }

  const csvToParse = await readCSVFile(file);

  // console.log(parseFile(csvToParse));
  const jsonContent = parseFile(csvToParse);
  //   console.log(jsonContent);

  return jsonContent;
}

async function readCSVFile(fileToParse) {
  try {
    const CSVFileContent = await readFile(fileToParse, "utf8");
    return CSVFileContent;
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

function parseFile(fileContent) {
  const rows = fileContent.split("\n").filter((row) => row.trim());

  // (1)  seperate header names from first row;
  const headerRow = rows[0];
  // console.log("header", headerRow);
  const headers = headerRow.split(",");
  // console.log(headers);

  // (2) split each rows' values up and insert into an object for each company
  const content = rows.slice(1).map((row) => {
    const values = row.split(",").map((value) => value.trim());
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] !== undefined ? values[index] : null;
      return acc;
    }, {});
  });

  console.log(content);
  // console.log( JSON.stringify(content, null, 2));

  // (3) return the list of json objects from the csv file
  // return content;
  // JSON.stringify(value, replacer, space)
  return JSON.stringify(content, null, 2);
}

start(filename);
