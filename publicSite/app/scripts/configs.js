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
  .config(function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('sanitize');
    // English
    $translateProvider.translations('en', {
      MAIN_TITLE: 'Welcome to elBulliLab Timelapse',
      MAIN_DESC: 'Documenting information is one of the most important events in a creative process, for that reason, it this important to archive everything that happens in elBulliLab.<br><br>Our time-lapse integrates photography and innovative programming to tell the history and evolution  from four different views of this fascinating project for 365 days.<br><br>Never miss a moment of this epic story. Come join us in the time-lapse!',
      TECH_TITLE: 'The Process of Capturing elBulliab',
      TECH_DESC: 'These daily digest videos captured from four different cameras reveal the fascinating, interesting and unnoticed perspectives that occur in elBullilab.  Every night the still photographs are automatically post-processed to create a 30 seconds motion clip of that day in  fast-forward time which can be played over and over again.<br><br>Take a look, discover our day-to-day, and meet the people who this mapping possible.',
      POWERED: 'POWERED BY ',
      NAV: {
        ABOUT: 'ABOUT',
        VID: 'VIDEO GALLERY',
        SCAN: 'SCAN GALLERY'
      },
      DIGEST: {
        MONTH: 'Monthly Digest',
        DAY: 'Daily Digest'
      }
    });
    // Spanish
    $translateProvider.translations('es', {
      MAIN_TITLE: 'Bienvenido al timelapse elBulliLab',
      MAIN_DESC: 'Documentar la información es uno de los hechos más importantes de un proceso creativo, por ese motivo, esta tan importante archivar todo lo que sucede en elBulliLab.<br><br>Timelapse integra la fotografía y la programación de última generación para contar la historia y la evolución durante 365 días desde 4 puntos de vista diferentes de este proyecto tan fascinante.<br><br>No te pierdas ni un momento de esta historia épica. ¡Ven y únete a nosotros en el Timelapse!',
      POWERED: 'IMPULSADO POR ',
      NAV: {
        ABOUT: 'ACERCA DE',
        VID: 'VIDEO GALERÍA',
        SCAN: 'SCAN GALERÍA'
      },
      DIGEST: {
        MONTH: 'Recopilación mensual',
        DAY: 'Resumen diario'
      }
    });
    ///////////
    $translateProvider.preferredLanguage('en');
  });