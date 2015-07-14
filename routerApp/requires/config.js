// Module Dependencies
var uriUtil = require('mongodb-uri');

// Config files
var exports = {};

// For MongoDB
var mongodbUri = global.KEYS.MONGOLAB.host;
exports.db = {
  options: {
    server: {
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 30000
      }
    },
    replset: {
      socketOptions: {
        keepAlive: 1,
        connectTimeoutMS: 30000
      }
    }
  },
  mongooseUri: uriUtil.formatMongoose(mongodbUri)
};

// for express
exports.port = 8080;

module.exports = exports;