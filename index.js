const path = require('path');
const express = require('express');

const server = express();
const defaultBuildPath = path.join(__dirname, './build');
const args = require('minimist')(process.argv.slice(2))
const port = args.port || 3002;
const buildPath = path.resolve(args.build) || defaultBuildPath

server.use(express.static(buildPath));

server.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    next();
});

server.get('*', function (req, res) {
    res.sendFile(buildPath + '/index.html');
});

server.listen(port, () => {
    console.log('Static Server is running on port: ' + port);
});
