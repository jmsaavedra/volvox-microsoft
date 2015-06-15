// Vimeo API

var Vimeo = require('vimeo').Vimeo;
// https://github.com/vimeo/vimeo.js
var CLIENT_ID = '703165f789ba78ad4e2566dcd65113df4e0e4b70';
var CLIENT_SECRET = 'S7CherScJPSuuC4Z3fFBCbvBM5/BUuJ3UQvsgIa3DmNXbCY9Qw4qb9dOSMJsfXJCmEtOthny+m8eNGzbzUEhRpNue8VDCmGfKs8fAJEhPvcLkkjUeJPjBYu9/PnzVkN4';
var ACCESS_TOKEN = '6cf2299aa4717c3d6886ea93cdea0446';
var lib = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

// Export
module.exports = {
  getVideoDetailFromId: function(id, cb) {
    console.log(id);
    lib.request({
      // This is the path for the videos contained within the staff picks channels
      path: '/videos/' + id
    }, function(error, body, status_code, headers) {
      if (error) {
        console.log('error');
        console.log(error);
      } else {
        console.log('body');
        if (cb) cb(body);
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
        console.log(body);
        if (cb) cb(body);
      }
    });
  }
};