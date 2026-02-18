import { readFile } from 'fs/promises';

// to run it, go to 'txt-file-parser' folder in terminal and run "node script.js"

const fileName = 'txt-file-parser/danish_companies.txt'
async function start(file) {

    // const textToParse = await readTxtFile('danish_companies.txt');
    const textToParse = await readTxtFile(file);

    console.log(parseFile(textToParse));
    const jsonContent = parseFile(textToParse);

    return jsonContent;
}


async function readTxtFile(file) {
    try {
        const textFromFile = await readFile(file, 'utf8');
        // console.log(textFromFile);
        return textFromFile;
    } catch (error) {
        console.error('Error:', error);
    }

}

function parseFile(textToParse) {

    const rows = textToParse.split('~').filter(row => row.trim());
    const parsedFile = rows.map(row => {
        const fields = row.split('|');
        return {
            CVR: fields[0]?.trim(),
            CompanyName: fields[1]?.trim(),
            Street: fields[2]?.trim(),
            Number: fields[3]?.trim(),
            PostalCode: fields[4]?.trim(),
            Town: fields[5]?.trim(),
            EmailAddress: fields[6]?.trim(),
        };
    });
    
    // return parsedFile;  
    return JSON.stringify(parsedFile, null, 2); 

}

start(fileName);