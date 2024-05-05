const fs = require('fs');
const path = require('path');

const directoryPath = './';
const allowedExtensions = ['.js', '.ts', '.jsx'];

let apiDocs = {};

function getFilesRecursively(dirPath) {
    const files = [];

    function traverseDirectory(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(currentPath, entry.name);

        if (entry.isDirectory() && entry.name !== 'node_modules') {
            traverseDirectory(entryPath);
        } else if (allowedExtensions.includes(path.extname(entryPath))) {
            files.push(entryPath);
        }
    }
    }

    traverseDirectory(dirPath);
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

const files = getFilesRecursively(directoryPath);

for (const file of files) {
    const httpMethods = findHTTPMethods(file);
    console.log(`File: ${file}`);
    httpMethods.forEach(({ method, endpoint, lineNumber }) => {
        setApiDocs({file, method, endpoint, lineNumber})
    });
    console.log(`  -------------apiDocs done-- `, apiDocs);
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
    
}

