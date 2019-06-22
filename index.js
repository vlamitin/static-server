const path = require('path');
const express = require('express');
const http = require ('http');
const https = require('https');
const fs = require('fs');

const server = express();
const defaultBuildPath = path.join(__dirname, './build');
const args = require('minimist')(process.argv.slice(2));
const port = args.port || 3002;
const buildPath = path.resolve(args.build) || defaultBuildPath;

const withHttps = args.publicCert && args.privateCert;

if (withHttps) {
    // to redirect to https
    server.get('*', (req, res, next) => {
        if (req.protocol === 'http') {
	    res.redirect('https://' + req.headers.host.replace(/:\d{1,}$/, ''));
	}
	else {
	    next();
	}
    });
}

server.use(express.static(buildPath));
server.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
    next();
});

// to handle all routing on client
server.get('*', (req, res, next) => {
    res.sendFile(buildPath + '/index.html');
});

http.createServer(server).listen(port, () => console.log('Static Server is running http on port: ' + port));

if (withHttps) {
    const publicCertPath = path.resolve(args.publicCert);
    const privateCertPath = path.resolve(args.privateCert);

    https
	.createServer({
	    cert: fs.readFileSync(publicCertPath, 'utf8'),
            key: fs.readFileSync(privateCertPath, 'utf8'),
        }, server)
	.listen(443, () => console.log('Static Server is running https on port: 443'));
}

