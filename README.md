# volvox-microsoft
Volvox Labs + Microsoft Timelapse Project


##Camera App Machine Setup
On-site Linux machine, connected to 4 Canon DSLRs over USB.
* Install Ubuntu 14.04
  * via mountable ISO disk image
* Update packages
  * `$ sudo apt-get update`
  * `$ sudo apt-get upgrade`
* Install Git
  * `$ sudo apt-get git`
* Install Node *`v0.10.39`* via [NVM](https://github.com/creationix/nvm)
  * `$ sudo apt-get install build-essential libssl-dev`
  * `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | sh`
  * `$ source ~/.profile`
  * `$ nvm install 0.10.39`
  * `$ nvm use 0.10.39`
  * `$ nvm alias default 0.10.39`
  * `$ nvm use default`
  * `$ node -v`  // check that install worked
* Install gphoto2
  * `$ sudo apt-get install libgphoto2-2-dev`
* Clone repo (first `$ cd` to correct folder)
  * `$ git clone https://github.com/jmsaavedra/volvox-microsoft.git`
* Install package modules
  * `$ npm install`
* Install PM2
  * $ `$ npm install pm2 -g`    #follow directions if there is a reply from pm2!
  * $ `$ pm2 startup`           #follow directions if there is a reply from pm2!
  * $ `$ pm2 start startup.json` #run the app with pm2 startup script
  * $ `$ pm2 save`              #save this process to the startup scripts
  * $ `$ pm2 logs`              #tail console logs


##Video Processor - Azure Virtual Machine Setup
This is an Ubunutu 14.04 Linux Virtual Machine.
* Update packages
  * `$ sudo apt-get update`
  * `$ sudo apt-get upgrade`
* Install Git
  * `$ sudo apt-get git`
* Install Node *`v0.10.39`* via [NVM](https://github.com/creationix/nvm)
  * `$ sudo apt-get install build-essential libssl-dev`
  * `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | sh`
  * `$ source ~/.profile`
  * `$ nvm install 0.10.39`
  * `$ nvm use 0.10.39`
  * `$ nvm alias default 0.10.39`
  * `$ nvm use default`
  * `$ node -v`  // check that install worked
* Install ffmpeg
  * wget and unpack binary: [see my gist here](https://gist.github.com/jmsaavedra/62bbcd20d40bcddf27ac).
  * [old ref](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/wiki/Installing-ffmpeg-on-Debian)
* Install graphicsmagick + ghostscript 
  * `$ sudo apt-get install graphicsmagick`
  * `$ sudo apt-get install ghostscript`
* Clone repo, install packages
  * `$ git clone https://github.com/jmsaavedra/volvox-microsoft.git`
  * `$ npm install`
* Set local time zone of server
  * Linux ([ref](http://www.christopherirish.com/2012/03/21/how-to-set-the-timezone-on-ubuntu-server/)):
  * `$ date`  // show date
  * `$ more /etc/timezone` // show timezone file
  * `$ sudo dpkg-reconfigure tzdata` // run timezone config
  * if using cron, restart it:
    * `$ /etc/init.d/cron stop`
    * `$ /etc/init.d/cron start`
  
  
