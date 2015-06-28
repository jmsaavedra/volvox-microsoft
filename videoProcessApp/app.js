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



var express     = require('express');
var colors      = require('colors');
var later       = require('later');
var moment      = require('moment');
var http        = require('http');
var path        = require('path');
var port        = '8080'; //select a port for this server to run on

//FOLDER GLOBALS
global.RAW_IMGS_PATH    = path.join(__dirname,'_raw-images'); //raw camera images
global.PROCESS_FOLDER   = path.join(__dirname,'_processed-files');       //folder where we'll store stuff as it's created
global.FOLDER_TO_WATCH  = path.join(__dirname,'_vids-to-upload');     //will upload any video that goes in here to vimeo
global.BULLI_SERVER     = { host: 'http://elbulliweb.cloudapp.net',  //our server to update the DB with data, video links, etc
                            path: '/timelapse/new',
                            port: '8080' };

//custom modules
var watcher 	     = require('./app/watcher').init();
var vimeo          = require('./app/vimeo');
var processManager = require('./app/manager');
var vidRenderer    = require('./app/videoRenderer');

var testDate = '2015-06-26'; /* for testing */

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
*
*/


app.get('/start', function(req, res){
  var today = moment().format('YYYY-MM-DD');
  console.log('>>> kicking off video process for: '.green.bold+today);
  processManager.beginDailyProcess(today, function(e, finalFilePath){
    if(e) console.log('FAILED DAILY VIDEO PROCESS:'.red.bold.inverse, e);
    else console.log('COMPLETED DAY AND VIDEOS. '.green.bold.inverse, finalFilePath);
    /***************
    //TODO: DELETE ALL PROCESS FILES (individual images, vids) FROM THIS MACHINE! We're DONE.
    //TODO: Decide if this should go to Azure File Storage for backup or not.
    */
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

  initScheduler();
});



function initScheduler(){

  later.date.localTime(); // use local time
  console.log(new Date());

  /* SHOWTIME */
  // var processRecur = later.parse.recur().on('21:01:00').time().onWeekday();
  var processSched = later.parse.recur().on('18:34:10').time();
  var processTimeout = later.setTimeout(
    function() { 
      var thisDay = moment().format('YYYY-MM-DD');
      console.log('>>> kicking off video process for: '.green.bold+thisDay);
      processManager.beginDailyProcess(thisDay, function(e, finalFilePath){
        if(e) console.log('FAILED DAILY VIDEO PROCESS:'.red.bold.inverse, e);
        else console.log('COMPLETED DAY AND VIDEOS. '.green.bold.inverse, finalFilePath);
        /***************
        //TODO: DELETE ALL PROCESS FILES (individual images, vids) FROM THIS MACHINE! We're DONE.
        //TODO: Decide if this should go to Azure File Storage for backup or not.
        */
      });
    }, processSched);
}
