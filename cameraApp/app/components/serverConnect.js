/* Server Connection */

var querystring = require('querystring'),
	http        = require('http');
/***
/* POST data object to ElBulli Server
*/
var ServerConnect = {

	postData: function(data, callback){

		var post_data = querystring.stringify({
			'date' : data.date,
			'file' : data.file,
			'type' : data.type
		});

		var post_options = {
			host: global.BULLI_SERVER.host,
			port: global.BULLI_SERVER.port,
			path: global.BULLI_SERVER.path,

			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': post_data.length
			}
		};

		/* Set up the request */
		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('Server Response: '.yellow + chunk);
				if(JSON.parse(chunk).data !== true){
					console.log('ERROR ON POST TO EL BULLI SERVER: '.red.bold+chunk);
					return callback('ERROR ON POST: ',chunk);
				}

				console.log('SUCCESS HTTP POST to El Bulli Server.'.green); 
				console.log('-----------------------------------------------\n'.gray);
				return callback(null, chunk);
			});
		});

		post_req.on('error', function(e) {
			console.log('>>! ERROR with POST request: '.red + e.message);
			return callback(e);
		});

		// execute post
		post_req.write(post_data);
		post_req.end();
	}
};

module.exports = ServerConnect;
