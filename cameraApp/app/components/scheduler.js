
var colors  = require('colors'),
  _         = require('lodash'),
  async     = require('async'),
  fs        = require('fs'),
  moment    = require('moment');

// function Scheduler(){
//   return this;
// }

module.exports.init = function(cameras, cb){
  var self = this;
  console.log('hit scheduler.init!!');
  var photoInterval = setInterval(snap(cameras), 10000);
  cb();
}

var snap = function(cams){
  cams.takePhotos(function(e){
    if(e) console.log('ERROR ON SNAP: '.red + e);
  });
}


// /***
// /* INIT Cameras
// /*
// */
// function Cameras(_cb){
  
//   var self = this;
//   this.cameras_ = null;

//   GPhoto.list(function (list) {
//     if (list.length === 0){
//       console.log(" >>> NO CAMERAS FOUND <<< ".red.inverse);
//       return _cb("no cameras found");
//     }
//     // var camera = list[0];
//     self.cameras_ = list;

//     var id=0;
//     async.eachSeries(list, function(_thisCam, cb){
//       var thisCam = _thisCam;
//       thisCam.id=id;
//       self.cameras_[id] = thisCam;
//       console.log('Found Camera '.cyan+id, 'model'.gray, thisCam.model, 'on port'.gray, thisCam.port);
//       id++;
//       cb();
//     }, function(_e){
//       if(_e) return _cb(_e);
//       takePhotos(function(er){
//         _cb(er);
//       });
//     });
//   });
//   return self;
// }



// /***
// /* TAKE PHOTO on all cameras
// /*
// */
// Cameras.prototype.takePhotos = takePhotos =  function(_cb){

//   var self=this;
//   var now = moment().format('YYYY-MM-DD_HH-mm-ss');

//   async.each(this.cameras_, function(cam, cb){
//     console.log("take picture on cam: "+JSON.stringify(cam));

//     cam.takePicture({
//       download:true
//       }, function (er, data) {
        
//         if(!data){
//           //var _thisCamIdx = _.findIndex(self.cameras_, { 'id': cam.id });
//           //self.cameras_.splice(_thisCamIdx, 1);
//           return cb("snap error: no image returned, camera: ".red + cam.id);
//         }
//         var filePath = global.RAW_IMG_FOLDER+'/'+now+'_cam'+'_'+cam.id+'.jpg';
//         //TODO: async!
//         fs.writeFileSync(filePath, data); 
//         cb(er);
//       });
//     }, function(e){
//     if(e) console.log("error taking snap: ".red + e);
//     _cb(e);
//   });
// };



// module.exports = Cameras;
