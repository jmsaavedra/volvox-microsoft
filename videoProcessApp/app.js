/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Video Process Application
*
*/

//TODO: move all of these credentials to secure (NOT COMMITTED TO GITHUB) file

//AZURE CREDENTIALS
global.STORAGE_ACCOUNT  = 'elbulliphoto';
global.STORAGE_KEY      = '/nGzMNHlVPDxIhDeVBHwT5JYwx4xrosjPU90uszrlZSClLC956XNoIHduNHADqrr4L+Axm36D2LS215tWLSR5g==';

//VIMEO CREDENTIALS
global.VIMEO_CLIENT_ID = '703165f789ba78ad4e2566dcd65113df4e0e4b70';
global.VIMEO_CLIENT_SECRET = 'S7CherScJPSuuC4Z3fFBCbvBM5/BUuJ3UQvsgIa3DmNXbCY9Qw4qb9dOSMJsfXJCmEtOthny+m8eNGzbzUEhRpNue8VDCmGfKs8fAJEhPvcLkkjUeJPjBYu9/PnzVkN4';
global.VIMEO_ACCESS_TOKEN = '0e916bf3af2e06f8eb82b5f87ee2e445';

//FOLDER GLOBALS
global.RAW_IMGS_PATH    = '/Users/jmsaavedra/Desktop/images-saved/'; //raw camera images
global.PROCESS_FOLDER   = '/Users/jmsaavedra/Desktop/process';       //folder where we'll store stuff as it's created
global.FOLDER_TO_WATCH  = '/Users/jmsaavedra/Desktop/finalvids';     //will upload any video that goes in here to vimeo
global.BULLI_SERVER     = { host: 'http://elbulliweb.cloudapp.net',  //our server to update the DB with data, video links, etc
                            path: '/timelapse/new',
                            port: '8080' };

var express     = require('express');
var colors      = require('colors');
var http        = require('http');
var port        = '8080'; //select a port for this server to run on

//custom modules
var watcher 	     = require('./app/watcher').init();
var vimeo          = require('./app/vimeo');
var processManager = require('./app/manager');
var vidRenderer    = require('./app/videoRenderer');


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

app.get('/start', function(req, res){

  var date = '2015-06-25';

  processManager.beginCameraVideos(date, function(e, cameraVideos){
      if(e) console.log('error: '.red+e);
      console.log('finished procesing individual videos: '.green);
      console.log(JSON.stringify(cameraVideos, null, '\t'));
      vidRenderer.makeFinalVideo(cameraVideos, function(e, finalVidPath){
        console.log('Finished Final Render:'.green.inverse, finalVidPath);
      });
    });
    res.send('started daily process.');
});


/****
* START THE HTTP SERVER
* ==============================================
*
*/
http.createServer(app).listen(port, function(){
  console.log();
  console.log('  Video Process Server Booting  '.white.bold.inverse);
  var listeningString = ' Magic happening on port: '+ port +"  ";
  console.log(listeningString.cyan.inverse);

  // processManager.downloadImages('2015-06-25', function(e, imgs){
  //   console.log('received images: '+JSON.stringify(imgs));
  // });
});
