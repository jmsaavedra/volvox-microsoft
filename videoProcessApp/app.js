/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Video Process Application
*
*/

var express     = require('express');
var colors      = require('colors');
var later       = require('later');
var moment      = require('moment');
var http        = require('http');
var path        = require('path');
var port        = '8080'; //select a port for this server to run on

//GLOBAL CREDENTIALS
global.KEYS = require(path.join(__dirname, '..', 'AuthKeys'));

//GLOBALS
global.UPLOAD_FLAG      = true;   // true to upload to Vimeo + elBulli server, false for dev only.
global.CLEANUP_FLAG     = false;  // true to delete all process files after finished, false for dev only.
global.VID_INTRO_OUTRO  = path.join(__dirname,'assets','intro-outro.mp4');
global.VID_WATERMARK    = path.join(__dirname,'assets','watermark2.png');
global.PROCESS_FOLDER   = path.join(__dirname,'_process-files');  // folder where we'll store stuff as it's created
global.FOLDER_TO_WATCH  = path.join(__dirname,'_watch-upload');   // ONLY IF NEEDED (unused normally)


//number of daily process attempts
global.PROCESS_ATTEMPTS = 0;
global.IN_PROCESS = false; /* so we don't process more than one day at a time */
global.DATE_TODAY = '2015-06-27'; /* for testing */

//custom modules
var vimeo          = require('./app/vimeo');
var processManager = require('./app/manager');
var vidRenderer    = require('./app/videoRenderer');
var nodemailer     = require('./app/nodemailer');
var watcher        = require('./app/watcher').init(); /* TO USE ONLY IF NEEDED */


/****
* CONFIGURE Express
* ==============================================
*
*/
//instantiate object of express as app
var app = express();
app.use(express.static(__dirname+ '/public'));
app.use(express.static(__dirname+ '/_process-files'));

/****
* ROUTES
* ==============================================
*
*/
app.get('/start', function(req, res){
  if(!global.IN_PROCESS){
    global.IN_PROCESS = true;
    executeVideoProcess('GET /start route');
    res.send('<br>Start daily process for: <br><br><strong>'+global.DATE_TODAY+'</strong>');
  } else res.send('<br>Video Renderer currently in process for: <br><br><strong>'+global.DATE_TODAY+'</strong>');
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


/****
* INITIALIZE THE SCHEDULER
* ==============================================
*
*/
function initScheduler(){

  later.date.localTime(); // use local time
  console.log('local time: '.gray.bold+new Date());

  // var processRecur = later.parse.recur().on('21:01:00').time().onWeekday(); /* SHOWTIME */
  var processSched = later.parse.recur().on('23:05:00').time(); /* DEVTIME */
  var processTimeout = later.setTimeout(
    function() { 
      global.DATE_TODAY= moment().format('YYYY-MM-DD');
      executeVideoProcess('scheduler');
    }, processSched);
  var nextProcessTime = later.schedule(processSched).nextRange(1, new Date())[0];
  console.log('\n>>> next video process will happen'.cyan.bold, moment(nextProcessTime).from(new Date()),'>>>'.gray,nextProcessTime);
}


/****
* EXECUTE VIDEO PROCESS ROUTINE
* ==============================================
*
*/
function executeVideoProcess(src){

  console.log('\n Executing daily video process for date: '.magenta.bold.inverse, global.DATE_TODAY);
  console.log(' started by:'.gray,src,'at:'.gray,new Date());

  global.DL_PROCESS = function(){
    global.PROCESS_ATTEMPTS++;
    if(global.PROCESS_ATTEMPTS > 6) processFailed(null);
    console.log('\n>>> KICKING OFF daily video process, attempt'.green.bold, global.PROCESS_ATTEMPTS,' for: '.green.bold+global.DATE_TODAY);
    processManager.beginDailyProcess(global.DATE_TODAY, function(e){
      if(e){
        console.log('FAILED DAILY VIDEO PROCESS:'.red.inverse, e);
        if(global.PROCESS_ATTEMPTS < 5 &&  src !== 'GET /start route'){ //quit trying if we initiated this from /start
          console.log('Failed on attempt'.red.bold,global.PROCESS_ATTEMPTS,'.  retrying in a few seconds...'.yellow);
          clearTimeout(global.DL_WATCHDOG);
          global.DL_WATCHDOG = setTimeout(global.DL_PROCESS, 6000);
        }
        else processFailed(e);
      } 
      else{
        console.log('COMPLETED PROCESSING OF TODAY\'S VIDEOS. '.green.bold.inverse, '\nTOOK'.green.bold, global.PROCESS_ATTEMPTS,'ATTEMPTS.\n'.green.bold, '\n========================================================================\n\n'.gray.bold);
        global.PROCESS_ATTEMPTS = 0;
        global.IN_PROCESS = false;
      } 
    });
  }
  /* run this now! */
  global.DL_WATCHDOG = setTimeout(global.DL_PROCESS, 6000); //shouldn't take more than 6 secs to DL any 1 image.
}


/****
* IN CASE OF MULTIPLE FAILED PROCESS ATTEMPTS
* ==============================================
*
*/
function processFailed(errMsg){

  clearTimeout(global.DL_WATCHDOG); //stop trying 
  console.log('FAILED'.red.bold,global.PROCESS_ATTEMPTS,'TIMES, EMAILING YOU NOW.'.red.bold);

  var body = '\ndaily video process has failed.\n';
  if(errMsg)  body += '\nreturned error: '+errMsg;
  else  body+=', attempted and failed image download multiple times.';
  body += '\n\ndate: '+global.DATE_TODAY+'\n\nnumber of attempts: '+global.PROCESS_ATTEMPTS;
  if(!global.UPLOAD_FLAG)
    return console.log('not sending email: UPLOAD_FLAG is false'.red);
  nodemailer.sendEmail('Daily Video Process Failed', body.toString(), function(e, info){
    if(e) return console.log('error sending email: '.red, e);
    console.log('E-mail sent: ', info.response);
  });
}
