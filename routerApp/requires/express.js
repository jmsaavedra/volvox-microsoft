// Express App

// Module dependencies
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var chalk = require('chalk');

// Export Module

module.exports = function(db, vimeo) {
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
    })
  // For VIMEO
  .get('/vimeo/monthly', function(req, res) {
    // /vimeo/monthly?month=january
    var month = req.query.month;
    vimeo.getMonthlyVideos(month, function(data) {
      // Callback
      res.json(data);
    });
  })
    .get('/vimeo/id', function(req, res) {
      // /vimeo/id?id=1234215
      // console.log(req.query);
      var id = req.query.id;
      vimeo.getVideoDetail(id, function(data) {
        res.json(data);
      });
    })
    .get('/', function(req, res) {
      res.send('You just entered a restricted area. Keep out.');
    });

  // Finally return app
  return app;
};