// Express App

// Module dependencies
var util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var cors = require('cors');
var chalk = require('chalk');
var moment = require('moment');


// Export Module

module.exports = function(db, Model, vimeo) {
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
    .post('/photo/new', function(req, res) {
      console.log(req.body);
      // Save to Mongo
      /*
        Upsert the new scanned image
      */
      Model.Photo.findOneAndUpdate({
        date: req.body.date
      }, {
        $addToSet: {
          images: req.body.file
        },
        updated_at: new Date().getTime()
      }, {
        upsert: true
      }, function(err) {
        if (err) {
          console.log(chalk.red(err));
          res.json({
            data: false
          });
          // Sending Fail Email
        } else {
          res.json({
            data: true
          });
          // Sending Success Email
        }

      });
    })
    .post('/timelapse/new', function(req, res) {
      console.log(req.body);
      // Save to Mongo
      // var new_video = new Model.Video({
      //   vimeo_final: req.body.vimeo_final,
      //   vimeo_individuals: {
      //     cam1: req.body.individuals.cam1,
      //     cam2: req.body.individuals.cam2,
      //     cam3: req.body.individuals.cam3,
      //     cam4: req.body.individuals.cam4
      //   },
      //   date: req.body.date,
      //   updated_at: new Date().getTime()
      // });
      // new_video.save(function(err) {
      //   if (err) {
      //     console.log(chalk.red(err));
      //     res.json({
      //       data: false
      //     });
      //   } else {
      //     console.log('new video saved successfully!');
      //     res.json({
      //       data: true
      //     });
      //   }
      // });
      /*
        Upsert the new video object
      */
      Model.Video.findOneAndUpdate({
        date: req.body.date
      }, req.body, {
        upsert: true
      }, function(err) {
        if (err) {
          console.log(chalk.red(err));
          res.json({
            data: false
          });
        } else {
          console.log('new video saved successfully!');
          res.json({
            success: 200,
            data: req.body
          });
        }
      });
    })
    .post('/scanner/new', function(req, res) {
      console.log(req.body);
      // Save to Mongo
      /*
        Upsert the new scanned image
      */
      Model.Scan.findOneAndUpdate({
        date: req.body.date
      }, {
        $addToSet: {
          images: req.body.file
        },
        updated_at: new Date().getTime()
      }, {
        upsert: true
      }, function(err) {
        if (err) {
          console.log(chalk.red(err));
          res.json({
            data: false
          });
          // Sending Fail Email
        } else {
          res.json({
            data: true
          });
          // Sending Success Email
        }

      });

    })
  // For getting the video and scans back to user
  .get('/timelapse/month/:month', function(req, res) {
    var month = req.params.month; // 01-12
    console.log(month);
    // Regexp
    var r1 = /\d{4}\-/;
    var r2 = /\-\d{2}/;
    var r_final = new RegExp(month + r2.source);
    Model.Video.find({
      date: {
        $regex: r_final
      }
    }, function(err, result) {
      if (err) console.warn(err);
      console.log(result);
      res.json({
        data: result
      });
    });
  })
    .get('/timelapse/date/:date', function(req, res) {
      var date = req.params.date; // YYYY-MM-DD
      Model.Video.findOne({
        date: date
      }, function(err, result) {
        if (err) console.warn(err);
        console.log(result);
        var final_result = result;
        // Get Quadrant Video Description

        vimeo.getVideoDetailFromId(final_result.vimeo_final.vimeo_video_id, function(vimeo_result) {
          final_result.description = vimeo_result.description;
          final_result.img = vimeo_result.pictures.sizes[2].link || '';

          // Update Thumbnail (img) on Mongo
          Model.Video.findOneAndUpdate({
            date: date
          }, {
            img: final_result.img
          }, {
            upsert: true
          }, function(err) {
            if (err) console.log(err);
          });

          res.json({
            data: result
          });
        });
      });
    })
    .get('/scanner/month/:month', function(req, res) {
      var month = req.params.month; // 01-12
      console.log(month);
      // Regexp
      var r1 = /\d{4}\-/;
      var r2 = /\-\d{2}/;
      var r_final = new RegExp(r1.source + month + r2.source);
      Model.Scan.find({
        date: {
          $regex: r_final
        }
      }, function(err, result) {
        console.warn(err);
        // console.log(result);
        res.json({
          data: result
        });
      });
    })
    .get('/scanner/date/:date', function(req, res) {
      var date = req.params.date; // YYYY-MM-DD
      Model.Scan.findOne({
        date: date
      }, function(err, result) {
        console.warn(err);
        res.json({
          data: result
        });
      });
    })
  // For getting VIMEO info
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
      vimeo.getVideoDetailFromId(id, function(data) {
        res.json(data);
      });
    })
    .get('/', function(req, res) {
      res.send('You just entered a restricted area. Keep out.');
    });


  // Finally return app
  return app;
};