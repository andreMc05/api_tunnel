// server.js
const express = require('express');
//const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const {init_httpMethods, apiDocs} = require('./scan_api_calls.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' directory

// Get the HTTP methods from the application. 
console.time(`Init_httpMethods Time is:`);
init_httpMethods();
console.timeLog(`Init_httpMethods Time is:`);

app.get('./api-endpoints', (req, res) => {
  fs.readFile(path.join(__dirname, 'api-endpoints'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading API endpoints file');
      return;
    }
    res.json(JSON.parse(data));
  });
});


app.get('/api-data', (req, res) => {
  res.json(apiDocs);
});

app.post('/test-api', async (req, res) => {
  try {
    const { method, url, data } = req.body;
    //const response = await axios({ method, url, data });
    //res.send(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`HTTP method data...`, apiDocs);
});