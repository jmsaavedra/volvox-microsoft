/***
*
* Vimeo API
*
*/

var path = require('path');
var moment    = require('moment');
var Vimeo = require('vimeo').Vimeo;
// https://github.com/vimeo/vimeo.js

var lib = new Vimeo(global.VIMEO_CLIENT_ID, global.VIMEO_CLIENT_SECRET, global.VIMEO_ACCESS_TOKEN);

// Export
var vimeoApi = {

	uploadVideo: function(URI, cb){
    console.log('Start uploading file to Vimeo. '.yellow);

    var fname = path.basename(URI, '.mp4');
    var rawDate = fname.split('_')[1].toString();
    var date = moment(rawDate).format('MMMM DD, YYYY');

		var title = 'ElBulliLab: '+date;

    var postData = {}; //holds object to update elbulli web server with.

    if(fname.indexOf('camera') === 0){
      var cam = fname.split('_')[0].replace(/-/, ' ');
      title += ' - '+cam;
    } else {
      
    }

		lib.streamingUpload(URI,  function (error, body, status_code, headers) {
	    if (error) {
	        return cb(error);
	    }

	    lib.request(headers.location, function (error, _body, status_code, headers) {
    		console.log('vimeo upload status_code: '.cyan + status_code);
        
        if(error || status_code !== 200){
          console.log('vimeo upload fail _body: '.red+JSON.stringify(_body));
          console.log('vimeo upload fail headers: '.red+JSON.stringify(headers));
          return cb(error);
        } 

    		var vimData = JSON.parse(JSON.stringify(_body));
    		var videoId = path.basename(vimData.uri);
        if(fname.indexOf('camera') > -1){
          var camNum = parseInt(fname[7]);
          switch(camNum){
            case 0:
              postData.cam0 = {
                vimeo_video_id: videoId 
              };
              break;
            case 1:
              postData.cam1 = {
                vimeo_video_id: videoId 
              };
              break;
            case 2:
              postData.cam2 = {
                vimeo_video_id: videoId 
              };
              break;
            case 3:
              postData.cam3 = {
                vimeo_video_id: videoId 
              };
              break;
            default:
              console.log('camnum not found: '+camNum);
              break;
          }
        } else {
          postData.vimeo_final = {
            vimeo_video_id: videoId
          };
        }
    		
        var newMetadata = {
          name: title,
          description: 'ElBulliLab Timelapse, '+date+'.',
          privacy : {
            view: 'anybody'
          }
        };

    		vimeoApi.updateVideoMetadataFromId(videoId, newMetadata, function(e, data){

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
		    if(err) console.log('vimeo metadata err: '.red+err);
        console.log('vimeo metadata status_code: '.cyan+status_code);
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
        console.log('error: '.red+error);
        cb(error)
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