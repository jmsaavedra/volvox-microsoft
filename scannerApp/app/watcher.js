/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  WATCHER.JS
*	- creates file watcher on global.FOLDER_TO_WATCH
*	- when file is CREATED:
*		- UPLOAD to Vimeo with vimeo.js
*		- HTTP POST {fileURL, date} to global.BULLI_SERVER
*
*
*/

var watchr 		= require('watchr'),
	azureFiler 	= require('./azureFiler'),
	nodemailer  = require('./nodemailer'),
	path 		= require('path'),
	http 		= require('http'),
	querystring = require('querystring');


/***
/* INIT Folder Watcher 
*/
module.exports.init = function(){
	watchr.watch({
	    paths: [global.FOLDER_TO_WATCH],
	    listeners: {
	        log: function(logLevel){
	            //console.log('a log message occured:', arguments);
	        },
	        error: function(err){
	            console.log('an error occured:', err);
	        },
	        watching: function(err,watcherInstance,isWatching){
	            if (err) {
	                console.log("watching the path " + watcherInstance.path + " failed with error: ".red.bold, err);
	            } else {
	                console.log("Watching for scans in folder: \n    ".green.bold + watcherInstance.path.magenta.bold + "\nSUCCESS".green.bold+'\n================================='.gray.bold);
	            }
	        },
	        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
	        	console.log('\n-------------- FOLDER CHANGED ----------------'.gray.bold);
	            // console.log('verbose change event info: '+arguments);
	            if (changeType === 'create'){
	            	
	            	/***
	            	/* A NEW FILE HAS BEEN ADDED TO THE FOLDER
	            	*/
	            	console.log('>> new local file created: '.cyan);
	            	console.log('\t'+filePath);
	            	var raw_fname = path.basename(filePath);
	            	var fname = raw_fname.replace(/ /g, "-");

	            	fs.stat(filePath, function(e, stats){
	            		if(stats.size < 7500000){
	            			azureFiler.uploadImage(filePath, fname, function(e, data){
								if(e) return console.log('ERROR uploading Scan: '.red.bold+e);
								if(!data) return console.log('NO DATA RETURNED when uploading Scan: '.red.bold+e);
								
								console.log('About to POST to El Bulli Server: '.yellow+JSON.stringify(data,null,'\t'));

								//*** send this data to the routing server to save to DB: ***//
								postData(data);
							});
	            		} else console.log('file too large, not uploading.'.red.bold, stats.size/1000, ' kb');
	            	});
	            }

	            else if (changeType === 'delete'){

	            	/* FILE HAS BEEN DELETED */	            	
	            	console.log('>> file deleted: '.red+filePath);
	            }
	        }
	    },
	    next: function(err,watchers){
	        if (err) {
	            return console.log("watching everything failed with error", err);
	        } else {
	            // console.log('watching everything completed', watchers);
	            console.log('------- watching inited --------'.gray.inverse);
	        }
	 
	        // Close watchers after 60 seconds 
	        // setTimeout(function(){ var i;
	        //     for ( i=0;  i<watchers.length; i++ ) { watchers[i].close(); }
	        // },60*1000);
	    }
	});
};


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
		host: global.KEYS.BULLI_SERVER.host,
		port: global.KEYS.BULLI_SERVER.port,
		path: global.KEYS.BULLI_SERVER.PATH.scan,

		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': post_data.length
		}
	};
  	// console.log('post_options: '+JSON.stringify(post_options,null,'\t'));

	/* Set up the request */
	var post_req = http.request(post_options, function(res) {
	  	res.setEncoding('utf8');
	  	res.on('data', function (chunk) {
	  		console.log('Server Response: '.yellow + chunk);
	  		if(JSON.parse(chunk).data !== true){
	  			reportError('ERROR ON POST TO EL BULLI SERVER', chunk);
	  			return console.log('ERROR ON POST TO EL BULLI SERVER: '.red.bold+chunk);
	  		}
	  		
	  		console.log('SUCCESS HTTP POST to El Bulli Server.'.green);	
	  		console.log('-----------------------------------------------\n'.gray);	
	  	});
	});

	post_req.on('error', function(e) {
		console.log('>>! ERROR with POST request: '.red + e.message);
		console.log('sending email... '.yellow.bold);
		var body = 'ERROR trying to POST to elbulliserver:\n'+e.message;
		body += '\n\npost_options: '+'\n'+JSON.stringify(post_options,null,'\t');
		body += '\n\npost_data: \n'+JSON.stringify(post_data,null,'\t');
		body += 'Date: '+data.date;
		return reportError('Error Posting Scan to Server',body);
	});

	// execute post
	post_req.write(post_data);
	post_req.end();
};


function reportError(subj, body){
	
	nodemailer.sendEmail(subj, body, function(e, info){
		if(e) console.log('fail send email.'.red.bold);
		else return console.log('Message sent: '+info.response);
	});
}




//PATH ON WINDOWS:

// path.parse('C:\\path\\dir\\index.html')
// // returns
// {
//     root : "C:\",
//     dir : "C:\path\dir",
//     base : "index.html",
//     ext : ".html",
//     name : "index"
// }

