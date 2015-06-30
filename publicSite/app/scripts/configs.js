'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Configs module of the application.
 */
angular
  .module('app.configs', [])
  .config(function($translateProvider, $sceDelegateProvider, $locationProvider) {
    // $locationProvider.html5Mode(true).hashPrefix('!');
    // Whitelist URLs
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'https://player.vimeo.com/video/**'
    ]);


    $translateProvider.useSanitizeValueStrategy('sanitize');
    // English
    $translateProvider.translations('en', {
      MAIN_TITLE: 'Welcome to elBulliLab Timelapse',
      MAIN_DESC: 'Documenting information is one of the most important events in a creative process, for that reason, it this important to archive everything that happens in elBulliLab. Our time-lapse integrates photography and innovative programming to tell the history and evolution  from four different views of this fascinating project for 365 days.<br><br>Never miss a moment of this epic story. Come join us in the time-lapse!',
      TECH_TITLE: 'The Process of Capturing elBulliab',
      TECH_DESC: 'These daily digest videos captured from four different cameras reveal the fascinating, interesting and unnoticed perspectives that occur in elBullilab.  Every night the still photographs are automatically post-processed to create a 30 seconds motion clip of that day in  fast-forward time which can be played over and over again.<br><br>Take a look, discover our day-to-day, and meet the people who this mapping possible.',
      TECH_STEP_HEAD: 'Step',
      TECH_STEP_1_BODY: 'Each camera is strategically placed to capture a still photograph in the lab every 60 seconds between the working hours of 9:00 am to 8:00',
      TECH_STEP_2_BODY: 'Each produce 720 photographs per day.',
      TECH_STEP_3_BODY: 'Images are stored on Microsoft Azure cloud.',
      TECH_STEP_4_BODY: 'Videos shared worldwide on the Internet.',
      PROJECT_INFO: 'PROJECT INFORMATION',
      POWERED: 'POWERED BY ',
      NAV: {
        ABOUT: 'ABOUT',
        VID: 'VIDEO GALLERY',
        SCAN: 'SCAN GALLERY'
      },
      DIGEST: {
        MONTH: 'Monthly Digest',
        DAY: 'Daily Digest'
      },
      CAMERA: 'Camera'
    });
    // Spanish
    $translateProvider.translations('es', {
      MAIN_TITLE: 'Bienvenido al timelapse elBulliLab',
      MAIN_DESC: 'Documentar la información es uno de los hechos más importantes de un proceso creativo, por ese motivo, esta tan importante archivar todo lo que sucede en elBulliLab. Timelapse integra la fotografía y la programación de última generación para contar la historia y la evolución durante 365 días desde 4 puntos de vista diferentes de este proyecto tan fascinante.<br><br>No te pierdas ni un momento de esta historia épica. ¡Ven y únete a nosotros en el Timelapse!',
      TECH_TITLE: 'El proceso de captura elBullilab',
      TECH_DESC: 'Estos videos timelpase revelan las perspectivas fascinantes, interesantes y tal vez, inadvertidas que se producen en elBullilab. Cada noche, las fotografias fijas son automáticamente procesadas para crear un clip video de 30 segundos de ese día en avance rápido que se puede mirar una y otra vez. Echa un vistazo, descubre nuestro día a día, y conocer a la gente que hace esta creativa cartografía posible.',
      TECH_STEP_HEAD: 'Paso',
      TECH_STEP_1_BODY: 'Cada cámara se coloca estratégicamente una fotografía del laboratorio cada 60 segundos dentro de los horarios de trabajo del 9h de la mañana a las 20h de las tarde.',
      TECH_STEP_2_BODY: 'Cada cámara produce 720 fotografías por día.',
      TECH_STEP_3_BODY: 'Las imágenes se almacenan en el Microsoft Azure Cloud.',
      TECH_STEP_4_BODY: 'Los vídeos son compartidos con el mundo en Internet.',
      PROJECT_INFO: 'INFORMACIÓN SOBRE EL PROYECTO',
      POWERED: 'IMPULSADO POR ',
      NAV: {
        ABOUT: 'ACERCA DE',
        VID: 'VIDEO GALERÍA',
        SCAN: 'SCAN GALERÍA'
      },
      DIGEST: {
        MONTH: 'Recopilación mensual',
        DAY: 'Resumen diario'
      },
      CAMERA: 'Cámara'
    });
    ///////////
    $translateProvider.preferredLanguage('es');
  });