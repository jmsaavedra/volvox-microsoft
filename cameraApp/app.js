/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Camera Controller and Photo Uploader Application
*
*
*/

process.env.UV_THREADPOOL_SIZE = 72; //to make sure we don't run out of threads on snap
console.log('\n\n\n=============================================================')
console.log('\t\t      Launching Camera App');
console.log('=============================================================\n')

var fs        = require('fs'),
  path        = require('path'),
  async       = require('async'),
  _           = require('lodash'),
  express     = require('express'),
  http        = require('http'),
  app         = express(),
  server      = require('http').Server(app),
  io          = require('socket.io')(server),
  exec        = require('child_process').exec,
  moment      = require('moment'),
  request     = require('request'),
  cameras     = null,
  port        = 8080,
  processingTake = false,
  setupComplete  = false; //camera setup


/* GLOBALS */
global.KEYS             = require(path.join(__dirname, '..', 'AuthKeys'));
global.RAW_IMG_FOLDER   = path.join(__dirname,'_images-to-upload');
global.SAVE_IMG_FOLDER  = '/home/elbulli/Desktop/raw-camera-images';//'/Users/jmsaavedra/Desktop/';// 
global.chalk            = require('chalk');

/* Custom Modules */
var Scheduler   = require('./app/components/scheduler');
var ImgHandler  = require('./app/components/imageHandler');
var Cameras     = require('./app/components/cameras');


/* Watcher */
var watchr = require('watchr');
var takeNumber = 0;
var imgCt = 0; // individual snap image count
var totalImgCt = 0; //server reported total for today
var latestImages = []; //holds the images taken on the immediately previous Snap()
var today = moment().format('YYYY-MM-DD');


var imageProcessQueue = async.queue(function (newImgPath, callback) {
  var newImg = new ImgHandler(newImgPath, function(e, savedPath, serverData){
    if(e){
      console.log(chalk.red('ERROR processing new image:'), e);
      //TODO: some kind of image upload fail handler
    } 
    io.sockets.emit('image_count', serverData.image_count);
    callback(e, savedPath);
  });
}, 2);


/* initialize local folders */
if (!fs.existsSync(global.SAVE_IMG_FOLDER)) fs.mkdirSync(global.SAVE_IMG_FOLDER);
if (!fs.existsSync(global.RAW_IMG_FOLDER)) fs.mkdirSync(global.RAW_IMG_FOLDER) 
else {
  console.log(chalk.gray('initializing folders... looking for leftover images'));
  var leftoverImages = fs.readdirSync(global.RAW_IMG_FOLDER);
  for(var i=0; i<leftoverImages.length; i++){
    console.log(chalk.yellow('Adding image to process queue: '+leftoverImages[i]));
    imageProcessQueue.push(path.join(global.RAW_IMG_FOLDER, leftoverImages[i]), function(err){
     if(err) console.log(chalk.red('ERROR processImage: '), err);
    });
  }
}

/** Upload queue has FINISHED **/
imageProcessQueue.drain = function() {
    console.log(chalk.gray.bold('__________________________________________________________\n'));
    console.log(chalk.green.bold('All images have been uploaded and databased for take #')+takeNumber);
    console.log(chalk.gray.bold('__________________________________________________________\n'));
    var timeTilNext = moment(Scheduler.getTimeTilNextSnap());//.format('DD MMMM YYYY, HH:MM:ss');
    
    console.log(chalk.cyan.bold('>>> Time until next snap:'), timeTilNext.from(new Date()),chalk.gray('>>>'), timeTilNext.format('DD MMM YYYY, hh:mm:ss') );
    io.sockets.emit('finished', getLatestImages(), today, timeTilNext);
};


