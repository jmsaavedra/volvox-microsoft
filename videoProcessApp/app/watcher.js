// /****
// *
// * VOLVOX x MICROSOFT
// * ==============================================
// *
// *  WATCHER.JS
// *	- creates file watcher on global.FOLDER_TO_WATCH
// *	- when file is CREATED:
// *		- UPLOAD to Vimeo with vimeo.js
// *		- HTTP POST {fileURL, date} to global.BULLI_SERVER
// *
// *
// */

var watchr 		= require('watchr'),
	vimeo 		= require('./vimeo'),
	path 		= require('path'),
	rimraf 		= require('rimraf'),
	http 		= require('http'),
	request 	= require('request');


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
	            console.log(chalk.red.bold('File watch error ocurred: '), err);
	        },
	        watching: function(err,watcherInstance,isWatching){
	        	
	            if (err) console.log(chalk.red.bold("ERROR watching the path ") + watcherInstance.path + chalk.red.bold(" failed, err: "), err);
	            //else console.log("INIT watching the path: "chalk.green.bold + watcherInstance.path + " SUCCESS"chalk.green.bold);
	        },
	        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
	        	console.log(chalk.cyan.bold('\n-------------- WATCH-UPLOAD FOLDER CHANGED ----------------'));
	            // console.log('verbose change event info: '+arguments);
	            if (arguments[0] === 'create'){
	            	
	            	/* A NEW FILE HAS BEEN ADDED TO THE FOLDER */
	            	console.log(chalk.cyan('>> new local file created: '));
	            	console.log('\t'+arguments[1]);

	            	if(!global.UPLOAD_FLAG) //in case of dev
						return console.log('global.UPLOAD_FLAG set to false, not uploading.');

					vimeo.uploadVideo(arguments[1], function(e, data){
						if(e) return console.log(chalk.red.bold('ERROR uploading to Vimeo: ')+e);
						// if(!data) return console.log('NO DATA RETURNED when uploading Scan: 'chalk.red.bold+e);
						console.log(chalk.yellow('About to POST to El Bulli Server: ')+JSON.stringify(data,null,'\t'));

						// send this data to the routing server to save to DB:
						postData(data, function(_e, filename){
							if(_e) console.log(chalk.red('error posting to our server: ')+_e);

							rimraf(path.join(global.FOLDER_TO_WATCH,filename), function(_er){
								if(_er) console.log(chalk.red('error removing uploaded video: ')+_er);
								console.log(chalk.green('Finished Vimeo Upload via Watcher.'), chalk.gray('Deleted: ')+filename);
							});
						});
					});

	            } else if (arguments[0] === 'delete'){

	            	/* FILE HAS BEEN DELETED */	            	
	            	console.log(chalk.yellow('>> file removed: ')+filePath);
	            }
	        }
	    },
	    next: function(err,watchers){

	        if (err) {
	            return console.log("watching everything failed with error", err);
	        } else if (watchers.length<1){
            	console.log(chalk.red.bold("Watching the path ")+ global.FOLDER_TO_WATCH + chalk.red.bold(" FAILED."), " Check folder exists?");
            } else {
	            //console.log('File Watcher inited: 'chalk.green.bold+ global.FOLDER_TO_WATCH );
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
var postData = function(data, cb){
	var postURL = 'http://'+global.KEYS.BULLI_SERVER.host+':'+global.KEYS.BULLI_SERVER.port+global.KEYS.BULLI_SERVER.PATH.video;
	// console.log('posting to url: '+postURL);
	request.post({
		url: postURL,
		body: data,
		json: true
	},
	function(err,httpResponse,body){
		if(err) console.log('postData err: '+err);
		// console.log('httpResponse: '+JSON.stringify(httpResponse, null, '\t'));
		console.log(chalk.cyan('server response body: ')+JSON.stringify(body, null, '\t'));
		cb(err, body.data);
	});
};



//PATH ON WINDOWS: https://nodejs.org/api/path.html

// path.parse('C:\\path\\dir\\index.html')
// // returns
// {
//     root : "C:\",
//     dir : "C:\path\dir",
//     base : "index.html",
//     ext : ".html",
//     name : "index"
// }

