/***
*
* Vimeo API
*
*/

var path    = require('path'),
    moment  = require('moment'),
    rimraf  = require('rimraf'),
    Vimeo   = require('vimeo').Vimeo; // https://github.com/vimeo/vimeo.js

var lib = new Vimeo(global.KEYS.VIMEO_CLIENT_ID, 
                    global.KEYS.VIMEO_CLIENT_SECRET, 
                    global.KEYS.VIMEO_ACCESS_TOKEN );


/* VIMEO API METHOD EXPORTS */
var vimeoApi = {

	uploadVideo: function(URI, cb){
    console.log(chalk.cyan.bold('\nStart uploading file to Vimeo. '));
    console.log(chalk.gray(' file URI:'), URI);

    var fname = path.basename(URI, '.mp4');
    var rawDate = fname.split('_')[1].toString();
    var date = moment(rawDate).format('MMMM DD, YYYY');

		var title = 'ElBulliLab: '+date;

    var postData = {}; //holds object to update elbulli web server with.

		lib.streamingUpload(URI,  function (error, body, status_code, headers) {
	    console.log(chalk.yellow('vimeo.streamingUpload status_code '), status_code);
      if (error) {
        console.log('vimeo.streamingUpload error:\n',error);
        console.log('vimeo.streamingUpload body:\n',JSON.stringify(body,null,'\t'));
        console.log('vimeo.streamingUpload headers:\n',JSON.stringify(headers,null,'\t'));
        rimraf(URI, function(_er){
          if(_er) console.log('error rimraf video: '+_er);
          console.log('SUCCESS deleted this failed uploaded file so that it gets re-rendered + re-uploaded next try.');
	        return cb('vimeo upload ERR: '+error);
        });
	    }
      
	    lib.request(headers.location, function (_error, _body, _status_code, _headers) {
    		console.log(chalk.yellow('vimeo.request status_code: ') + _status_code);
        if(_error){
          console.log(chalk.red('vimeo lib.request fail _error: \n'),JSON.stringify(_error));
          console.log(chalk.red('vimeo lib.request fail _body: \n'),JSON.stringify(_body,null,'\t'));
          console.log(chalk.red('vimeo lib.request fail _headers: \n'),JSON.stringify(_headers,null,'\t'));
          rimraf(URI, function(_er){
          if(_er) console.log(chalk.red('error rimraf video: '),_er);
            console.log('SUCCESS deleted this failed uploaded file so that it gets re-rendered + re-uploaded next try.');
            return cb(chalk.red('vimeo request ERR: '),_error);
          });
        } 

    		var vimData = JSON.parse(JSON.stringify(_body));
    		var videoId = path.basename(vimData.uri);
        if(fname.indexOf('camera') > -1){
          // var cam = fname.split('_')[0].replace(/-/, ' ');
          var camNum = parseInt(fname[7]); // always index 7 of "camera-1_2015-XX-XX.mp4"
          title += ' - Camera '+((camNum+1).toString());
          
          if      (camNum === 0) postData.cam0 = { vimeo_video_id: videoId };
          else if (camNum === 1) postData.cam1 = { vimeo_video_id: videoId };
          else if (camNum === 2) postData.cam2 = { vimeo_video_id: videoId };
          else if (camNum === 3) postData.cam3 = { vimeo_video_id: videoId };
          else console.log(chalk.red.bold('camNum not found: '),camNum); //something went wrong with the file name
        } else //it's the final video (not individual camera)
            postData.vimeo_final = { vimeo_video_id: videoId };
 
        var newMetadata = {
          name: title,
          description: 'Timelapse videos captured at elBulliLab in Barcelona, Spain on '+date+'.  Learn more at http://elbulli.com',
          privacy : {
            view: 'anybody'
          }
        };

    		vimeoApi.updateVideoMetadataFromId(videoId, newMetadata, function(e, data){
          if(e) return cb('vimeo update metadata: '+_error);
          postData.date= rawDate;
          postData.type= 'video';
          postData.complete= true;
          postData.show= true;
          postData.filename = path.basename(URI);
          
	        cb(e, postData);		    			
    		});
	    });
		});
	},


	updateVideoMetadataFromId: function(id, metadata, _cb){

		lib.request({
  			path: '/videos/' + id,
        method: 'PATCH',
  			query: metadata
      },
      function(err, body, status_code, headers){
		    if(err) console.log(chalk.red('vimeo metadata err: ')+err);
        console.log(chalk.yellow('vimeo metadata status_code: ')+status_code);
        _cb(err, body);
      });
	},


  getVideoDetailFromId: function(id, cb) {
    console.log(id);
    lib.request({
      // This is the path for the videos contained within the staff picks channels
      path: '/videos/' + id
    }, function(error, body, status_code, headers) {
      if (error) {
        console.log(chalk.red('error: ')+error);
        cb(error);
      } else {
        // console.log('body');
        if (cb) cb(null, body);
      }
    });
  },


  getMonthlyVideos: function(month, cb) {
    console.log(month);
    lib.request({
      // This is the path for the videos contained within the staff picks channels
      path: '/channels/staffpicks/videos',
      // This adds the parameters to request page two, and 10 items per page
      query: {
        page: 2,
        per_page: 10
      }
    }, function(error, body, status_code, headers) {
      if (error) {
        console.log('error');
        console.log(error);
      } else {
        console.log('body');
        // console.log(body);
        if (cb) cb(body);
      }
    });
  }
};


module.exports = vimeoApi;