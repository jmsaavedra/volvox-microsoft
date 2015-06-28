/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  PROCESS MANAGER
*
*/

var watchr 		= require('watchr'),
	vidRenderer	= require('./videoRenderer'),
	path 		= require('path'),
	http 		= require('http'),
	azure 		= require('./azureFiler'),
	fs 			= require('graceful-fs'),
	_ 			= require('underscore'),
	mkdirp 	 	= require('mkdirp'),
	async 		= require('async');
		


/***
/* INIT Folder Watcher 
*/

var Manager = {

	beginDailyProcess: function(date, callback){

		/* download all images from azure to this machine for processing */
		Manager.downloadImages(date, function(e, imgs){
	    	if(e){
	      		console.log('ERROR DOWNLOADING IMAGES: '.red.bold,e);
	     		callback(e);
	    	} 
		    else { //console.log('received images: '+JSON.stringify(imgs));
		    	
		    	/* make individual camera movies */
		    	Manager.beginCameraVideos(date, function(e, cameraVideos){
		        	if(e) console.log('error: '.red+e);
		        	console.log('finished procesing individual videos: '.green);
		        	console.log(JSON.stringify(cameraVideos, null, '\t'));

		        	/* make the final video */
		        	vidRenderer.makeFinalVideo(cameraVideos, date, function(e, finalVidPath){
		          		console.log('Finished Final Render:'.green, finalVidPath);

		          		/* last thing: copy to watched folder. will upload to Vimeo then. */
		          		var copyTo = path.join(global.FOLDER_TO_WATCH,path.basename(finalVidPath));
		          		copyFile(finalVidPath, copyTo, function(e, newPath){
		          			callback(null, newPath);
		          		});
		        	});
		     	});
		    }
		});
	},

	downloadImages: function(date, callback){
		var saveToFolder = path.join(global.RAW_IMGS_PATH, date);
		azure.downloadImages(date, saveToFolder, function(e, localImgs){
			callback(e, localImgs);
		});
	},

	beginCameraVideos: function(date, callback){

		/** 2D array of ALL CAMERA RAW IMAGE FILEPATHS
		* 	- will hold: [ [cam0imgs], [cam1imgs],.. ]
		*/
		var images = [ [], [], [], [] ]; 

		var todayRawImgPath = path.join(global.RAW_IMGS_PATH, date);
		var todayProcessImgPath = path.join(global.PROCESS_FOLDER, date);
		
		mkdirp.sync(todayProcessImgPath) ? console.log('created today\'s process folder:'.yellow, todayProcessImgPath)
										 : console.log('re-processing today in folder:'.yellow, todayProcessImgPath);

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
				images = _.sortBy(images, function(name){return name;});
				// console.log('completed all camera images 2D array: '+JSON.stringify(images, null, '\t'));
				Manager.copyToProcessFolder(date, images, todayProcessImgPath, function(_e, camVideos){
					callback(_e, camVideos);
				});
			});
		});
	},

	copyToProcessFolder: function(date, allCameraImgs, processFolder, callback){
		console.log('copying to processFolder: '.cyan+processFolder);
		
		var cameraCt = 0;
		async.mapSeries(allCameraImgs, function(thisCamImgs, _cb){ //go through each cam's raw images
			
			var thisCamImgFolder = path.join(processFolder, cameraCt.toString());
			mkdirp.sync(thisCamImgFolder);

			var frameCt = 0;
			async.mapSeries(thisCamImgs, function(img, cb){ //for each image individually of this camera
				
				var processImgPath = path.join(thisCamImgFolder, 'frame-'+frameCt.toString()+'.jpg');

				/***** HERE INSERT IMAGE CROP AND SAVE, REMOVE COPY ******/
				copyFile(img, processImgPath, function(e, path){ // copy to the process folder
					frameCt++;
					cb(e, path);
				});
			}, function(e, imgs){

				/** BEGIN the processing of this camera's video! **/
				vidRenderer.makeSingleCameraVideo(date, cameraCt, imgs, function(err, localVid){
					cameraCt++;
					var copyTo = path.join(global.FOLDER_TO_WATCH,path.basename(localVid));

					/* copy to WATCH folder, this vid will get uploaded to vimeo now */
					copyFile(localVid, copyTo, function(e, newPath){
						_cb(err, localVid);	//pass process folder video URI
					});
				});
			});
		}, function(_e, allCamVideos){
			callback(_e, allCamVideos);
		});
	},
};

module.exports = Manager;


function copyFile(oldPath, newPath, _cb){
	console.log('copying file from'.gray, '\n', oldPath, '\n>>> to'.gray, newPath);
	fs.exists(newPath, function(exists){
		if(!exists){
			fs.link(oldPath, newPath, function(e, stats){
				if(e) console.log('error fs.link: '.red + e);
				_cb(e, newPath);
			});
		} else _cb(null, newPath);
	});
}