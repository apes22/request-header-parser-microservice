'use strict';

// Require the modules we need
const express = require('express');
const fs = require('fs');
const path = require("path");
const os = require('os');
const useragent = require('express-useragent');

// Set up express
const app = express();
app.enable('trust proxy');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(useragent.express());

// Processes homepage request
app.get('/', function(req, res) {
  
  res.sendFile(__dirname + '/views/index.html');
});

/* Route that processes GET /whoami requests.
   Responds back a JSON object that contains the client's IP address, language, operating system, and browser specifications.
*/
app.get('/whoami', function(req, res) {
  let agent = useragent.parse(req.headers['user-agent']);
  let headerInfo = {
    "ip address": req.ip, 
    "default langauge": req.headers["accept-language"].split(",")[0], 
    "browser": req.useragent.browser,
    "version": req.useragent.version, 
    "os": req.useragent.os,
    "platform": req.useragent.platform
  };
  res.json(headerInfo);
});

// Respond not found to all the wrong routes
app.use(function(req, res, next){
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use(function(err, req, res, next) {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
});

//Listen for requests
const server = app.listen(process.env.PORT || 3000, function () {
  const port = server.address().port;
  console.log('Request Header Parser Microservice app is listening on port ',  port);
});