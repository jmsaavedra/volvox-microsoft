/***** Volvox ElBulli Timelapse AUTH KEYS ******
*
*  TO USE: copy/paste into 'AuthKeys.js', and place in top/root level dir of this repo.
*	
*		var path = require('path');   //cross-platform compatibility
* 		global.KEYS = require(path.join(__dirname, '..', 'AuthKeys'));
*
*  NOTE: Do not commit to git!
*
*/

module.exports = {

	/** VIMEO **/
	'VIMEO_CLIENT_ID' : '703165f789ba78ad4e2566dcd65113df4e0e4b70',
	'VIMEO_ACCESS_TOKEN'  : '0e916bf3af2e06f8eb82b5f87ee2e445',
	'VIMEO_CLIENT_SECRET' : 'S7CherScJPSuuC4Z3fFBCbvBM5/BUuJ3UQvsgIa3DmNXbCY9Qw4qb9dOSMJsfXJCmEtOthny+m8eNGzbzUEhRpNue8VDCmGfKs8fAJEhPvcLkkjUeJPjBYu9/PnzVkN4',


	/** AZURE **/
	'AZURE_PHOTO_STORAGE_ACCOUNT' : 'elbulliphoto',
	'AZURE_PHOTO_STORAGE_KEY' : '/nGzMNHlVPDxIhDeVBHwT5JYwx4xrosjPU90uszrlZSClLC956XNoIHduNHADqrr4L+Axm36D2LS215tWLSR5g==',
	'AZURE_PHOTO_BLOB_ADDR' : 'https://elbulliphoto.blob.core.windows.net',
	

	'AZURE_SCAN_STORAGE_ACCOUNT'  : 'elbulliscanner',
	'AZURE_SCAN_STORAGE_KEY'  : 'bmZLz1PPrcwj48gl7fLxEk4r+I1qqQEZpPA7ng2QV9sgY/VqPcvkWiFeMUZn142TXu92qH3tPSJwfvQair8PqA==',
	'AZURE_SCAN_BLOB_ADDR' : 'https://elbulliscanner.blob.core.windows.net',


	/** ROUTING SERVER **/
	'BULLI_SERVER' : { 
		'host' 	: 'elbulliweb.cloudapp.net',
		'port' 	: '8080',

		'PATH' : {
			'photo' : '/photo/new',
			'video' : '/timelapse/new',
			'scan' 	: '/scanner/new'
		}
	},

	/** NODEMAILER **/
	'NODEMAILER' : {
		'service' : 'Gmail',
		'user' 	  : 'elbullitimelapse@gmail.com',
		'pass'	  : '=]-[0p9o8i',

		'OPTIONS' : {
			'fromVid' : '[elBulli] Video Processing Server <elbullitimelapse@gmail.com>',
			'fromCam' : '[elBulli] Camera Controller App <elbullitimelapse@gmail.com>',
			'fromScan': '[elBulli] Scanner App <elbullitimelapse@gmail.com>',
			'to' 	  : 'elbullitimelapse@gmail.com'
		}
	}
};

