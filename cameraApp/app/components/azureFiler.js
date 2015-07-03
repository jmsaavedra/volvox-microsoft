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
var blobService = azure.createBlobService(global.KEYS.AZURE_PHOTO_STORAGE_ACCOUNT, global.KEYS.AZURE_PHOTO_STORAGE_KEY);



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
      // : console.log('container already exists: '.gray+today);
      //console.log('container created result: '.green + result);
      //console.log('container created FULL response: '.green + JSON.stringify(response,null,'\t'));
      
      /* created/checked container, now upload this file to it */
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
      //console.log('Azure Blob create response: '.yellow + JSON.stringify(response));
      console.log(chalk.green('SUCCESS Azure Blob upload: ') + result.container + '/' + result.blob);

      moveFile(container, fpath, name, function(e){
        if(e) console.log(chalk.red('error on moveFile: ') + e);
        // else console.log(chalk.yellow('SUCCESS copy image to: '),fpath);
        var fileUrl = global.KEYS.AZURE_PHOTO_BLOB_ADDR+'/'+result.container+'/'+result.blob;
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
      console.log('folder NOT exist, creating now')
       fs.mkdirSync(path.join(global.SAVE_IMG_FOLDER, container));
       cutPasteFile(fpath, path.join(global.SAVE_IMG_FOLDER, container, name), cb);
    }
  });

  function cutPasteFile(oldPath, newPath, _cb){
    fs.rename(oldPath, newPath, function(e, stats){
      if(e) console.log(chalk.red('error fs.rename: ') + e);
      _cb(e);
    })
  }
}


