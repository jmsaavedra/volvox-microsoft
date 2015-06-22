/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Video Process Application
*
*/

//TODO: move all of these credentials to secure (NOT COMMITTED TO GITHUB) file

global.STORAGE_ACCOUNT = 'elbulliscanner';
global.STORAGE_KEY = 'bmZLz1PPrcwj48gl7fLxEk4r+I1qqQEZpPA7ng2QV9sgY/VqPcvkWiFeMUZn142TXu92qH3tPSJwfvQair8PqA==';
global.FOLDER_TO_WATCH = '/Users/jmsaavedra/Desktop/____watcher-test';
global.BULLI_SERVER = {
  host: 'http://elbulliweb.cloudapp.net',
  path: '/timelapse/new',
  port: '8080'
};

var express     = require('express');
var colors      = require('colors');
var http        = require('http');
var port        = '8080'; //select a port for this server to run on

//custom modules
var watcher 	= require('./app/watcher').init();
var vimeo     = require('./app/vimeo');
var processManager = require('./app/manager');
var videoProcess = require('./app/videoProcess');


/****
* CONFIGURE Express
* ==============================================
*
*/
//instantiate object of express as app
var app = express();

//use the public folder to serve files and directories STATICALLY (meaning from file)
app.use(express.static(__dirname+ '/public'));


/****
* ROUTES
* ==============================================
* - these are the HTTP /routes that we can hit
*
*/

app.get('/test', function(req, res) { 
  console.log('hit /test'.gray);	
  res.send('you hit /test!');
	// azureFiler.uploadImage('/Users/jmsaavedra/Desktop/____watcher-test/5511a1a8f20a6250693c8ff1.jpg', function(e, data){
	// 	if(e) res.send('ERROR creating container: '+e);
	// 	else res.send('created container: '+data);
	// });
});



/****
* START THE HTTP SERVER
* ==============================================
*
*/
http.createServer(app).listen(port, function(){
  console.log();
  console.log('  HTTP Express Server Running!  '.white.inverse);
  var listeningString = ' Magic happening on port: '+ port +"  ";
  console.log(listeningString.cyan.inverse);
  // processManager.getCamImgs(function(e, imgs){
  //   // console.log('images 0: '+JSON.stringify(imgs[0],null,'\t'));
  //   processManager.processVideo(3, imgs[3], function(_e, vid){
  //   });
  // });
  videoProcess.makeFinalVideo({}, function(e, finalVid){
    console.log('finalVid: '+finalVid);
  });
});