watchr.watch({
  path: global.RAW_IMG_FOLDER,
  listener:  function(changeType,filePath,fileCurrentStat,filePreviousStat){
    
    if(changeType === 'create'){ 
      imgCt++;
      console.log(chalk.green('New File Added, imgCt:'),imgCt,': ',path.basename(filePath));
      latestImages.push({camera: imgCt, path: path.join(today,path.basename(filePath))});
      /* add this image to the processing queue */
      if (imgCt >= cameras.cameras_.length){
        console.log(chalk.bold("\n  RECEIVED 4 IMAGES  \n"));
        // ImageProcessQueue.push([these4images], function(err){ processingTake = false; });
      }
      imageProcessQueue.push(filePath, function (err, file) { //console.log('file: '+file);
        if(err) console.log(chalk.red('ERROR processImage: '), err); //console.log('finished processing image.'.green);
      });
    } //else console.log('changeType: '.gray+changeType+' filePath: '.gray+filePath);
  }
});

/* Express config */
app.use(express.static('./public'));
app.use('/images',express.static(global.SAVE_IMG_FOLDER));

function snap(){
  today = moment().format('YYYY-MM-DD');
  latestImages=[];
  takeNumber++;
  imgCt = 0;
  console.log('\n------------------\n\n',chalk.green.bold.inverse('  Snap Photo!  ') + chalk.gray.bold('  ||  ')+chalk.cyan.bold('Take #')+takeNumber);
  io.sockets.emit('loading',null);
  cameras.takePhotos(function(e){
    if(!e) return true
    console.log(chalk.red('ERROR takePhotos:'),e);
    return false;
  });
}


/* Stop any PTPCamera processes -- this is an auto-launched app on OSX */
var killAll = exec('killall PTPCamera gphoto2',function (error, stdout, stderr) {
  cameras = Cameras(function(e){
    if(e) console.log(chalk.red('camera setup failed:'), e);   
    console.log(chalk.gray("camera setup complete"));
    setupComplete = true;
    setupSockets();
    server.listen(port);

    console.log();
    console.log(chalk.white.inverse('  CAMERA APP   Server Running!  '));
    console.log(chalk.gray.inverse('  HTTP Express Server Running!  '));
    var listeningString = ' Magic happening on port: '+ port +"  ";
    console.log(chalk.cyan.inverse(listeningString));

    Scheduler.init(snap, function(timeOfNextSnap){
      moment.relativeTimeThreshold('s', 55);
      moment.relativeTimeThreshold('m', 55);
      io.sockets.emit('next-snap', moment(Scheduler.getTimeTilNextSnap()).format('DD MMMM YYYY, HH:MM:ss'));
      console.log(chalk.cyan.bold('\n>>> Time until next snap:'), moment(timeOfNextSnap).from(new Date()),chalk.gray('>>>'), timeOfNextSnap )
    });
  });
});

/*** SOCKETS ***/
var setupSockets = function(){
  io.on('connection', function(socket){
    console.log(chalk.yellow('socket connection created.'));
    io.sockets.emit('init',getLatestImages(), today, moment(Scheduler.getTimeTilNextSnap()).format('DD MMMM YYYY, HH:mm:ss')) ;

    if(totalImgCt < 1){
      var request = require('request');
      request('http://'+global.KEYS.BULLI_SERVER.host+':'+global.KEYS.BULLI_SERVER.port+global.KEYS.BULLI_SERVER.PATH.photo_info+'/'+today, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body).today;
          if(body.image_count){
            console.log(chalk.green('got server image_count: ')+body.image_count);
            totalImgCt = body.image_count;
            io.sockets.emit('image_count', totalImgCt);
          } 
          else{
            console.log('no images today.');
            io.sockets.emit('image_count', totalImgCt);
          } 
        }
      });
    } else io.sockets.emit('image_count', totalImgCt);
    socket.on('snap',function(data){
        console.log(chalk.green('Snap Photo! ')+JSON.stringify(data));
        snap();
    });
  });
};


var getLatestImages = function(){
  var _latestImages = _.sortBy(latestImages, function(name){return name;});
  return _latestImages
}