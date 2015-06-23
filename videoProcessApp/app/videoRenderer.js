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
	_ 		= require('underscore'),
	async 	= require('async');
		
/***
/* INIT Folder Watcher 
*/

var Process = {

	makeSingleCameraVideo: function(date, camId, imgs, callb){

		var todaysProcessFolder = path.join(global.PROCESS_FOLDER, date);
		var thisCamFolder = path.join(todaysProcessFolder, camId.toString());
		// var thisCamImgFolder = path.join(thisCamFolder, 'imgs');
		var videoOutputFilePath = path.join(todaysProcessFolder, 'camera_'+camId.toString()+'.mp4');
		
		var imgsToUse = [];
		console.log('making video camID: '.cyan+camId);
		console.log('making video with '.cyan+imgs.length+' images');
		console.log('video file path: '.cyan+videoOutputFilePath);
		
		fs.exists(videoOutputFilePath, function(exists){
			if(exists) //TODO: || hard-redo setting
				return callb(null, videoOutputFilePath);
			var progressCt = -1;
			ffmpeg()
				.addInput(path.join(thisCamFolder, 'frame-%01d.jpg').toString())
				// .addInput('/Users/jmsaavedra/Documents/volvox-microsoft/cameraApp/images-saved/2015-06-21/0/imgs/frame%01d.jpg')
				.output(videoOutputFilePath)
				.outputOptions([
					'-framerate 12'
				])
				.on('error', function(err) {
					console.log('An error occurred: ' + err.message);
					callb(err.message);
				})
				.on('progress', function(progress) {
					var currProgress = Math.round(progress.percent*1.1);
					if(currProgress != progressCt){
						console.log('Processing '.gray,' camera_'+camId+'.mp4 ',': '.gray + currProgress + '% done');
						progressCt = currProgress;
					}
				})
				.on('end', function() {
				    console.log('Merging finished !');
				    callb(null, videoOutputFilePath);
				})
			.run();
		});
	},

	makeFinalVideo: function(vids, callback){

		/* RENDER THE FINAL COMBINED VIDEO */
		var outpath = path.join(path.dirname(vids[0]), "combinedFinal.mp4"); //same dir as cam vids
		console.log('Rendering final combined video: '.cyan+outpath);

		var progressCt = -1;
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
		      callback(null,outpath);
		    })
			.on('progress', function(progress) {
				var currProgress = Math.round(progress.percent*1.1);
				if(currProgress != progressCt){
					console.log('Processing'.gray,'combinedFinal.mp4',':'.gray, currProgress+'% done');
					progressCt = currProgress;
				}
			})
		    .on('error', function(err) {
		      console.log('an error happened: ' + err.message);
		    })
		.run();
	}
};



function cutPasteFile(oldPath, newPath, _cb){
  fs.rename(oldPath, newPath, function(e, stats){
    if(e) console.log('error fs.rename: '.red + e);
    _cb(e);
  });
}


module.exports = Process;