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
	console.log('BEGIN UPLOAD IMAGE: '.cyan+imgPath);
 
	handler.uploadToAzure(imgPath, cb);
}

/***
*  UPLOAD this file to Azure File Storage
*
*/
handler.uploadToAzure = function(img, callb){

	AzureFiler.uploadImage(img, path.basename(img), function(e, data){
		if(e) return callb('error uploading to Azure: '.red.bold+e);
		if(!data) return callb('NO DATA RETURNED when uploading to Azure: '.red.bold+e);

		console.log('POSTing to El Bulli Server: '.yellow+JSON.stringify(data,null,'\t'));
		//*** send this data to the routing server to save to DB: ***//
		handler.postDataToElBulli(data, function(e, data){
			callb();
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
			if(JSON.parse(chunk).data !== true){
				console.log('ERROR ON POST TO EL BULLI SERVER: '.red.bold+chunk);
				return callback('ERROR ON POST: ',chunk);
			}

			console.log('SUCCESS HTTP POST to El Bulli Server.'.green); 
			console.log('=========================================================='.gray);
			callback(null, chunk);
		});
	});

	post_req.on('error', function(e) {
		console.log('>>! ERROR with POST request: '.red + e.message);
		return callback(e);
	});

	// execute post
	post_req.write(post_data);
	post_req.end();
}


module.exports = ImageHandler;
