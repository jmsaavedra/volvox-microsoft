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
var path      = require('path');
var blobService = azure.createBlobService(global.STORAGE_ACCOUNT, global.STORAGE_KEY);



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
      // : console.log('container already exists: '.gray+today);
      //console.log('container created result: '.green + result);
      //console.log('container created FULL response: '.green + JSON.stringify(response,null,'\t'));
      
      /* created/checked container, now upload this file to it */
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
      console.log('folder NOT exist, creating now')
       fs.mkdirSync(path.join(global.SAVE_IMG_FOLDER, container));
       cutPasteFile(fpath, path.join(global.SAVE_IMG_FOLDER, container, name), cb);
    }
  });
}

function cutPasteFile(oldPath, newPath, _cb){
  fs.rename(oldPath, newPath, function(e, stats){
    if(e) console.log('error fs.rename: '.red + e);
    _cb(e);
  })
}

