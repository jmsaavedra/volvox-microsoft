/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  AZURE FILE STORAGE
*
*/

/* Includes and Azure Service */
var moment 		= require('moment');
var azure 		= require('azure-storage');
var nodemailer  = require('./nodemailer');
var blobService = azure.createBlobService(global.KEYS.AZURE_SCAN_STORAGE_ACCOUNT, global.KEYS.AZURE_SCAN_STORAGE_KEY);


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
	  	
	  	result ? console.log('new container created: '.green+today) : console.log('container already exists: '.gray+today);
	  	//console.log('container created result: '.green + result);
	  	//console.log('container created FULL response: '.green + JSON.stringify(response,null,'\t'));
	    
	    /* created/checked container, now upload this file to it */
	    uploadFile(today, filePath, fileName, cb);

	  } else {
	  	console.log('>> creating container error: '.red + error);
	  	console.log('>> result: '.red + result);
	  	console.log('>> response: '.red + JSON.stringify(response,null,'\t'));
	  	var body = 'error creating container: ' + error;
	  	body += '\n>> result: ' + result;
	  	body += '\n>> resp: '.red + JSON.stringify(response,null,'\t');
	  	reportError('Error: Scan Upload to Azure', body);
	  	cb(error);
	  }
	});
};

function uploadFile (container, path, name, callback){

	blobService.createBlockBlobFromLocalFile(container, name, path, function(error, result, response) {
	  if (!error) {
	    //*** file uploaded ***
	    //console.log('blockblob created result: '+JSON.stringify(result,null,'\t'));
	    //console.log('Azure Blob create response: '.yellow + JSON.stringify(response));
	    console.log('SUCCESS Azure Blob upload: '.green + result.container + '/' + result.blob);

	  	var fileUrl = 'https://elbulliscanner.blob.core.windows.net/'+result.container+'/'+result.blob;
	  	console.log('BLOB URL: '.cyan.bold + fileUrl);
	  	var data = {date: container, file: fileUrl, type: 'scan'};

	  	callback(null, data);

	  } else {
	  	console.log('error creating blockBlob: '.red + error);
	  	console.log('error creating blockBlob result: '.red + result);
	  	console.log('error creating blockBlob resp: '.red + JSON.stringify(response,null,'\t'));
	  	console.log('sending error report email...'.yellow);
	  	var body = 'error creating blockBlob: ' + error;
	  	body += '\nerror creating blockBlob result: ' + result;
	  	body += '\nerror creating blockBlob resp: '.red + JSON.stringify(response,null,'\t');
	  	reportError('Error: Scan Upload to Azure', body);
	  	callback(error);
	  }
	});
}


function reportError(subj, body){
	
	nodemailer.sendEmail(subj, body, function(e, info){
		if(e) console.log('fail send email.'.red.bold);
		else return console.log('Message sent: '+info.response);
	});
}

