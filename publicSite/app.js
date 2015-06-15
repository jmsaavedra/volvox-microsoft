/****
 *
 * VOLVOX x MICROSOFT
 * ==============================================
 *
 *  Web server for gallery and Vimeo API.
 *
 */

var express = require('express');
var chalk = require('chalk');
var http = require('http');
var bodyParser = require('body-parser');
var port = 8000; //select a port for this server to run on
var Vimeo = require('vimeo').Vimeo;
// https://github.com/vimeo/vimeo.js
var CLIENT_ID = '703165f789ba78ad4e2566dcd65113df4e0e4b70';
var CLIENT_SECRET = 'S7CherScJPSuuC4Z3fFBCbvBM5/BUuJ3UQvsgIa3DmNXbCY9Qw4qb9dOSMJsfXJCmEtOthny+m8eNGzbzUEhRpNue8VDCmGfKs8fAJEhPvcLkkjUeJPjBYu9/PnzVkN4';
var ACCESS_TOKEN = '6cf2299aa4717c3d6886ea93cdea0446';
var lib = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

/****
 * CONFIGURE Express
 * ==============================================
 *
 */
//instantiate object of express as app
var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.locals.url = req.method + ' ' + req.protocol + '://' + req.headers.host + req.url;
  console.log(res.locals.url);
  next();
});
//use the public folder to serve files and directories STATICALLY (meaning from file)
app.use(express.static(__dirname + '/public'));


/****
 * ROUTES
 * ==============================================
 * - these are the HTTP /routes that we can hit
 *
 */

app
  .get('/vimeo/monthly', function(req, res) {
    // /vimeo/monthly?month=january
    var month = req.query.month;
    getMonthlyVideos(month, function(data) {
      // Callback
      res.json(data);
    });
  })
  .get('/vimeo/id', function(req, res) {
    // /vimeo/id?id=1234215
    // console.log(req.query);
    var id = req.query.id;
    getVideoDetail(id, function(data) {
      res.json(data);
    });
  });

/*****************
 * VIMEO Functions
 *****************/
function getVideoDetail(id, cb) {
  console.log(id);
  lib.request({
    // This is the path for the videos contained within the staff picks channels
    path: '/videos/' + id
  }, function(error, body, status_code, headers) {
    if (error) {
      console.log('error');
      console.log(error);
    } else {
      console.log('body');
      if (cb) cb(body);
    }
  });
}

function getMonthlyVideos(month, cb) {
  console.log(month);
  lib.request({
    // This is the path for the videos contained within the staff picks channels
    path: '/channels/staffpicks/videos',
    // This adds the parameters to request page two, and 10 items per page
    query: {
      page: 2,
      per_page: 10
    }
  }, function(error, body, status_code, headers) {
    if (error) {
      console.log('error');
      console.log(error);
    } else {
      console.log('body');
      console.log(body);
      if (cb) cb(body);
    }
  });
}


/****
 * START THE HTTP SERVER
 * ==============================================
 *
 */
http.createServer(app).listen(port, function() {
  console.log();
  console.log(chalk.bold('HTTP Express Server Running!'));
  var listeningString = 'Magic happening on port: ' + port + "  ";
  console.log(listeningString);

});