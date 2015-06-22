/****
*
* VOLVOX x MICROSOFT
* ==============================================
*
*  VIDEO PROCESS
*
*/

var gm 		= require('gm'),
	ffmpeg 	= require('fluent-ffmpeg'),
	path 	= require('path'),
	http 	= require('http'),
	fs 		= require('graceful-fs'),
	mkdirp  = require('mkdirp');
	_ 		= require('underscore'),
	async 	= require('async');
		
/***
/* INIT Folder Watcher 
*/

var Process = {

	makeVideo: function(camId, imgs, callb){
		var thisCamFolder = path.join(path.dirname(imgs[0]), camId.toString());
		var thisCamImgFolder = path.join(thisCamFolder, 'imgs');
		mkdirp.sync(thisCamImgFolder);
		
		var imgsToUse = [];

		console.log('making video with: '.cyan+JSON.stringify(imgs,null,'\t'));
		var count = 0; 
		async.eachSeries(imgs, function(img, cb){
			copyFile(img, path.join(thisCamImgFolder, 'frame'+count.toString()+'.jpg'), function(e, path){
				count++;
				cb();
			});

		}, function(e){
			var videoOutputFile = path.join(thisCamFolder, 'output_cam_'+camId.toString()+'.mp4');
			ffmpeg()
				.addInput(path.join(thisCamImgFolder, 'frame%01d.jpg').toString())
				// .addInput('/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/0/imgs/frame%01d.jpg')
				.output(videoOutputFile)
				.outputOptions([
					'-framerate 12'
				])
				.on('error', function(err) {
					console.log('An error occurred: ' + err.message);
				})
				.on('progress', function(progress) {
    				console.log('Processing: ' + Math.round(progress.percent) + '% done');
  				})
				.on('end', function() {
				    console.log('Merging finished !');
				    callb(null, videoOutputFile);
				}).run();
		});		
	},

	makeFinalVideo: function(_vids, callback){
		var outpath = "/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/_final.mp4";
		var vids = [
			"/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/0/output_cam_0.mp4",
			"/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/1/output_cam_1.mp4",
			"/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/2/output_cam_2.mp4",
			"/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/3/output_cam_3.mp4"
		];

		var proc = ffmpeg(vids[0])
		    .input(vids[1])
		    .input(vids[2])
		    .input(vids[3])
		    .addOption('-filter_complex', 'nullsrc=size=1920x1280 [base]; [0:v] setpts=PTS-STARTPTS, scale=960x640 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=960x640 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=960x640 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=960x640 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=960 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:y=640 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=960:y=640' )
		    							   //nullsrc=size=640x480 [base]; [0:v] setpts=PTS-STARTPTS, scale=320x240 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=320x240 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=320x240 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=320x240 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=320 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:y=240 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=320:y=240'
		    //.inputOptions([
		    //	'-filter_complex nullsrc=size=640x480 [base]; [0:v] setpts=PTS-STARTPTS, scale=320x240 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=320x240 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=320x240 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=320x240 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=320 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:y=240 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=320:y=240'
				// -filter_complex 
				// nullsrc=size=640x480 [base];
				// [0:v] setpts=PTS-STARTPTS, scale=320x240 [upperleft];
				// [1:v] setpts=PTS-STARTPTS, scale=320x240 [upperright];
				// [2:v] setpts=PTS-STARTPTS, scale=320x240 [lowerleft];
				// [3:v] setpts=PTS-STARTPTS, scale=320x240 [lowerright];
				// [base][upperleft] overlay=shortest=1 [tmp1];
				// [tmp1][upperright] overlay=shortest=1:x=320 [tmp2];
				// [tmp2][lowerleft] overlay=shortest=1:y=240 [tmp3];
				// [tmp3][lowerright] overlay=shortest=1:x=320:y=240'
		    //])
		    .output(outpath)
		    .on('end', function() {
		      console.log('files have been merged succesfully');
		      callback(null,outpath);
		    })
			.on('progress', function(progress) {
				console.log('Processing: ' + Math.round(progress.percent) + '% done');
			})
		    .on('error', function(err) {
		      console.log('an error happened: ' + err.message);
		    }).run();
		    // .mergeToFile(outPath);
	}
};

function copyFile(oldPath, newPath, _cb){
	fs.exists(newPath, function(exists){
		if(!exists){
			fs.link(oldPath, newPath, function(e, stats){
				if(e) console.log('error fs.link: '.red + e);
				_cb(e);
			});
		} else _cb(null);
	});
}

function cutPasteFile(oldPath, newPath, _cb){
  fs.rename(oldPath, newPath, function(e, stats){
    if(e) console.log('error fs.rename: '.red + e);
    _cb(e);
  });
}


module.exports = Process;