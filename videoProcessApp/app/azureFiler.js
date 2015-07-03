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
  console.log(chalk.green('Downloading images from Container:'), containerName);
  var localImgs = [];

  // Validate directory
  if(mkdirp.sync(destinationDirectoryPath)) console.log(chalk.yellow.bold('created today\'s process folder:'), destinationDirectoryPath);

  // NOTE: does not handle pagination.
  blobService.listBlobsSegmented(containerName, null, function (error, result) {
    // console.log('list all files: '+JSON.stringify(result.entries, null, '\t'));
    if (error) {
      console.log(chalk.red('error listBlobsSegmented:'), error);
      callback(error);
    } else {
      var blobs = result.entries;
      console.log(chalk.cyan.bold+ blobs.length);
      var fileCt = 0;
      async.eachSeries(blobs, function (blob, cb) {
        fileCt++;
        var thisLocalFilePath = destinationDirectoryPath + '/' + blob.name;
        //console.log('checking for raw file: 'chalk.gray+ blob.name);

        fs.stat(thisLocalFilePath, function(e, stats){
          if(!e && stats.size > 50000){ // if file exists AND is over 50kb
            console.log(chalk.gray.bold('raw file exists: ')+blob.name);
            return cb();  
          } else {
            console.log(chalk.gray('container:'),containerName,chalk.yellow('attempt DL file:'), chalk.gray(blob.name));
            blobService.getBlobToLocalFile(containerName, blob.name, thisLocalFilePath, function (error2) {
              if (error2) {
                console.log(chalk.red('error on blob download:'), error2);
                cb(error2);
              } else {
                console.log(fileCt+chalk.gray('/')+blobs.length,chalk.green(' Success downloading new file:'),blob.name);
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
          console.log(chalk.green.bold.inverse('  ALL RAW FILES DOWNLOADED  '), 'for Date:',containerName);
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
      
      if(result) console.log(chalk.green('new container created: ')+today);

      /* now UPLOAD this file to it */
      uploadFile(today, filePath, fileName, cb);

    } else {
      console.log(chalk.red('>> creating container error: ') + error);
      console.log(chalk.red('>> result: ') + result);
      console.log(chalk.red('>> response: ') + JSON.stringify(response,null,'\t'));
      cb(error);
    }
  });
};

function uploadFile (container, fpath, name, callback){

  blobService.createBlockBlobFromLocalFile(container, name, fpath, function(error, result, response) {
    if (!error) {
      //*** file uploaded ***
      //console.log('blockblob created result: '+JSON.stringify(result,null,'\t'));
      //console.log('Azure Blob create response: 'chalk.yellow + JSON.stringify(response));
      console.log(chalk.green('SUCCESS Azure Blob upload: ') + result.container + '/' + result.blob);

      moveFile(container, fpath, name, function(e){
        if(e) console.log(chalk.red('error on moveFile: ') + e);
        else console.log(chalk.yellow('SUCCESS copy image to: '),fpath);
        var fileUrl = global.AZURE_BLOB_ADDR+'/'+result.container+'/'+result.blob;
        console.log(chalk.cyan.bold('BLOB URL: ') + fileUrl);
        var data = {date: container, file: fileUrl, type: 'photo'};
        callback(null, data);
      });

    } else {
      console.log(chalk.red('error creating blockBlob: ') + error);
      console.log(chalk.red('error creating blockBlob result: ') + result);
      console.log(chalk.red('error creating blockBlob resp: ') + JSON.stringify(response,null,'\t'));

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
    if(e) console.log(chalk.red('error fs.rename: ') + e);
    _cb(e);
  });
}

