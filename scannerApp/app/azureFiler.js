/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  AZURE FILE STORAGE
*
*/

var azure = require('azure-storage');
var moment 			= require('moment');

var STORAGE_ACCOUNT = 'elbulliscanner';
var STORAGE_KEY = 'bmZLz1PPrcwj48gl7fLxEk4r+I1qqQEZpPA7ng2QV9sgY/VqPcvkWiFeMUZn142TXu92qH3tPSJwfvQair8PqA==';

var blobService = azure.createBlobService(STORAGE_ACCOUNT, STORAGE_KEY);

//console.log(moment().format('YYYY-MM-DD'));

module.exports.uploadImage = function(filePath, fileName, cb){

	var today = moment().format('YYYY-MM-DD');

	blobService.createContainerIfNotExists(today, {
		  publicAccessLevel: 'blob'
		}, function(error, result, response) {
	  if (!error) {
	  	console.log('container created result: '.green + result);// if result = true, container was created. if result = false, container already existed.
	  	console.log('container created resp: '.green + JSON.stringify(response,null,'\t'));
	    
	    uploadFile(today, filePath, fileName, cb);

	  } else {
	  	console.log('error creating container: '.red + error);
	  	console.log('error creating container result: '.red + result);
	  	console.log('error creating container resp: '.red + JSON.stringify(response,null,'\t'));
	  	cb(error);
	  }
	});
};

function uploadFile (container, path, name, callback){

	blobService.createBlockBlobFromLocalFile(container, name, path, function(error, result, response) {
	  if (!error) {
	    // file uploaded
	    console.log('blockBlob created result: '.yellow + JSON.stringify(result,null,'\t'));
	  	console.log('blockBlob created resp: '.yellow + JSON.stringify(response,null,'\t'));

	  	// https://elbulliscanner.blob.core.windows.net/2015-06-14/5511a1a8f20a6250693c8ff1.jpg
	  	var fileUrl = 'https://elbulliscanner.blob.core.windows.net/'+result.container+'/'+result.blob;
	  	console.log('BLOCKBLOB URL: '.green.bold + fileUrl);
	  	var data = {date: container, file: fileUrl};
	  	
	  	callback(null, data);

	  } else {
	  	console.log('error creating blockBlob: '.red + error);
	  	console.log('error creating blockBlob result: '.red + result);
	  	console.log('error creating blockBlob resp: '.red + JSON.stringify(response,null,'\t'));

	  	callback(error)
	  }
	});
}


