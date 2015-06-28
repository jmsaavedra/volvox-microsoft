'use strict';

/**
 * @ngdoc overview
 * @name elbulliApp
 * @description
 * # elbulliApp
 *
 * Filters module of the application.
 */
angular
  .module('app.filters', [])
.filter('toString', function() {
  return function(input) {
    return input.toString();
  };
})
// https://gist.github.com/svenanders/7289017
.filter('limitFromTo', function() {
  return function(input, offset, limit) {
    if (!(input instanceof Array) && !(input instanceof String)) return input;

    limit = parseInt(limit, 10);

    if (input instanceof String) {
      if (limit) {
        return limit >= 0 ? input.slice(offset, limit) : input.slice(limit, input.length);
      } else {
        return '';
      }
    }

    var out = [],
      i, n;

    if (limit > input.length)
      limit = input.length;
    else if (limit < -input.length)
      limit = -input.length;

    if (limit > 0) {
      i = offset;
      n = limit;
    } else {
      i = input.length + limit;
      n = input.length;
    }

    for (; i < n; i++) {
      out.push(input[i]);
    }

    return out;
  };
}).
filter('capitalize', function() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  };
});