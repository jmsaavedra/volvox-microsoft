// grab the things we need
var mongoose = require('mongoose');
var chalk = require('chalk');
var moment = require('moment');
var Schema = mongoose.Schema;

// create a schema
var videoSchema = new Schema({
  vimeo_final: String,
  vimeo_individuals: {
    cam1: String,
    cam2: String,
    cam3: String,
    cam4: String
  },
  date: {
    type: String,
    default: moment().format('YYYY-MM-DD')
  },
  complete: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});

var scanSchema = new Schema({
  date: {
    type: String,
    default: moment().format('YYYY-MM-DD')
  },
  images: [String],
  complete: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  }
});

// make this available to our users in our Node applications
module.exports = {
  Video: mongoose.model('Video', videoSchema),
  Scan: mongoose.model('Scan', scanSchema)
};

console.log(chalk.green.bold('============== Model Schema loaded'));