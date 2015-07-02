
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


  /* SHOWTIME */
  //var snapRecurring = later.parse.recur().after('09:00').time().before('21:00').time().every(60).second().onWeekday(); 
  
  /* DEV */
  var snapRecurring = later.parse.recur().after('04:00').time().before('22:00').time().every(2).minute().onWeekday();
  //var snapRecurring = later.parse.recur().after('15:00').time().before('21:15').time().every(60).second();
  var snapInterval    = later.setInterval(snapFunc, snapRecurring);
  snapSchedule        = later.schedule(snapRecurring);


  return cb( formattedTimeTilNextSnap(), getTimeOfNextSnap() );

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
  return cb( formattedTimeTilNextSnap(), getTimeOfNextSnap() ); 
}

var getTimeOfNextSnap = function(){
  return snapSchedule.nextRange(1, new Date())[0];
}


var formattedTimeTilNextSnap = function(){

  timeTil = Math.round( ( getTimeOfNextSnap() - new Date().getTime() ) / 1000);
  timeTil > 60 ? timeTil = moment(getTimeOfNextSnap()).from(new Date()) : timeTil = timeTil+' seconds'; 
  return timeTil;
}