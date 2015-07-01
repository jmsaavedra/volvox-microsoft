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
	fs 		= require('fs'),
	_ 		= require('underscore'),
	gm 		= require('gm'),
	async 	= require('async');
		
/***
/* Process Method Exports
*/

var Process = {

	processRawImage: function(rawImg, frameCt, camProcessFolder, cb){
		
		var processImgPath = path.join(camProcessFolder, 'frame-'+frameCt.toString()+'.jpg');

		fs.stat(processImgPath, function(e, stats){ //https://nodejs.org/api/fs.html#fs_class_fs_stats
			if(!e && stats.size > 50000){ // if file exists AND is over 50kb
				console.log('cropped image exists,'.gray.bold,'camera:'.gray, camProcessFolder[camProcessFolder.lastIndexOf(path.sep)+1],'file:'.gray,path.basename(processImgPath));
				return cb(null, processImgPath);	
			} else {
				console.log('cropping image: '.yellow+path.basename(processImgPath), ' camera:'.gray, camProcessFolder[camProcessFolder.lastIndexOf(path.sep)+1]);
				gm(rawImg)
					.crop(1920, 1080, 0, 100)
					.write(processImgPath, function(err){
				    	if (err) return cb(arguments);
				    	//console.log(this.outname + " created  ::  " + arguments[3]);
				    	cb(null, processImgPath);
				  	}
				);
			}
		});
	},

	makeSingleCameraVideo: function(date, camId, imgs, callb){

		var todaysProcessFolder = path.join(global.PROCESS_FOLDER, date);
		var thisCamFolder = path.join(todaysProcessFolder, camId.toString());
		// var thisCamImgFolder = path.join(thisCamFolder, 'imgs');
		var videoOutputFilePath = path.join(todaysProcessFolder, 'camera-'+camId.toString()+'_'+date+'.mp4');
		
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
				// .outputOptions([
				// 	'-framerate 10'
				// ])
				// .fps(30)
				.on('error', function(err) {
					console.log('An error occurred: ' + err.message);
					callb(err.message);
				})
				.on('progress', function(progress) {
					//console.log(progress);
					//console.log(JSON.stringify(progress));
					if(progress.hasOwnProperty('percent'))
						console.log('Processing camera'.gray, camId, 'video'.gray, path.basename(videoOutputFilePath),':'.gray, Math.round(progress.percent)+'% done');
					else
						console.log('Processing camera'.gray, camId, 'video'.gray, path.basename(videoOutputFilePath),', frame'.gray, progress.frames);
					
				})
				.on('end', function() {
				    console.log('single camera video finished !'.green);
				    callb(null, videoOutputFilePath);
				})
			.save(videoOutputFilePath);
		});
	},

	makeFinalVideo: function(vids, date, callback){

		/* RENDER THE COMBINED VIDEO */
		var outFile = 'combined_'+date+'.mp4';
		var outpath = path.join(path.dirname(vids[0]), outFile); //same dir as cam vids
		console.log('Rendering final combined video: '.cyan+outpath);

		var progressCt = -1;
		var proc = ffmpeg(vids[0])
		    .input(vids[1])
		    .input(vids[2])
		    .input(vids[3])
		    .addOption('-filter_complex', 'nullsrc=size=1920x1080 [base]; [0:v] setpts=PTS-STARTPTS, scale=960x540 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=960x540 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=960x540 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=960x540 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=960 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:y=540 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=960:y=540' )
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
		      	//callback(null,outpath);
		      	Process.addIntroOutro(outpath, date, callback);
		    })
			.on('progress', function(progress) {
				if(progress.hasOwnProperty('percent'))
					console.log('Processing combined video'.gray, outFile,':'.gray, Math.round(progress.percent)+'% done');
				else 
					console.log('Processing combined video'.gray, outFile,', frame: '.gray, progress.frames);
			})
		    .on('error', function(err) {
		      console.log('an error happened: ' + err.message);
		      callback(err.message);
		    })
		.run();
	},

	addIntroOutro: function(vid, date, callback){

		console.log('RENDERING FINAL VIDEO'.cyan, 'Adding intro and outro clips...');
		var outFile = path.join(path.dirname(vid),'FINAL_'+date+'.mp4');
		var proc = ffmpeg()
		  .input(global.INTRO_OUTRO_VID)
		  .input(vid)
		  .input(global.INTRO_OUTRO_VID)
		  .on('end', function() {
		      	callback(null, outFile);
		    })
			.on('progress', function(progress) {
				if(progress.hasOwnProperty('percent'))
					console.log('Processing adding intro-outro'.gray, path.basename(outFile),':'.gray, Math.round(progress.percent)+'% done');
				else 
					console.log('Processing adding intro-outro'.gray, path.basename(outFile),', frame: '.gray, progress.frames);
			})
		    .on('error', function(err) {
		      console.log('an error happened adding intro-outro: ' + err.message);
		      callback(err.message);
		    })
		.mergeToFile(outFile, path.dirname(vid));

	}
};



function cutPasteFile(oldPath, newPath, _cb){
  fs.rename(oldPath, newPath, function(e, stats){
    if(e) console.log('error fs.rename: '.red + e);
    _cb(e);
  });
}


module.exports = Process;