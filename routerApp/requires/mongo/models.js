// grab the things we need
var mongoose = require('mongoose');
var chalk = require('chalk');
var moment = require('moment');
var Schema = mongoose.Schema;

// create a schema
var photoSchema = new Schema({
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

var videoSchema = new Schema({
  vimeo_final: {
    vimeo_video_id: {
      type: String,
      default: null
    },
    img: {
      type: String,
      default: null
    }
  },
  cam0: {
    vimeo_video_id: {
      type: String,
      default: null
    },
    img: {
      type: String,
      default: null
    }
  },
  cam1: {
    vimeo_video_id: {
      type: String,
      default: null
    },
    img: {
      type: String,
      default: null
    }
  },
  cam2: {
    vimeo_video_id: {
      type: String,
      default: null
    },
    img: {
      type: String,
      default: null
    }
  },
  cam3: {
    vimeo_video_id: {
      type: String,
      default: null
    },
    img: {
      type: String,
      default: null
    }
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
  Photo: mongoose.model('Photo', photoSchema),
  Video: mongoose.model('Video', videoSchema),
  Scan: mongoose.model('Scan', scanSchema)
};

console.log(chalk.green.bold('============== Model Schema loaded'));