# volvox-microsoft
Volvox Labs + Microsoft Timelapse Project

Below are instructions for setting up project machines from scratch.

##Camera Controller - Local Machine Setup
On-site Linux machine, connected to 4 Canon DSLRs over USB-Ethernet extenders.
* __Install Ubuntu 14.04__
  * via mountable ISO disk image
* __Update packages__
  * `$ sudo apt-get update`
  * `$ sudo apt-get upgrade`
* __Install Git__
  * `$ sudo apt-get git`
* __Install Node__ `v0.10.39` via [nvm](https://github.com/creationix/nvm)
  * `$ sudo apt-get install build-essential libssl-dev`
  * `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | sh`
  * `$ source ~/.profile`
  * `$ nvm install 0.10.39`    #crucial for gphoto2
  * `$ nvm use 0.10.39`
  * `$ nvm alias default 0.10.39`
  * `$ nvm use default`
  * `$ node -v`  // check that install worked
* __Install gphoto2__
  * `$ sudo apt-get install libgphoto2-2-dev`
* __Clone repo__ (first `$ cd` to correct folder)
  * `$ git clone https://github.com/jmsaavedra/volvox-microsoft.git`
* __Install package modules__
  * `$ npm install`
* __AuthKeys.js__
  * manually copy AuthKeys.js into the root folder (this is shared privately)
* __Install PM2__
  * $ `$ npm install pm2 -g`    
  * $ `$ pm2 startup`            #follow directions if there is a reply from pm2!
  * $ `$ pm2 start startup.json` #run the app with pm2 startup script
  * $ `$ pm2 save`               #save this process to the startup scripts
  * $ `$ pm2 logs`               #tail console logs

---------

##Video Processor - Azure Virtual Machine Setup
This is an Ubunutu 14.04 Linux Virtual Machine, that processes all uploaded videos nightly, uploads to Vimeo, and reports to the a server db for display in the public gallery site.
* __Update packages__
  * `$ sudo apt-get update`
  * `$ sudo apt-get upgrade`
* __Install Git__
  * `$ sudo apt-get git`
* __Install Node__ *`v0.10.39`* via [NVM](https://github.com/creationix/nvm)
  * `$ sudo apt-get install build-essential libssl-dev`
  * `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | sh`
  * `$ source ~/.profile`
  * `$ nvm install 0.10.39`   #video processor has run on 0.12.x in the past
  * `$ nvm use 0.10.39`
  * `$ nvm alias default 0.10.39`
  * `$ nvm use default`
  * `$ node -v`  // check that install worked
* __Install ffmpeg__
  * wget and unpack binary: [see my gist here](https://gist.github.com/jmsaavedra/62bbcd20d40bcddf27ac).
  * [old ref](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/wiki/Installing-ffmpeg-on-Debian)
* __Install graphicsmagick + ghostscript__
  * `$ sudo apt-get install graphicsmagick`
  * `$ sudo apt-get install ghostscript`
* __Clone repo__, install packages
  * `$ git clone https://github.com/jmsaavedra/volvox-microsoft.git`
  * `$ npm install`
* __AuthKeys.js__
  * manually copy `AuthKeys.js` into the root folder of repo (this is shared privately)
* __Set local time zone of server__
  * Linux ([ref](http://www.christopherirish.com/2012/03/21/how-to-set-the-timezone-on-ubuntu-server/)):
  * `$ date`  // show date
  * `$ more /etc/timezone` // show timezone file
  * `$ sudo dpkg-reconfigure tzdata` // run timezone config
  * if using cron, restart it:
    * `$ /etc/init.d/cron stop`
    * `$ /etc/init.d/cron start`
* __Install PM2__
  * $ `$ npm install pm2 -g`    
  * $ `$ pm2 startup`            #follow directions if there is a reply from pm2!
  * $ `$ pm2 start startup.json` #run the app with pm2 startup script
  * $ `$ pm2 save`               #save this process to the startup scripts
  * $ `$ pm2 logs`               #tail console logs

---------
