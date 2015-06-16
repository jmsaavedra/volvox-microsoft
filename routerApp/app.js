/****
 *
 * VOLVOX x MICROSOFT
 * ==============================================
 *
 *
 */

var config = require('./requires/config');
var mongoose = require('mongoose');
// Load Mongoose Schema Models
var Model = require('./requires/mongo/models');
var chalk = require('chalk');

// Bootstrap db connection
var db = mongoose.connect(config.db.mongooseUri, config.db.options, function(err) {
  if (err) {
    console.log(config.db.mongooseUri);
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Connected to db!'));
  }
});

// Init VIMEO API
var vimeo = require('./requires/vimeo');

/****
 * Init Express
 * ==============================================
 *
 */

// Init the express application
var app = require('./requires/express')(Model, vimeo);

/****
 * START THE HTTP SERVER
 * ==============================================
 *
 */

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Router application started on port ' + config.port);