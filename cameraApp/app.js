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

var gphoto2 = require('gphoto2');
var GPhoto = new gphoto2.GPhoto2();
var fs = require('fs');
var camera;

GPhoto.list(function (list) {
  if (list.length === 0) return;
  camera = list[0];
  console.log('Found', camera.model);
});

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

app.get('/1', function(req, res) { 
  console.log('hit /test'.gray);
	res.send('this is a test!');

	camera.takePicture({download: true}, function (er, data) {
   	if(er) console.log('er: '.red + er);
    fs.writeFileSync(__dirname + '/picture.jpg', data);
  });

	 // camera.takePicture({
	 //    targetPath: '/tmp/foo.XXXXXX'
	 //  }, function (er, tmpname) {
	 //  	if(er) console.log('er: '.red + er);
	 //  	console.log('tmpname: '.cyan + tmpname);
	 //    fs.renameSync(tmpname, __dirname + '/picture.jpg');
	 //  });
  // camera.takePicture({
  //   targetPath: '/tmp/foo.XXXXXX'
  // }, function (er, tmpname) {
  // 	 	if(er) console.log('er: '.red + er);
  //   fs.renameSync(tmpname, __dirname + '/picture.jpg');
  // });
// GPhoto.list(function (list) {
//   if (list.length === 0) return;
//   var camera1 = list[0];
//   console.log('Found', camera.model);


// });

});


/****
* START THE HTTP SERVER
* ==============================================
*
*/
http.createServer(app).listen(port, function(){
  console.log();
  console.log('  CAMERA APP   Server Running!  '.white.inverse);
  console.log('  HTTP Express Server Running!  '.gray.inverse);
  var listeningString = ' Magic happening on port: '+ port +"  ";
  console.log(listeningString.cyan.inverse);

});
