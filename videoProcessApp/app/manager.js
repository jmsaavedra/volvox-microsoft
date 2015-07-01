/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  PROCESS MANAGER
*
*/

var vidRenderer	= require('./videoRenderer'),
	vimeo 		= require('./vimeo'),
	path 		= require('path'),
	http 		= require('http'),
	azure 		= require('./azureFiler'),
	fs 			= require('graceful-fs'),
	_ 			= require('underscore'),
	mkdirp 	 	= require('mkdirp'),
	rimraf		= require('rimraf'),
	request 	= require('request'),
	async 		= require('async');
		

var Manager = {

	beginDailyProcess: function(date, callback){

		/* download all images from azure to this machine for processing */
		Manager.downloadImages(date, function(e, imgs){
	    	if(e) return callback(e); //console.log('received images: '+JSON.stringify(imgs));
		    	
	    	/* make individual camera movies */
	    	Manager.prepareCameraImages(date, function(er, cameraVideos){
	        	if(er) return callback(er);
	        	console.log('finished procesing individual videos: '.green);
	        	console.log(JSON.stringify(cameraVideos, null, '\t'));

	        	/* make the final video */
	        	Manager.processFinalVideo(date, cameraVideos, function(err, finalVid){
	        		if(err) return callback(err);

	        		/* delete all process files off of this machine */
	        		Manager.cleanup(date, function(_e){
	        			callback(_e);
	        		});
	        	});
	     	});
		});
	},

	downloadImages: function(date, callback){
		var saveToFolder = path.join(global.PROCESS_FOLDER, date, 'raw');
		azure.downloadImages(date, saveToFolder, function(e, localImgs){
			callback(e, localImgs);
		});
	},

	prepareCameraImages: function(date, callback){

		/* 2D array of ALL CAMERA RAW IMAGE FILEPATHS
		- will hold: [ [cam0imgs], [cam1imgs],.. ]*/
		var images = [ [], [], [], [] ]; 

		var todayRawImgPath = path.join(global.PROCESS_FOLDER, date, 'raw');
		var todayProcessImgPath = path.join(global.PROCESS_FOLDER, date);
		
		fs.readdir(todayRawImgPath, function(e, files){
			if(e) console.log('error read rawImgPath dir: '.red+e);
			async.each(files, function(file, cb){
				var filename = path.basename(file, '.jpg');
				
				var camStrIdx = parseInt(filename.search(/cam/));
				if(camStrIdx>=0){ // we found a properly named photo (contains 'cam')
					var camId = file[camStrIdx+4];  //*** NOTE: filenames MUST end with '..._cam_0.jpg'
					images[camId].push(path.join(todayRawImgPath,file));
				}
				cb();
			}, function(err){
				if(err) return callback(err);
				images = _.sortBy(images, function(name){return name;}); //sort by date/time
				// console.log('completed all camera images 2D array: '+JSON.stringify(images, null, '\t'));
				Manager.processCameraVideos(date, images, todayProcessImgPath, function(_e, camVideos){
					callback(_e, camVideos);
				});
			});
		});
	},

	processCameraVideos: function(date, allCameraImgs, processFolder, callback){
		console.log('Begin process images in folder: '.cyan.bold+processFolder);
		
		var cameraCt = 0;
		async.mapSeries(allCameraImgs, function(thisCamImgs, _cb){ //go through each cam's raw images
			
			var thisCamImgFolder = path.join(processFolder, cameraCt.toString());
			mkdirp.sync(thisCamImgFolder);

			var frameCt = 0;
			async.mapSeries(thisCamImgs, function(img, cb){ //for each image individually of this camera
				
				vidRenderer.processRawImage(img, frameCt, thisCamImgFolder, function(e, processedImagePath){
					frameCt++;
					cb(e, processedImagePath);
				});
			}, function(e, imgs){ /* finished cropping this camera's images */
				
				//quickly check if this camera video has been made before:
				var thisVid = path.join(processFolder, 'camera-'+cameraCt.toString()+'_'+date+'.mp4');
				fs.stat(thisVid, function(_e, stats){
					if(!_e && stats.size > 10000000){ // if file exists AND is over 1MB
						console.log('Video has been processed previously:'.yellow.bold, thisVid);
						console.log('Did not re-upload.'.yellow.bold);
						return _cb(_e, thisVid);
					}
					/** BEGIN the processing of this camera's video! **/
					vidRenderer.makeSingleCameraVideo(date, cameraCt, imgs, function(err, processedVid){
						if(err) return _cb(err);
						cameraCt++;

						/** UPLOAD to vimeo, update server/db with http post **/
						Manager.uploadVideo(processedVid, function(_e, file){
							_cb(_e, processedVid);
						});
					});
				});
			});
		}, function(_err, allCamVideos){ /* processing all camera's videos */
			callback(_err, allCamVideos);
		});
	},

	processFinalVideo: function(date, cameraVideos, callback){
		var thisVid = path.join(global.PROCESS_FOLDER,date,'FINAL_'+date+'.mp4');
		fs.stat(thisVid, function(_e, stats){
			if(!_e && stats.size > 10000000){ // if file exists AND is over 10MB
				console.log('Video has been processed previously:'.yellow.bold, thisVid);
				console.log('Did not re-upload.'.yellow.bold);
				return callback(_e, thisVid);
			}
		
			/* process final composite video */
		    vidRenderer.makeFinalVideo(cameraVideos, date, function(e, finalVidPath){
		  		console.log('Finished Final Render:'.green, finalVidPath);
		  		if(e) return callback(e);

		  		/* now upload this vid! */
		  		Manager.uploadVideo(finalVidPath, function(_e, file){
		  			callback(_e, finalVidPath);
		  		});
			});
		});
	},

	uploadVideo: function(filePath, callback){

		if(!global.UPLOAD_FLAG){ //in case of dev
			console.log('global.UPLOAD_FLAG set to false, not uploading'.red.bold);
			return callback(null, filePath);
		}

		vimeo.uploadVideo(filePath, function(e, data){
			if(e){
				console.log('ERROR uploading to Vimeo: '.red.bold+e);	
				return callback(e);
			} 
			// if(!data) return console.log('NO DATA RETURNED when uploading Scan: '.red.bold+e);
			console.log('About to POST to El Bulli Server: '.yellow+JSON.stringify(data,null,'\t'));

			// send this data to the routing server to save to DB:
			postData(data, function(_e, filename){
				if(_e) console.log('error posting to our server: '.red+_e);
				callback(_e, filename);
			});
		});
	},

	cleanup: function(date, callback){
		if(!global.CLEANUP_FLAG){ // not in dev mode
			console.log('global.CLEANUP_FLAG set to false, not deleting process files'.red.bold);
			return callback(null);
		}
		
		/* delete all the process files */
		rimraf(path.join(global.PROCESS_FOLDER,date), function(_e){
			if(!_e)console.log('SUCCESS removed all process files.'.gray);
			callback(_e);
		});
	}
};

module.exports = Manager;


/***
* COPY FILE to a new path
*/
function copyFile(oldPath, newPath, _cb){
	//console.log('copying file from'.gray, '\n', oldPath, '\n>>> to'.gray, newPath);
	fs.exists(newPath, function(exists){
		if(!exists){
			fs.link(oldPath, newPath, function(e, stats){
				if(e) console.log('error fs.link: '.red + e);
				_cb(e, newPath);
			});
		} else _cb(null, newPath);
	});
}


/***
* POST data object to ElBulli Server
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
		if(err){
			console.log('httpResponse: '+JSON.stringify(httpResponse, null, '\t'));	
			return cb('postData err: '+err);	
		} 
		
		console.log('server response body: '.cyan+JSON.stringify(body, null, '\t'));
		cb(err, body.data);
	});
};