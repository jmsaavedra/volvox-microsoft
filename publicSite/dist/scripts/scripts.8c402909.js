"use strict";angular.module("elbulliApp",["ngAnimate","ngSanitize","ngTouch","ui.router","anim-in-out","angularMoment","pascalprecht.translate","djds4rce.angular-socialshare","app.data","app.router","app.configs","app.services","app.filters"]).run(["$rootScope","$translate","$state","$stateParams","$timeout","$FB","amMoment",function(a,b,c,d,e,f,g){a.allowSlide=!0,e(function(){a.lang=d.lang||"en",b.use(a.lang),g.changeLocale(a.lang)},1e3),f.init("918917801500205"),a.changeLanguage=function(d){"en"===d?g.changeLocale("en"):"es"===d&&g.changeLocale("es"),a.lang=d,b.use(a.lang),c.go(c.current,{lang:a.lang},{reload:!0})},a.heightMinusNavs=window.innerHeight-140,window.addEventListener("resize",function(){a.heightMinusNavs=window.innerHeight-140})}]);var moment=moment||{};angular.module("app.data",[]).run(["$rootScope",function(a){a.months=[{year:2015,month:"06",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("june 1 2015").unix()>=0?!0:!1},{year:2015,month:"07",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("july 1 2015").unix()>=0?!0:!1},{year:2015,month:"08",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("august 1 2015").unix()>=0?!0:!1},{year:2015,month:"09",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("september 1 2015").unix()>=0?!0:!1},{year:2015,month:"10",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("october 1 2015").unix()>=0?!0:!1},{year:2015,month:"11",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("november 1 2015").unix()>=0?!0:!1},{year:2015,month:"12",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("december 1 2015").unix()>=0?!0:!1},{year:2016,month:"01",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("january 1 2016").unix()>=0?!0:!1},{year:2016,month:"02",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("february 1 2016").unix()>=0?!0:!1},{year:2016,month:"03",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("march 1 2016").unix()>=0?!0:!1},{year:2016,month:"04",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("april 1 2016").unix()>=0?!0:!1},{year:2016,month:"05",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("may 1 2016").unix()>=0?!0:!1},{year:2016,month:"06",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("june 1 2016").unix()>=0?!0:!1},{year:2016,month:"07",image:"http://placehold.it/300x300",isActive:moment().unix()-moment("july 1 2016").unix()>=0?!0:!1}]}]),angular.module("app.router",[]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("about",{url:"/{lang:en|es}",templateUrl:"views/main.html",controller:"MainCtrl"}).state("video",{url:"/{lang:en|es}/video",templateUrl:"views/video.html",controller:"VideoYearCtrl"}).state("video.month",{url:"/{year:2015|2016}/{month:[0-9]+}",templateUrl:"views/video.month.html",controller:"VideoMonthCtrl"}).state("video.day",{url:"/{year:[0-9]+}/{month:[0-9]+}/{day:[0-9]+}",templateUrl:"views/video.day.html",controller:"VideoDayCtrl"}).state("photo",{url:"/{lang:en|es}/photo/:month",templateUrl:"views/photo.html",controller:"PhotoCtrl"}),b.otherwise("/en")}]),angular.module("app.configs",[]).config(["$translateProvider","$sceDelegateProvider","$locationProvider",function(a,b,c){b.resourceUrlWhitelist(["self","https://player.vimeo.com/video/**"]),a.useSanitizeValueStrategy("sanitize"),a.translations("en",{MAIN_TITLE:"Welcome to elBulliLab Timelapse",MAIN_DESC:"Documenting information is one of the most important events in a creative process, for that reason, it this important to archive everything that happens in elBulliLab.<br><br>Our time-lapse integrates photography and innovative programming to tell the history and evolution  from four different views of this fascinating project for 365 days.<br><br>Never miss a moment of this epic story. Come join us in the time-lapse!",TECH_TITLE:"The Process of Capturing elBulliab",TECH_DESC:"These daily digest videos captured from four different cameras reveal the fascinating, interesting and unnoticed perspectives that occur in elBullilab.  Every night the still photographs are automatically post-processed to create a 30 seconds motion clip of that day in  fast-forward time which can be played over and over again.<br><br>Take a look, discover our day-to-day, and meet the people who this mapping possible.",POWERED:"POWERED BY ",NAV:{ABOUT:"ABOUT",VID:"VIDEO GALLERY",SCAN:"SCAN GALLERY"},DIGEST:{MONTH:"Monthly Digest",DAY:"Daily Digest"},CAMERA:"Camera"}),a.translations("es",{MAIN_TITLE:"Bienvenido al timelapse elBulliLab",MAIN_DESC:"Documentar la información es uno de los hechos más importantes de un proceso creativo, por ese motivo, esta tan importante archivar todo lo que sucede en elBulliLab.<br><br>Timelapse integra la fotografía y la programación de última generación para contar la historia y la evolución durante 365 días desde 4 puntos de vista diferentes de este proyecto tan fascinante.<br><br>No te pierdas ni un momento de esta historia épica. ¡Ven y únete a nosotros en el Timelapse!",POWERED:"IMPULSADO POR ",NAV:{ABOUT:"ACERCA DE",VID:"VIDEO GALERÍA",SCAN:"SCAN GALERÍA"},DIGEST:{MONTH:"Recopilación mensual",DAY:"Resumen diario"},CAMERA:"Cámara"}),a.preferredLanguage("en")}]);var moment=moment||{};angular.module("app.services",[]).factory("Server",["$http","$rootScope",function(a,b){var c={};return c.getMonthlyAsset=function(b,c,d,e){var f=c?"http://elbulliweb.cloudapp.net:8080/timelapse/month/":"http://elbulliweb.cloudapp.net:8080/scanner/month/",g=moment(b+" 2015","MMMM YYYY").format("MM");a.get(f+g).success(function(a){d&&d(a)}).error(function(a){e&&e(a)})},c.getAssetsFromDate=function(b,c,d,e){var f=c?"http://elbulliweb.cloudapp.net:8080/timelapse/date/":"http://elbulliweb.cloudapp.net:8080/scanner/date/";a.get(f+b).success(function(a){d&&d(a)}).error(function(a){e&&e(a)})},c}]),angular.module("app.filters",[]).filter("limitFromTo",function(){return function(a,b,c){if(!(a instanceof Array||a instanceof String))return a;if(c=parseInt(c,10),a instanceof String)return c?c>=0?a.slice(b,c):a.slice(c,a.length):"";var d,e,f=[];for(c>a.length?c=a.length:c<-a.length&&(c=-a.length),c>0?(d=b,e=c):(d=a.length+c,e=a.length);e>d;d++)f.push(a[d]);return f}}).filter("capitalize",function(){return function(a,b){return a?a.replace(/([^\W_]+[^\s-]*) */g,function(a){return a.charAt(0).toUpperCase()+a.substr(1).toLowerCase()}):""}}),angular.module("elbulliApp").controller("MainCtrl",["$rootScope","$scope","$timeout","$uiViewScroll",function(a,b,c,d){b.scrollToTechnical=function(){$("[ui-view]").animate({scrollTop:$("#technical-detail").offset().top})}}]);var moment=moment||{};angular.module("elbulliApp").controller("VideoYearCtrl",["$scope","$rootScope","$timeout","$stateParams","$state",function(a,b,c,d,e){console.log("Video year"),a.disallowSlide=function(){b.allowSlide=!1,c(function(){b.allowSlide=!0},0)}}]).controller("VideoMonthCtrl",["$scope","$rootScope","$stateParams","Server","$timeout",function(a,b,c,d,e){console.log("Video month"),a.thisMonth=moment(c.month+" 01 "+c.year).format("MMMM, YYYY"),a.videos=[{date:"2015-08-01",ymd:{y:"2015",m:"08",d:"01"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"},{date:"2015-08-02",ymd:{y:"2015",m:"08",d:"02"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"},{date:"2015-08-03",ymd:{y:"2015",m:"08",d:"03"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"},{date:"2015-08-04",ymd:{y:"2015",m:"08",d:"04"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"},{date:"2015-08-05",ymd:{y:"2015",m:"08",d:"05"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"},{date:"2015-08-06",ymd:{y:"2015",m:"08",d:"06"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"},{date:"2015-08-07",ymd:{y:"2015",m:"08",d:"07"},img:"https://i.vimeocdn.com/video/522186194_640.jpg"}],e(function(){a.equalWidth=angular.element(".thumbnail-container").width()},0)}]).controller("VideoDayCtrl",["$scope","$rootScope","$stateParams","Server","$timeout",function(a,b,c,d,e){a.video_content={date:"2015-06-07",description:"Lorem ipsum Irure do labore laboris in laboris eu magna aliquip sed dolor culpa id enim est cupidatat qui in sed ad exercitation adipisicing fugiat incididunt culpa sit proident Duis non dolor adipisicing cupidatat sunt cillum culpa quis adipisicing magna incididunt.",vimeo_final:{vimeo_video_id:"27243869"},cam0:{vimeo_video_id:"27243869"},cam1:{vimeo_video_id:"27243869"},cam2:{vimeo_video_id:"27243869"},cam3:{vimeo_video_id:"27243869"}},a.currentMonth=moment(a.video_content.date).format("MM"),a.currentYear=moment(a.video_content.date).format("YYYY"),a.vimeo_final_url="https://player.vimeo.com/video/"+a.video_content.vimeo_final.vimeo_video_id,a.vimeo_cam0_url="https://player.vimeo.com/video/"+a.video_content.cam0.vimeo_video_id,a.vimeo_cam1_url="https://player.vimeo.com/video/"+a.video_content.cam1.vimeo_video_id,a.vimeo_cam2_url="https://player.vimeo.com/video/"+a.video_content.cam2.vimeo_video_id,a.vimeo_cam3_url="https://player.vimeo.com/video/"+a.video_content.cam3.vimeo_video_id,a.getVimeoHeight=function(){$("#vimeo_final").attr({height:9*$("#vimeo_final").width()/16}),$(".vimeo_cam").attr({height:9*$("#vimeo_cam").width()/16})},e(function(){a.getVimeoHeight()}),$(window).on("resize",function(){a.getVimeoHeight()}),a.queryDate=c.year+"-"+c.month+"-"+c.day,d.getAssetsFromDate(a.queryDate,!0,function(b){a.data=b},function(a){alert("There is no data for this date.")})}]),angular.module("elbulliApp").controller("PhotoCtrl",["$scope",function(a){}]),angular.module("elbulliApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);