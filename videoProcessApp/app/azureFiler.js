/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  AZURE FILE STORAGE
*
*/

/* Includes and Azure Service */
var moment    = require('moment');
var azure     = require('azure-storage');
var fs        = require('graceful-fs');
var rimraf    = require('rimraf');
var async     = require('async');
var path      = require('path');
var mkdirp    = require('mkdirp');
var blobService = azure.createBlobService(global.KEYS.AZURE_PHOTO_STORAGE_ACCOUNT, global.KEYS.AZURE_PHOTO_STORAGE_KEY);



module.exports.downloadImages = function (containerName, destinationDirectoryPath, callback) {
  console.log('Downloading images from Container:'.green, containerName);
  var localImgs = [];

  // Validate directory
  mkdirp.sync(destinationDirectoryPath) ? console.log('created today\'s process folder:'.yellow.bold, destinationDirectoryPath) : console.log();

  // NOTE: does not handle pagination.
  blobService.listBlobsSegmented(containerName, null, function (error, result) {
    // console.log('list all files: '+JSON.stringify(result.entries, null, '\t'));
    if (error) {
      console.log('error listBlobsSegmented:'.red, error);
      callback(error);
    } else {
      var blobs = result.entries;
      console.log('Total ct files in this container: '.cyan.bold+ blobs.length);
      var fileCt = 0;
      async.eachSeries(blobs, function (blob, cb) {
        fileCt++;
        var thisLocalFilePath = destinationDirectoryPath + '/' + blob.name;
        //console.log('checking for raw file: '.gray+ blob.name);

        fs.stat(thisLocalFilePath, function(e, stats){
          if(!e && stats.size > 50000){ // if file exists AND is over 50kb
            console.log('raw file exists: '.gray.bold+blob.name);
            return cb();  
          } else {
            console.log('attempt dl new file: '.yellow, blob.name);
            blobService.getBlobToLocalFile(containerName, blob.name, thisLocalFilePath, function (error2) {
              if (error2) {
                console.log('error on blob download:'.red, error2);
                cb(error2);
              } else {
                console.log('Finished downloading file '.green, fileCt+'/'.gray+blobs.length,':',blob.name);
                localImgs.push(blob.name);
                clearTimeout(global.DL_WATCHDOG);
                global.DL_WATCHDOG = setTimeout(global.DL_PROCESS, 6000);
                cb();
              }
            });
          }
        });
      }, function(e){
        if(e) return callback(e);
        else {
          console.log('  ALL RAW FILES DOWNLOADED  '.green.bold.inverse, 'for Date:',containerName);
          clearTimeout(global.DL_WATCHDOG);
          callback(null, localImgs);
        }
      });
    }
  });
};


/***
/* Upload a File routine
*/
module.exports.uploadImage = function(filePath, fileName, cb){

  var today = moment().format('YYYY-MM-DD');
  /* First, Create Container for Today */
  blobService.createContainerIfNotExists(today, {
      publicAccessLevel: 'blob'
    }, function(error, result, response) {
    if (!error) {
      
      if(result) console.log('new container created: '.green+today);

      /* now UPLOAD this file to it */
      uploadFile(today, filePath, fileName, cb);

    } else {
      console.log('>> creating container error: '.red + error);
      console.log('>> result: '.red + result);
      console.log('>> response: '.red + JSON.stringify(response,null,'\t'));
      cb(error);
    }
  });
};

function uploadFile (container, fpath, name, callback){

  blobService.createBlockBlobFromLocalFile(container, name, fpath, function(error, result, response) {
    if (!error) {
      //*** file uploaded ***
      //console.log('blockblob created result: '+JSON.stringify(result,null,'\t'));
      //console.log('Azure Blob create response: '.yellow + JSON.stringify(response));
      console.log('SUCCESS Azure Blob upload: '.green + result.container + '/' + result.blob);

      moveFile(container, fpath, name, function(e){
        if(e) console.log('error on moveFile: '.red + e);
        else console.log('SUCCESS copy image to: '.yellow,fpath);
        var fileUrl = global.AZURE_BLOB_ADDR+'/'+result.container+'/'+result.blob;
        console.log('BLOB URL: '.cyan.bold + fileUrl);
        var data = {date: container, file: fileUrl, type: 'photo'};
        callback(null, data);
      });

    } else {
      console.log('error creating blockBlob: '.red + error);
      console.log('error creating blockBlob result: '.red + result);
      console.log('error creating blockBlob resp: '.red + JSON.stringify(response,null,'\t'));

      callback(error);
    }
  });
}

function moveFile(container, fpath, name, cb){
  fs.exists(path.join(global.SAVE_IMG_FOLDER, container), function(exists){
    if(exists){
      // console.log('folder exists')
      cutPasteFile(fpath, path.join(global.SAVE_IMG_FOLDER, container, name), cb);
    } else {
      console.log('folder NOT exist, creating now');
       fs.mkdirSync(path.join(global.SAVE_IMG_FOLDER, container));
       cutPasteFile(fpath, path.join(global.SAVE_IMG_FOLDER, container, name), cb);
    }
  });
}

function cutPasteFile(oldPath, newPath, _cb){
  fs.rename(oldPath, newPath, function(e, stats){
    if(e) console.log('error fs.rename: '.red + e);
    _cb(e);
  });
}

