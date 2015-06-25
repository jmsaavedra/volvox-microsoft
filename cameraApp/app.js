process.env.UV_THREADPOOL_SIZE = 72;

/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
* Camera Controller and Photo Uploader Application
*
* - TODO: make photos save to correct folder inside of /images (by date)
*
*/

/* GLOBALS */
global.RAW_IMG_FOLDER   = __dirname+'/images-to-upload';
global.SAVE_IMG_FOLDER   = '/home/elbulli/Desktop/raw-camera-images';//'/Users/jmsaavedra/Desktop/';// 
global.AZURE_BLOB_ADDR  = 'https://elbulliphoto.blob.core.windows.net';
global.STORAGE_ACCOUNT  = 'elbulliphoto';
global.STORAGE_KEY      = '/nGzMNHlVPDxIhDeVBHwT5JYwx4xrosjPU90uszrlZSClLC956XNoIHduNHADqrr4L+Axm36D2LS215tWLSR5g==';
global.BULLI_SERVER = {
  host: 'elbulliweb.cloudapp.net',
  path: '/photo/new',
  port: '8080'
};

var SNAP_INTERVAL = 30; // number of seconds between each snap

var fs        = require('graceful-fs'),
  path        = require('path'),
  colors      = require('colors'),
  async       = require('async'),
  express     = require('express'),
  http        = require('http'),
  app         = express(),
  server      = require('http').Server(app),
  io          = require('socket.io')(server),
  exec        = require('child_process').exec,
  moment      = require('moment'),
  Scheduler   = require('./app/components/scheduler'),
  ImgHandler  = require('./app/components/imageHandler'),
  Cameras     = require('./app/components/cameras'),
  cameras     = null,
  port        = 8080,
  processingTake = false,
  setupComplete  = false; //camera setup

/* check that images folder exists */
if (!fs.existsSync(global.RAW_IMG_FOLDER)) fs.mkdirSync(global.RAW_IMG_FOLDER);
if (!fs.existsSync(global.SAVE_IMG_FOLDER)) fs.mkdirSync(global.SAVE_IMG_FOLDER);

/* Gulp Watcher */
var watchr = require('watchr');
var takeNumber = 0;
var imgCt = 0; // individual take image count

var latestImages = [];

var imageProcessQueue = async.queue(function (newImgPath, callback) {
  var newImg = new ImgHandler(newImgPath, function(e, savedPath){
    if(e) console.log('ERROR processing new image:'.red, e);
    callback(e);
  });
}, 1);

// assign a callback
imageProcessQueue.drain = function() {
    console.log('__________________________________________________________\n'.gray.bold);
    console.log('All images have been uploaded and databased for take #'.green.bold+takeNumber);
    console.log('__________________________________________________________\n'.gray.bold);
    Scheduler.getTimeTilNextSnap(function(time){
      console.log('>>> Time until next snap:'.cyan.bold, moment(time).from(new Date()),'>>>'.gray, time );
      io.sockets.emit('finished', latestImages);

    });  
};


watchr.watch({
  path: global.RAW_IMG_FOLDER,
  listener:  function(changeType,filePath,fileCurrentStat,filePreviousStat){
    
    if(changeType === 'create'){ 
      imgCt++;
      console.log('New File Added, imgCt:'.green,imgCt,': ',filePath);
      var today = moment().format('YYYY-MM-DD');
      latestImages.push({camera: imgCt, path: path.join(today,path.basename(filePath))});
      /* add this image to the processing queue */
      if (imgCt >= cameras.cameras_.length){
        console.log("\n  RECEIVED 4 IMAGES  \n".cyan.bold);
        //imgCt = 0; //reset for next take
        // ImageProcessQueue.push([these4images], function(err){ processingTake = false; });
      }
      imageProcessQueue.push(filePath, function (err) {
        if(err) console.log('ERROR processImage: '.red, err); //console.log('finished processing image.'.green);
      });
    } //else console.log('changeType: '.gray+changeType+' filePath: '.gray+filePath);
  }
});


/* Express config */
app.use(express.static('./public'));
app.use('/images',express.static(global.SAVE_IMG_FOLDER));


function snap(){
    latestImages=[];
    takeNumber++;
    imgCt = 0;
    console.log('\n------------------\n'.gray+'  Snap Photo!  '.green.bold.inverse + '  ||  '.gray.bold+'Take #'.cyan.bold+takeNumber);
    io.sockets.emit('loading',null);
    cameras.takePhotos(function(e){
      if(!e) return true
      console.log('ERROR takePhotos:'.red,e);
      return false;
    });
}


/* Stop any PTPCamera processes -- this is an auto-launched app on OSX */
var killAll = exec('killall PTPCamera gphoto2',function (error, stdout, stderr) {
  cameras = Cameras(function(e){
    if(e) console.log('camera setup failed:'.red, e);
      //console.log("camera setup failed, restarting app.");
      // setTimeout(function(){
      //   process.exit(1);  
      // }, 3000);
    //}
    //else {      
      console.log("camera setup complete".gray);
      setupComplete = true;
      setupSockets();
      server.listen(port);

      /*** START THE HTTP SERVER ***/
      // http.createServer(app).listen(port, function(){
        console.log();
        console.log('  CAMERA APP   Server Running!  '.white.inverse);
        console.log('  HTTP Express Server Running!  '.gray.inverse);
        var listeningString = ' Magic happening on port: '+ port +"  ";
        console.log(listeningString.cyan.inverse);

        // var photoInterval = setInterval(snap, SNAP_INTERVAL*1000);
        Scheduler.init(snap, function(timeOfNextSnap){
          moment.relativeTimeThreshold('s', 55);
          moment.relativeTimeThreshold('m', 55);
          console.log('>>> Time until next snap:'.cyan.bold, moment(timeOfNextSnap).from(new Date()),'>>>'.gray, timeOfNextSnap )
        });
      // }); 
    //}
  });
});

/*** in case of socket enabled front-end ***/
var setupSockets = function(){
  //console.log(cameras);
  io.on('connection', function(socket){
    console.log('socket connection created.'.yellow);
    //if(!setupComplete) 
      // socket.broadcast.emit('loading', null);
      io.sockets.emit('finished',latestImages);
    // fs.readdir(global.RAW_IMG_FOLDER,function(err,files){
    //fs.readdir(global.SCALED_IMG_FOLDER,function(_err,files){
      //socket.emit('init', null);
      //checkout /images for all image files, (exclude DS_Store);
      //console.log("error: ".red+_err);
      // Images.findOrCreate(_.without(files, ".DS_Store"),function(err,_images){
      //   if(err) return socket.emit('error',err);
      //   return socket.emit('init',_images);
      // });
    //});

    /* Socket API */
    socket.on('snap',function(data){
      // if(!processingTake){
        // processingTake = true;
        console.log('Snap Photo! '.green+JSON.stringify(data));
        snap();
        //*****NEW****
        
        // processingTake = false;
        //*******
      // } else console.log('Snap Photo: '+'Wait for previous take to finish processing'.red);
    });
  });
};
