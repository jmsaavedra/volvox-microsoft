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
      MAIN_TITLE: 'Bienvenido al timelapse elBulliLab',
      MAIN_DESC: 'La documentación de las multiples formas de trazar el proceso creativo en el elBullilab exige innovación. Para archivar el avance de este proyecto monumental, la fotografía del timelapse se integra con la programación de ultima generación para contar la historia de esta evolución en el tiempo cada día - 365 días con cuatro puntos de vistas, colocados de forma única. No te pierdas ni un momento de esta historia épica. ¡Ven y únete a nosotros en el mapeo del proceso creativo!',
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
      MAIN_DESC: 'La documentación de las multiples formas de trazar el proceso creativo en el elBullilab exige innovación. Para archivar el avance de este proyecto monumental, la fotografía del timelapse se integra con la programación de ultima generación para contar la historia de esta evolución en el tiempo cada día - 365 días con cuatro puntos de vistas, colocados de forma única. No te pierdas ni un momento de esta historia épica. ¡Ven y únete a nosotros en el mapeo del proceso creativo!',
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