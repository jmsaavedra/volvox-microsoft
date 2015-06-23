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
global.RAW_IMG_FOLDER   = __dirname+'/images-dl';
global.SAVE_IMG_FOLDER   = '/Users/jmsaavedra/Desktop/images-saved/';
global.AZURE_BLOB_ADDR  = 'https://elbulliphoto.blob.core.windows.net';
global.STORAGE_ACCOUNT  = 'elbulliphoto';
global.STORAGE_KEY      = '/nGzMNHlVPDxIhDeVBHwT5JYwx4xrosjPU90uszrlZSClLC956XNoIHduNHADqrr4L+Axm36D2LS215tWLSR5g==';
global.BULLI_SERVER = {
  host: 'elbulliweb.cloudapp.net',
  path: '/photo/new',
  port: '8080'
};

var fs        = require('graceful-fs'),
  http        = require('http'),
  path        = require('path'),
  colors      = require('colors'),
  _           = require('lodash'),
  async       = require('async'),
  express     = require('express'),
  app         = express(),
  querystring = require('querystring'),
  server      = require('http').Server(app),
  io          = require('socket.io')(server),
  exec        = require('child_process').exec,
  azureFiler  = require('./app/components/azureFiler'),
  scheduler   = require('./app/components/scheduler'),
  Cameras     = require('./app/components/cameras'),
  cameras     = null,
  port        = 8081,
  processingTake = false,
  setupComplete  = false; //camera setup

/* check that images folder exists */
if (!fs.existsSync(global.RAW_IMG_FOLDER)) fs.mkdirSync(global.RAW_IMG_FOLDER);
if (!fs.existsSync(global.SAVE_IMG_FOLDER)) fs.mkdirSync(global.SAVE_IMG_FOLDER);

/* Gulp Watcher */
var watchr = require('watchr');
var takeNumber = 0;
var fileCounter = 0;

watchr.watch({
  path: global.RAW_IMG_FOLDER,
  listener:  function(changeType,filePath,fileCurrentStat,filePreviousStat){
    // console.log('changeType: '.cyan+changeType);
    if(changeType === 'create'){
      console.log('File Added: '.green+filePath);
      var fileName = path.basename(filePath);
      imageProcessHandler(filePath, fileName, function(e){
        // console.log("fileCounter: "+fileCounter);
        fileCounter++;
        //console.log("cameras.cameras_.length: "+cameras.cameras_.length);
        if (fileCounter == cameras.cameras_.length){
          processingTake = false;
          fileCounter = 0;
        } //else console.log('DID NOT TAKE ALL PHOTOS: fileCounter: '.red + fileCounter);
      });
    } else {
      console.log('changeType: '.gray+changeType+' filePath: '.gray+filePath);
    }
  }
});


/* Handler for after a file is added to watched folder */
var imageProcessHandler = function(imgPath, imgName, cb){
  console.log('UPLOADING IMAGE: '.cyan+imgPath);
  azureFiler.uploadImage(imgPath, imgName, function(e, data){
    if(e) return console.log('ERROR uploading to Azure: '.red.bold+e);
    if(!data) return console.log('NO DATA RETURNED when uploading to Azure: '.red.bold+e);
    
    console.log('About to POST to El Bulli Server: '.yellow+JSON.stringify(data,null,'\t'));

    //*** send this data to the routing server to save to DB: ***//
    postData(data);
    cb(null);
  });
};


/* Express config */
app.use(express.static('./public'));
app.use('/images',express.static(global.RAW_IMG_FOLDER));

/* HTTP routes */
app.get('/snap', function(req, res) { 
  console.log('hit /test'.gray);
  if(snap()){
    return res.send('SUCCESS on take photo');
  } else return res.send('Wait for last snap to finish');
  // snap(function(e){
  //   if(e) return res.send(e);
  //   res.send('SUCCESS on take photo');
  // });
});


