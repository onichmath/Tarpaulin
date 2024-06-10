'use strict';

var path = require('path');
var http = require('http');
require('dotenv').config();

// Handles API middleware
var oas3Tools = require('oas3-tools'); 
const serverPort = process.env.PORT;
const { connectToDb } = require('./utils/mongo');
const { exit } = require('process');
const { connectToRedis, getRedisClient } = require('./utils/ratelimiter');
const { TIMEOUT } = require('dns');

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

// OAS3 handles routing middleware for APi endpoints by using openAPI.yaml document
var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

async function startServer() {
    let count = 1;
    let connected = false;
    while(!connected){
        try {
            console.log(`Attempt number ${count}`)
            await connectToDb(function (err) {
                if (err) {
                    console.error('Failed to connect to MongoDB:', err);
                    throw err;
                }
            });
            connected = true;
            // await connectToRedis();
            // Initialize the Swagger middleware
            http.createServer(app).listen(serverPort, function () {
                console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
                console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
            });
        
        } catch (error) {
            console.error('Failed to start server:', error);
            if (count >= 10){
                exit(1);
            }
            count++;
            await new Promise((resolve) => {
                setTimeout(resolve, 3000); //passes resolve, will return sucessfully after 3 seconds
              });
        }
    }

}



startServer();
