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
var port = 8000; //select a port for this server to run on


/****
 * CONFIGURE Express
 * ==============================================
 *
 */
//instantiate object of express as app
var app = express();

app.use(function(req, res, next) {
  res.locals.url = req.method + ' ' + req.protocol + '://' + req.headers.host + req.url;
  console.log(res.locals.url);
  next();
});
//use the public folder to serve files and directories STATICALLY (meaning from file)
app.use(express.static(__dirname + '/public'));


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