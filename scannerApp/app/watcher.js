/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  WATCHER APP
*
*/


var watchr = require('watchr');
var azureFiler = require('./azureFiler');
var path = require('path');
var http = require('http');
var querystring = require('querystring');

// var fs = require('fs');


module.exports.init = function(){

	console.log('WATCHER INIT'.gray);
	watchr.watch({
	    paths: ['/Users/jmsaavedra/Desktop/____watcher-test'],
	    listeners: {
	        log: function(logLevel){
	            //console.log('a log message occured:', arguments);
	        },
	        error: function(err){
	            console.log('an error occured:', err);
	        },
	        watching: function(err,watcherInstance,isWatching){
	            if (err) {
	                console.log("watching the path " + watcherInstance.path + " failed with error", err);
	            } else {
	                console.log("watching the path " + watcherInstance.path + " completed");
	            }
	        },
	        change: function(changeType,filePath,fileCurrentStat,filePreviousStat){
	        	console.log('------ FOLDER CHANGED ------'.green.bold);
	            console.log('a change event occured:',arguments);
	            if (arguments[0] === 'create'){
	            	
	            	/***
	            	/* A NEW FILE HAS BEEN ADDED TO THE FOLDER
	            	/*
	            	*/
	            	console.log('>> new file created: '.blue);
	            	console.log('\t'+arguments[1]);
	            	var fname = path.basename(arguments[1]);

								azureFiler.uploadImage(arguments[1], fname, function(e, data){
									if(e) return console.log('ERROR uploading Scan: '.red.bold+e);
									console.log('SUCCESS upload Scan: '+JSON.stringify(data));

									 var post_data = querystring.stringify({
									      'date' : data.date,
									      'file': data.file
									  });
									   var post_options = {
									      host: 'elbulliweb.cloudapp.net',
									      port: '8080',
									      path: '/scanner/new',
									      method: 'POST',
									      headers: {
									          'Content-Type': 'application/x-www-form-urlencoded',
									          'Content-Length': post_data.length
									      }
									  };

								    // Set up the request
									  var post_req = http.request(post_options, function(res) {
									      res.setEncoding('utf8');
									      res.on('data', function (chunk) {
									          console.log('Response: ' + chunk);
									      });
									  });

									  // post the data
									  post_req.write(post_data);
									  post_req.end();

								});

	            } else if (arguments[0] === 'delete'){
	           		/***
	            	/* FILE HAS BEEN DELETED
	            	/*
	            	*/
	            	console.log('>> file deleted'.red);
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
	        // setTimeout(function(){
	        //     var i;
	        //     console.log('Stop watching our paths');
	        //     for ( i=0;  i<watchers.length; i++ ) {
	        //         watchers[i].close();
	        //     }
	        // },60*1000);
	    }
	});
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

