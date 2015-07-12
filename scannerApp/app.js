/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Scanner application
*  - watches a specific folder for new files
*  - uploads file to Azure, updates elBulli database
*
*/

var express     = require('express');
var colors      = require('colors');
var http        = require('http');
var path        = require('path');
var port        = '8081'; //select a port for this server to run on

/** GLOBALS **/
global.KEYS = require(path.join(__dirname, '..', 'AuthKeys'));
// global.FOLDER_TO_WATCH = path.join(__dirname,'_scans');
global.FOLDER_TO_WATCH = path.join('F:\\SCANS\\PUBLIC_SITE'); //F:\SCANS\PUBLIC_SITE



/** THE WATCHER WATCHES **/
var watcher 	= require('./app/watcher').init();


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

});
