
var colors  = require('colors'),
  _         = require('lodash'),
  async     = require('async'),
  fs        = require('graceful-fs'),
  later     = require('later'),
  schedule = require('node-schedule'),
  moment    = require('moment');


  var cameraSnapInterval;
  var snapSchedule;

module.exports.init = function(snapFunc, cb){

  later.date.localTime();



  var snapRecurring = later.parse.recur().after('04:30').time().before('23:30').time().every(90).second().onWeekday();
  // var snapRecurring   = later.parse.recur().after('05:00').time().before('06:45').time().every(30).second();
  var snapInterval    = later.setInterval(snapFunc, snapRecurring);
  snapSchedule        = later.schedule(snapRecurring);


  cb( snapSchedule.nextRange(1, new Date())[0] );

  /*** strategy using node-schedule ***/
  // var startRule = new schedule.RecurrenceRule();
  // startRule.dayOfWeek = [new schedule.Range(1, 5)];
  // startRule.hour = 9;
  // startRule.minute = 0;
  // var start = schedule.scheduleJob(startRule, function(){
  //     console.log('>>> STARTING CAMERA INTERVAL <<<'.green.inverse);
  //     cameraSnapInterval = setInterval(snapFunc, 30000);
  // });

  // var endRule = new schedule.RecurrenceRule();
  // endRule.dayOfWeek = [new schedule.Range(1, 5)];
  // endRule.hour = 15;
  // endRule.minute = 0;
  // var end = schedule.scheduleJob(endRule, function(){
  //     console.log('>>> ENDING CAMERA INTERVAL UNTIL TOMORROW <<<'.gray.inverse);
  //     clearInterval(cameraSnapInterval);
  // });
};

module.exports.getTimeTilNextSnap = function(cb){

  return cb(snapSchedule.nextRange(1, new Date())[0]);
}