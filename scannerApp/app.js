/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  WebApp for image processing. This is not public facing.
*
*/



var express     = require('express');
var colors      = require('colors');
var http        = require('http');
var port        = 8080; //select a port for this server to run on


//custom modules
var watcher 	= require('./app/watcher').init();
// var azureFiler  = require('./app/azureFiler');




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