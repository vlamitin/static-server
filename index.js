const path = require('path');
const express = require('express');
const http = require ('http');
const https = require('https');
const fs = require('fs');

const server = express();
const defaultBuildPath = path.join(__dirname, './build');
const args = require('minimist')(process.argv.slice(2))
const port = args.port || 3002;
const buildPath = path.resolve(args.build) || defaultBuildPath

server.use(express.static(buildPath));

server.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    next();
});

server.get('*', (req, res) => {
    res.sendFile(buildPath + '/index.html');
});

http.createServer(server).listen(port, () => console.log('Static Server is running http on port: ' + port));

if (args.publicCert && args.privateCert) {
    const publicCertPath = path.resolve(args.publicCert);
    const privateCertPath = path.resolve(args.privateCert);

    https
	.createServer({
	    cert: fs.readFileSync(publicCertPath, 'utf8'),
            key: fs.readFileSync(privateCertPath, 'utf8'),
        }, server)
	.listen(443, () => console.log('Static Server is running https on port: 443'));
}