function snap(){
  
  if(!processingTake){
    processingTake = true;
    takeNumber++;
    console.log('\n------------------\n'.gray+'Snap Photo! '.green + '  ||  '.gray.bold+'Take #'.cyan+takeNumber);
    cameras.takePhotos(function(e){});
    processingTake = false;
    return true;// cb();
  } else return false;//cb('Wait for last to finish');
}




/***
/* POST data object to ElBulli Server
*/
var postData = function(data){

  var post_data = querystring.stringify({
    'date' : data.date,
    'file' : data.file,
    'type' : data.type
  });

    var post_options = {
        host: global.BULLI_SERVER.host,
      port: global.BULLI_SERVER.port,
        path: global.BULLI_SERVER.path,
      
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
        }
    };

  /* Set up the request */
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Server Response: '.yellow + chunk);
        if(JSON.parse(chunk).data !== true)
          return console.log('ERROR ON POST TO EL BULLI SERVER: '.red.bold+chunk);
        
        console.log('SUCCESS HTTP POST to El Bulli Server.'.green); 
        console.log('-----------------------------------------------\n'.gray);  
      });
  });

  post_req.on('error', function(e) {
    return console.log('>>! ERROR with POST request: '.red + e.message);
  });

  // execute post
  post_req.write(post_data);
  post_req.end();
};


    

/* Stop any PTPCamera processes -- this is an auto-launched app on OSX */
var killAll = exec('killall PTPCamera gphoto2',function (error, stdout, stderr) {
  cameras = Cameras(function(e){
    //if(e){
      //console.log("camera setup failed, restarting app.");
      // setTimeout(function(){
      //   process.exit(1);  
      // }, 3000);
    //}
    //else {
      console.log("camera setup complete".green);
      setupComplete = true;

      /*** START THE HTTP SERVER ***/
      http.createServer(app).listen(port, function(){
        console.log();
        console.log('  CAMERA APP   Server Running!  '.white.inverse);
        console.log('  HTTP Express Server Running!  '.gray.inverse);
        var listeningString = ' Magic happening on port: '+ port +"  ";
        console.log(listeningString.cyan.inverse);
        
        var photoInterval = setInterval(snap, 30000);
      }); 
    //}
  });
});
/*** in case of socket enabled front-end ***/
// var setupSockets = function(){
//   //console.log(cameras);
//   io.on('connection', function(socket){
//     console.log('socket connection created.'.yellow);
//     if(!setupComplete) socket.broadcast.emit('loading', null);
//     // fs.readdir(global.RAW_IMG_FOLDER,function(err,files){
//     fs.readdir(global.SCALED_IMG_FOLDER,function(_err,files){
//       //checkout /images for all image files, (exclude DS_Store);
//       //console.log("error: ".red+_err);
//       Images.findOrCreate(_.without(files, ".DS_Store"),function(err,_images){
//         if(err) return socket.emit('error',err);
//         return socket.emit('init',_images);
//       });
//     });

//     /* Socket API */
//     socket.on('approve',function(data){
//       console.log('Approve: '+JSON.stringify(data));
//       Images.findById(data._id,function(err,image){
//         image.approve(function(err,_img){
//           //TODO Add socket emit to update all connections.
//           socket.broadcast.emit('approved',image);
//           console.log('Approved.');
//         });
//       });
//     });

//     socket.on('heart',function(data){
//       console.log('Heart: '+JSON.stringify(data));
//       Images.findById(data._id,function(err,image){
//         image.heart(function(err,_img){
//           //TODO Add socket emit to update all connections.
//           socket.broadcast.emit('hearted',image);
//           console.log('Hearted.');
//         });
//       });
//     });

//     socket.on('snap',function(data){
//       if(!processingTake){
//         processingTake = true;
//         console.log('Snap Photo! '.green+JSON.stringify(data));
//         cameras.takePhotos(function(e){});
//         //*****NEW****
//         io.sockets.emit('finished', null);
//         processingTake = false;
//         //*******
//       } else console.log('Snap Photo: '+'Wait for previous take to finish processing'.red);
//     });
//   });
// };
