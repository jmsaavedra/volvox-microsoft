/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Video Process Application
*
*/

var express     = require('express');
var later       = require('later');
var moment      = require('moment');
var http        = require('http');
var path        = require('path');
var port        = '8080'; //select a port for this server to run on
global.chalk    = require('chalk');

//GLOBAL CREDENTIALS
global.KEYS = require(path.join(__dirname, '..', 'AuthKeys'));

//GLOBAL VARS
global.UPLOAD_FLAG      = true;   // true to upload to Vimeo + elBulli server, false for dev only.
global.CLEANUP_FLAG     = true;  // true to delete all process files after finished, false for dev only.
global.VID_INTRO_OUTRO  = path.join(__dirname,'assets','intro-outro.mp4');
global.VID_WATERMARK    = path.join(__dirname,'assets','watermark2.png');
global.PROCESS_FOLDER   = path.join(__dirname,'_process-files');  // folder where we'll store stuff as it's created
global.FOLDER_TO_WATCH  = path.join(__dirname,'_watch-upload');   // ONLY IF NEEDED (unused normally)


//number of daily process attempts
global.PROCESS_ATTEMPTS = 0;
global.IN_PROCESS = false; /* so we don't process more than one day at a time */
global.DATE_TODAY = '2015-07-03'; /* for testing */

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
  console.log(chalk.green('got start GET: '),req.query);
  if(!req.query.date){
    console.log(chalk.red('/start GET is missing date query.'));
    return res.send('ERROR. To execute a date, format your query as such: <br><br><strong> /start?date=2015-MM-DD</strong>');
  }
  global.DATE_TODAY = req.query.date;
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
  console.log(chalk.white.bold.inverse('  Video Process Server Booting  '));
  var listeningString = ' Magic happening on port: '+ port +"  ";
  console.log(chalk.cyan.inverse(listeningString));
  initScheduler();
});


/****
* INITIALIZE THE SCHEDULER
* ==============================================
*
*/
function initScheduler(){

  later.date.localTime(); // use local time
  console.log(chalk.gray.bold('local time:'), new Date());

  // var processRecur = later.parse.recur().on('21:01:00').time().onWeekday(); /* SHOWTIME */
  var processSched = later.parse.recur().on('21:05:00').time().onWeekday(); /* DEVTIME */
  var processTimeout = later.setTimeout(
    function() { 
      global.DATE_TODAY= moment().format('YYYY-MM-DD');
      executeVideoProcess('scheduler');
    }, processSched);
  var nextProcessTime = later.schedule(processSched).nextRange(1, new Date())[0];
  console.log(chalk.cyan.bold('\n>>> next video process will happen'), moment(nextProcessTime).from(new Date()), chalk.gray('>>>'),nextProcessTime);
}


/****
* EXECUTE VIDEO PROCESS ROUTINE
* ==============================================
*
*/
function executeVideoProcess(src){

  console.log(chalk.magenta.bold.inverse('\n Executing daily video process for date: '), global.DATE_TODAY);
  console.log(chalk.gray(' started by:'),src,chalk.gray('at:'),new Date());

  global.DL_PROCESS = function(){
    global.PROCESS_ATTEMPTS++;
    if(global.PROCESS_ATTEMPTS > 6) processFailed(null);
    console.log(chalk.green.bold('\n>>> KICKING OFF daily video process, attempt'), global.PROCESS_ATTEMPTS, chalk.green.bold(' for:'),global.DATE_TODAY);
    processManager.beginDailyProcess(global.DATE_TODAY, function(e){
      if(e){
        console.log(chalk.red.inverse('FAILED DAILY VIDEO PROCESS:'), e);
        //if(global.PROCESS_ATTEMPTS < 5 &&  src !== 'GET /start route'){ //quit trying if we initiated this from /start
        if(global.PROCESS_ATTEMPTS < 5){
	        console.log(chalk.red.bold('Failed on attempt'),global.PROCESS_ATTEMPTS,chalk.yellow('.  retrying in a few seconds...'));
          clearTimeout(global.DL_WATCHDOG);
          global.DL_WATCHDOG = setTimeout(global.DL_PROCESS, 6000);
        }
        else processFailed(e);
      } 
      else{
        console.log(chalk.green.bold.inverse('COMPLETED PROCESSING OF TODAY\'S VIDEOS. '), chalk.green.bold('\nTOOK'), global.PROCESS_ATTEMPTS,chalk.green.bold('ATTEMPTS.\n'), chalk.gray.bold('\n========================================================================\n\n'));
        global.PROCESS_ATTEMPTS = 0;
        global.IN_PROCESS = false;
      } 
    });
  };
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
  console.log(chalk.red.bold('FAILED'),global.PROCESS_ATTEMPTS,chalk.red.bold('TIMES, EMAILING YOU NOW.'));

  var body = '\ndaily video process has failed.\n';
  if(errMsg)  body += '\nreturned error: '+errMsg;
  else  body+=', attempted and failed image download multiple times.';
  body += '\n\ndate: '+global.DATE_TODAY+'\n\nnumber of attempts: '+global.PROCESS_ATTEMPTS;
  if(!global.UPLOAD_FLAG)
    return console.log(chalk.red('not sending email: UPLOAD_FLAG is false'));
  nodemailer.sendEmail('Daily Video Process Failed', body.toString(), function(e, info){
    if(e) return console.log(chalk.red('error sending email: '), e);
    console.log('E-mail sent: ', info.response);
  });
}
