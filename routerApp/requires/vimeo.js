// Vimeo API

var Vimeo = require('vimeo').Vimeo;
// https://github.com/vimeo/vimeo.js
var CLIENT_ID = global.KEYS.VIMEO_CLIENT_ID;
var CLIENT_SECRET = global.KEYS.VIMEO_CLIENT_SECRET;
var ACCESS_TOKEN = global.KEYS.VIMEO_ACCESS_TOKEN;
var lib = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

// Export
module.exports = {
  getVideoDetailFromId: function(id, cb) {
    console.log(id);
    lib.request({
      path: '/videos/' + id
    }, function(error, body, status_code, headers) {
      if (error) {
        console.log('error');
        console.log(error);
      } else {
        // console.log('body');
        if (cb) cb(body);
      }
    });
  },
  /**
   * DEPRECATED
   */
  // getMonthlyVideos: function(month, cb) {
  //   console.log(month);
  //   lib.request({
  //     // This is the path for the videos contained within the staff picks channels
  //     path: '/channels/staffpicks/videos',
  //     // This adds the parameters to request page two, and 10 items per page
  //     query: {
  //       page: 2,
  //       per_page: 10
  //     }
  //   }, function(error, body, status_code, headers) {
  //     if (error) {
  //       console.log('error');
  //       console.log(error);
  //     } else {
  //       console.log('body');
  //       // console.log(body);
  //       if (cb) cb(body);
  //     }
  //   });
  // },
  checkVideoPrivacyFromId: function(id, cb) {
    lib.request({
      path: '/videos/' + id
    }, function(error, body, status_code, headers) {
      if (error) {
        console.log('error');
        console.log(error);
      } else {
        console.log('body');
        // console.log(body);
        if (cb) cb(body.privacy.view); // anybody, nobody
      }
    });
  }
};