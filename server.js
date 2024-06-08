'use strict';

var path = require('path');
var http = require('http');
require('dotenv').config();

var oas3Tools = require('oas3-tools');
const serverPort = process.env.PORT;
const { connectToDb } = require('./utils/mongo');

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

connectToDb(function (err) {
    if (err) {
        console.error('Failed to connect to MongoDB:', err);
        return;
    }

    // Initialize the Swagger middleware
    http.createServer(app).listen(serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    });
});

