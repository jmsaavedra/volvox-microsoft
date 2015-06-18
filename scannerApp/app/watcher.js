/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  WATCHER.JS
*	- creates file watcher on global.FOLDER_TO_WATCH
*	- when file is CREATED:
*		- UPLOAD to Azure with AzureFiler
*		- HTTP POST {fileURL, date} to global.BULLI_SERVER
*
*
*/

var watchr 		= require('watchr'),
	azureFiler 	= require('./azureFiler'),
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
	                console.log("INIT watching the path: ".green.bold + watcherInstance.path + " SUCCESS".green.bold);
	            }
	        },
	        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
	        	console.log('\n-------------- FOLDER CHANGED ----------------'.gray.bold);
	            // console.log('verbose change event info: '+arguments);
	            if (arguments[0] === 'create'){
	            	
	            	/***
	            	/* A NEW FILE HAS BEEN ADDED TO THE FOLDER
	            	*/
	            	console.log('>> new local file created: '.cyan);
	            	console.log('\t'+arguments[1]);
	            	var fname = path.basename(arguments[1]);

					azureFiler.uploadImage(arguments[1], fname, function(e, data){
						if(e) return console.log('ERROR uploading Scan: '.red.bold+e);
						if(!data) return console.log('NO DATA RETURNED when uploading Scan: '.red.bold+e);
						
						console.log('About to POST to El Bulli Server: '.yellow+JSON.stringify(data,null,'\t'));

						//*** send this data to the routing server to save to DB: ***//
						postData(data);
					});
	            }

	            else if (arguments[0] === 'delete'){

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
		'file': data.file
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
	  		if(JSON.parse(chunk).data !== true)
	  			return console.log('ERROR ON POST TO EL BULLI SERVER: '.red.bold+chunk);
	  		
	  		console.log('SUCCESS HTTP POST to El Bulli Server.'.green);	
	  		console.log('-----------------------------------------------\n'.gray);	
	  	});
	});

	post_req.on('error', function(e) {
	  return console.log('>>! ERROR with POST request: '.red + e.message);
	});

	// execute post
	post_req.write(post_data);
	post_req.end();
};





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

