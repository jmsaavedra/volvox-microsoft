/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  PROCESS MANAGER
*
*/

var watchr 		= require('watchr'),
		videoProc = require('./videoProcess'),
		path 			= require('path'),
		http 			= require('http'),
		fs 				= require('graceful-fs'),
		_ 				= require('underscore'),
		async 		= require('async');
		
var imgsPath = '/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21';

/***
/* INIT Folder Watcher 
*/

var Manager = {

	getCamImgs: function(callback){

		var images = [ [], [], [], [] ];
		fs.readdir(imgsPath, function(e, files){

			async.each(files, function(file, cb){
				var filename = path.basename(file, '.jpg');
				
				var camStrIdx = parseInt(filename.search(/cam/));
				// console.log(camStrIdx);
				if(camStrIdx>=0){
					var camId = file[camStrIdx+4];  //filenames end with '..._cam_0.jpg'
					// console.log('found camId: '+camId); 
					images[camId].push(path.join(imgsPath,file));
				}
				cb();
			}, function(err){
				if(err) console.log('each file error: '.red + err);
				console.log('finished going through files');
				images = _.sortBy(images, function(name){return name;});
				callback(err, images);
			});
		});
	},

	processVideo: function(camId, imgs, cb){

		videoProc.makeVideo(camId, imgs, function(e, localVid){
			if(e) return console.log('error makeVideo: '.red + e);
			console.log('localVideo: '+localVid);
			cb(null, localVid);
		});		
	}

};

module.exports = Manager;