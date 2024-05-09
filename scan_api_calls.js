const fs = require('fs');
const path = require('path');

const directoryPath = './';
const allowedExtensions = ['.js', '.ts', '.jsx'];

let apiDocs = {};

function traverseDirectory(currentPath) {
    const files = [];
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);

        if (entry.isDirectory() && entry.name !== 'node_modules') {
            traverseDirectory(entryPath);
        } else if (allowedExtensions.includes(path.extname(entryPath))) {
            files.push(entryPath);
        }
    }
    return files;
}

function findHTTPMethods(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const httpMethodRegex = /\.(get|post|put|delete|patch)\(\s*["\']([^"\']+)["\']/g;
    const lines = fileContent.split('\n');
    const httpMethods = [];

    let apiMatch;
    while ((apiMatch = httpMethodRegex.exec(fileContent)) !== null) {
        const httpMethod = apiMatch[0].match(/(get|post|put|delete|patch)/)[0];
        const endpoint = apiMatch[0].split('(')[1].slice(1, -1); // Extract the part between parentheses
        const lineNumber = lines.findIndex((line, index) => index >= apiMatch.index && line.includes(httpMethod)) + 1;

        httpMethods.push({ method: httpMethod, endpoint, file: filePath, lineNumber });
    }
    return httpMethods;
}

const files = traverseDirectory(directoryPath);

function init_httpMethods(){
    console.time(`FindHTTPMethods Time is:`);
    console.time(`SetApiDocs Time is:`);
    for (const file of files) {
        const httpMethods = findHTTPMethods(file);
        console.log(`File: ${file}`);
        httpMethods.forEach(({ method, endpoint, lineNumber }) => {
            setApiDocs({file, method, endpoint, lineNumber})
        });
        console.log(`  -------------apiDocs done-- `, apiDocs);
    }
    console.timeLog(`SetApiDocs Time is:`);
    console.timeLog(`FindHTTPMethods Time is:`);
}


function setApiDocs(apiStr) {
    const newApi = {
        method: apiStr.method.toUpperCase(),
        enpoint: apiStr.endpoint,
        line: apiStr.lineNumber
    };

    if (apiStr.file in apiDocs === false) {
        apiDocs[apiStr.file] = [newApi];
    } else {
        apiDocs[apiStr.file].push(newApi);
    }
}

module.exports = {
    init_httpMethods,
    apiDocs
}

