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
	moment 	= require('moment'),
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
				
				.inputFPS(50) /* framerate of images */
				
				.on('error', function(err) {
					console.log('An error occurred: ' + err.message);
					callb(err.message);
				})
				.on('progress', function(progress) {
					console.log('Processing camera'.gray, camId, 'video'.gray, path.basename(videoOutputFilePath),'frame:'.gray, progress.frames,'timemark:'.gray, progress.timemark);
				})
				.on('end', function() {
				    console.log('single camera video finished !'.green);
				    callb(null, videoOutputFilePath);
				})
			.save(videoOutputFilePath);
		});
	},

	generateDate: function(date, callback){
		console.log('\nRendering date-frame.png'.cyan.bold);
		var datePng = path.join(global.PROCESS_FOLDER, date, 'vid3-date.png'); 
		var dateVid = path.join(global.PROCESS_FOLDER, date, 'vid3-date.mp4');
		
		//generate single image of date
		gm(1920, 1080, '#000000')
			.font('Roboto-Regular')
			.fontSize(80)
			.stroke('#efe', 2)
			.fill('#FFFFFF')
			.drawText(0, 0, moment(date).format('MMMM DD, YYYY'), 'Center')
			.write(datePng, function(err){
				if(err) return callback(err);

				//generate 5 second video of date with fade in and out
				console.log('\nRendering vid3-date.mp4'.cyan.bold);
				ffmpeg(datePng)
					.loop(3) //5 seconds
					.fps(30) //30 fps
					.videoFilters('fade=in:0:30', 'fade=out:30:30')
					.on('end', function() {
						console.log('file has been converted succesfully');
						callback(null, dateVid);
					})
					.on('error', function(err) {
						callback(err.message)
					})
					.save(dateVid);
			});
	},


	makeCompositeVideo: function(vids, date, callback){

		/* RENDER THE COMBINED VIDEO, all individual camera vids in quadrants */
		var outFile = 'vid1-composite_'+date+'.mp4';
		var outpath = path.join(path.dirname(vids[0]), outFile); //same dir as cam vids
		console.log('\nRendering vid1-composite video: '.cyan+outpath);

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
		      	/* Send off to add elBulli logo overlay! */
		      	Process.addOverlay(outpath, vids, date, callback);
		    })
			.on('progress', function(progress) {
				console.log('Processing vid1 combined video'.gray, outFile,'frame:'.gray, progress.frames,'timemark:'.gray, progress.timemark);
			})
		    .on('error', function(err) {
		    	console.log('an error happened: ' + err.message);
		    	callback(err.message);
		    })
		.run();
	},

	addOverlay: function(compositeVid, allVids, date, callback){
		console.log('\nRendering vid2-overlay video'.cyan.bold, 'Adding watermark to composite video');
		var outFile = path.join(path.dirname(compositeVid), 'vid2-overlay_'+date+'.mp4');
		var proc = ffmpeg()
			.input(compositeVid)
		    .input(global.VID_WATERMARK)
		    .addOption('-filter_complex', 'overlay=1450:925')
		    // ffmpeg -i inputvideo.avi -i watermarklogo.png -filter_complex "overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2" -codec:a copy output.flv
		    .on('end', function() {
		    	/* Send off to add intro and outro clips! */
		      	Process.addIntroOutro(outFile, allVids, date, callback);
		      	
		    })
			.on('progress', function(progress) {
				console.log('Processing vid2 overlay video'.gray, path.basename(outFile),'frame:'.gray, progress.frames,'timemark:'.gray, progress.timemark);
			})
		    .on('error', function(err) {
		    	console.log('an error happened: ' + err.message);
		    	callback(err.message);
		    })
		.save(outFile);
	},



	addIntroOutro: function(vid, allVids, date, callback){
		console.log('\nRendering vid3-final video'.cyan.bold, 'Adding intro and outro clips...');
		var outFile = path.join(path.dirname(vid), 'vid4-final_'+date+'.mp4');
		var proc = ffmpeg()
			.input(global.VID_INTRO_OUTRO)
			.input(allVids[4]) //date
			.input(vid)
			.input(global.VID_INTRO_OUTRO)
			.on('end', function() {
				/* Final callback! */
			  	callback(null, outFile);
			})
			.on('progress', function(progress
				console.log('Processing vid3 intro-outro'.gray, path.basename(outFile),'frame:'.gray, progress.frames,'timemark:'.gray, progress.timemark);
			})
			.on('error', function(err) {
				console.log('an error happened adding intro-outro: ' + err.message);
				callback(err.message);
			})
		.mergeToFile(outFile, path.dirname(vid));
	}

};


module.exports = Process;

