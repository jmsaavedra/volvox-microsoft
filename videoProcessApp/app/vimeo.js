/***
*
* Vimeo API
*
*/

var path = require('path');
var moment    = require('moment');
var Vimeo = require('vimeo').Vimeo;
// https://github.com/vimeo/vimeo.js
var CLIENT_ID = '703165f789ba78ad4e2566dcd65113df4e0e4b70';
var CLIENT_SECRET = 'S7CherScJPSuuC4Z3fFBCbvBM5/BUuJ3UQvsgIa3DmNXbCY9Qw4qb9dOSMJsfXJCmEtOthny+m8eNGzbzUEhRpNue8VDCmGfKs8fAJEhPvcLkkjUeJPjBYu9/PnzVkN4';
var ACCESS_TOKEN = '0e916bf3af2e06f8eb82b5f87ee2e445';
var lib = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

// Export
var vimeoApi = {

	uploadVideo: function(URI, cb){

		var today = moment().format('YYYY-MM-DD');
		var title = moment().format('mmmm DD, YYYY');

		lib.streamingUpload(URI,  function (error, body, status_code, headers) {
	    if (error) {
	        // throw error;
	        cb(error);
	    }

	    lib.request(headers.location, function (error, _body, status_code, headers) {
    		console.log('status_code: ' + status_code);

    		var vimData = JSON.parse(JSON.stringify(_body));
    		var videoId = path.basename(vimData.uri);
    		// console.log('vimData: '+JSON.stringify(vimData));
    		// console.log('metadata: '+JSON.stringify(vimData.metadata));
    		// console.log('------------\n metadata.connections.pictures: '+JSON.stringify(vimData.metadata.connections.pictures));
    		// console.log('------------\n metadata.connections.pictures.uri: '+vimData.metadata.connections.pictures.uri);
    		
    		vimeoApi.updateVideoMetadataFromId(videoId, title, function(e, data){
    			
        	var thisVid = {
        		vimeo_video_id : videoId,
        		img : 'http://elbulliweb.cloudapp.net/images/video_placeholder.jpg'
        	};

	        var data = {
	        	cam0 : thisVid,
	        	complete : true,
	        	date : today,
	        	type : 'video',
	        	show : true
	        }

	        cb(null, data);		    			
    		});
	    });
		});
	},


	updateVideoMetadataFromId: function(id, _name, cb){

		// lib.request({
		// 	path: '/videos/' + id,
		// 	query: {
		// 		name: 
		// 	}
		// })
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