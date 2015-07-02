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
    .post('/photo/info', function(req, res) {
      Model.Photo.findOne({
        date: req.body.date
      }, function(err, obj) {
        if(err) {
          console.log.warn(err);
        } else {
          res.json({
            today: obj
          });
        }
      });
    })
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
      }, function(err, obj) {
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
            data: req.body.filename
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

    .get('/photo/info', function(req, res) {
      Model.Photo.findOne({
        date: req.query.date
      }, function(err, obj) {
        if(err || !obj) {
          console.log(chalk.red('err:'),err);
          console.log('today:',obj);
          res.send('<strong>error:</strong>',err,'<strong>today:</strong>',obj,'when looking up date: <strong>',req.query.date,'</strong>');
        } else {
          var sendObj = JSON.parse(JSON.stringify(obj));
          sendObj.image_count = obj.images.length;
          res.json({
            today: sendObj
          });
        }
      });
    })

    // For getting the video and scans back to user
    .get('/timelapse/month/:month', function(req, res) {
      var month = req.params.month; // 01-12
      console.log(chalk.green.bold('Querying for'));
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
        console.log(chalk.yellow.bold('Result:'))
        console.log(result.length + ' data');
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
        // console.log(result);
        var final_result = result;
        if (final_result) {
          // Get Quadrant Video Description
          vimeo.getVideoDetailFromId(final_result.vimeo_final.vimeo_video_id, function(vimeo_result) {
            // console.log(chalk.green('Vimeo result'));
            // console.log(vimeo_result);
            var description = vimeo_result.description;
            res.json({
              data: result,
              description: description
            });
          });
        }

        // Update thumbnail
        vimeo.getVideoDetailFromId(final_result['cam' + Math.floor(Math.random() * 4)].vimeo_video_id,
          function(vimeo_result_thumb) {
            var img = vimeo_result_thumb.pictures.sizes[2].link || '';
            // console.log(img);
            // Update Thumbnail (img) on Mongo
            Model.Video.findOneAndUpdate({
              date: date
            }, {
              thumbnail: img,
              updated_at: new Date().getTime()
            }, {
              upsert: true
            }, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log('Done updating thumbnail');
              }
            });
          });
      });
    })
    .get('/scanner/month/:month', function(req, res) {
      var month = req.params.month; // 01-12
      console.log(chalk.green.bold('Querying for:'));
      console.log(month);
      // Regexp
      var r1 = /\d{4}\-/;
      var r2 = /\-\d{2}/;
      var r_final = new RegExp(month + r2.source);
      Model.Scan.find({
        date: {
          $regex: r_final
        }
      }, function(err, result) {
        if (err) {
          console.warn(err);
        }
        console.log(chalk.green.bold('Result:'))
        console.log(result)
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