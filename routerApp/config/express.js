// Express App

// Module dependencies
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var chalk = require('chalk');

// Export Module

module.exports = function(db) {
  var app = express();
  app.use(cors());

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.use(function(req, res, next) {
    res.locals.url = req.method + ' ' + req.protocol + '://' + req.headers.host + req.url;
    console.log(res.locals.url);
    next();
  });

  // Routes
  app
    .post('/timelapse/new', function(req, res) {
      console.log(req.body);
      res.json({
        data: true
      });
    })
    .post('/scanner/new', function(req, res) {
      console.log(req.body);
      res.json({
        data: true
      });
    });

  // Finally return app
  return app;
};