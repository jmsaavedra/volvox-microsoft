/***
*	Image File Handler
*
*/

var fs        	= require('graceful-fs'),
	AzureFiler  = require('./azureFiler'),	
	querystring = require('querystring'),
	http        = require('http'),
	path      	= require('path');



var handler = ImageHandler.prototype;

function ImageHandler(imgPath, cb){

	/* new File Handler instantiated after a file is added to watched folder */
	console.log(chalk.cyan('Begin Upload Image to Azure:'), path.basename(imgPath));
	handler.uploadToAzure(imgPath, cb);
}

/***
*  UPLOAD this file to Azure File Storage
*
*/
handler.uploadToAzure = function(img, callb){

	AzureFiler.uploadImage(img, path.basename(img), function(e, data){
		if(e) return callb(chalk.red.bold('error uploading to Azure: ')+e);
		if(!data) return callb(chalk.red.bold('NO DATA RETURNED when uploading to Azure: ')+e);
		console.log(chalk.gray('Begin POST to elBulli Server...'));
		//console.log(chalk.yellow('POSTing to El Bulli Server: ')+JSON.stringify(data,null,'\t'));
		//*** send this data to the routing server to save to DB: ***//
		handler.postDataToElBulli(data, function(e, data){
			callb(e, path.basename(img), JSON.parse(data));
		});
	});
}

/***
*  UPDATE our database with a POST to our server.
*
*/
handler.postDataToElBulli = function(data, callback){

	var post_data = querystring.stringify({
		'date' : data.date,
		'file' : data.file,
		'type' : data.type
	});

	var post_options = {
		host: global.KEYS.BULLI_SERVER.host,
		port: global.KEYS.BULLI_SERVER.port,
		path: global.KEYS.BULLI_SERVER.PATH.photo,

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
			console.log(chalk.yellow('Server Response: ') + chunk);
			if(JSON.parse(chunk).data !== true){
				console.log(chalk.red.bold('ERROR ON POST TO EL BULLI SERVER: ')+chunk);
				return callback('ERROR ON POST: ',chunk);
			}

			console.log(chalk.green('SUCCESS POST to elBulli Server and DB.')); 
			console.log(chalk.gray('=========================================================='));
			callback(null, chunk);
		});
	});

	post_req.on('error', function(e) {
		console.log(chalk.red('>>! ERROR with POST request: ') + e.message);
		return callback(e);
	});

	// execute post
	post_req.write(post_data);
	post_req.end();
}


module.exports = ImageHandler;
