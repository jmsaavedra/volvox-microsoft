# volvox-microsoft
Volvox Labs + Microsoft Timelapse Project


##Windows 8 // Local Machine Setup

* [Install Node v0.12](https://nodejs.org/download/)
* [Install github](https://windows.github.com/)
* Clone repo
  * `$ git clone https://github.com/jmsaavedra/volvox-microsoft.git`


 
##Camera App Machine Setup
* Install Node v0.10.39
  * OSX: 
    * `brew tap homebrew/versions` // tap formula versions
    * `brew search node`      // shows all available node version formulas
    * `brew install node010`  // install node v0.10.39
  * Windows:
    * Windows Installer: [http://nodejs.org/dist/v0.10.39/node-v0.10.39-x86.msi](http://nodejs.org/dist/v0.10.39/node-v0.10.39-x86.msi)
    * Windows x64 Installer: [http://nodejs.org/dist/v0.10.39/x64/node-v0.10.39-x64.msi](http://nodejs.org/dist/v0.10.39/x64/node-v0.10.39-x64.msi)
* Install gphoto2
  * OSX: 
    * `brew install gphoto2`
  * Windows: 
    * ?????
  

##Linux Box Setup
For Video Processor (Azure) as well as Camera Controller (local) machines.

* Install Node *`v0.10.39`* via [NVM](https://github.com/creationix/nvm)
  * `$ sudo apt-get update`
  * `$ sudo apt-get install build-essential libssl-dev`
  * `$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | sh`
  * `$ source ~/.profile`
  * `$ nvm install 0.10.39`
  * `$ nvm use 0.10.39`
  * `$ node -v`  // check that install worked
  * `$ nvm alias default 0.10.39`
  * `$ nvm use default`
* Install github
  * `$ sudo apt-get git`
* [Install ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/wiki/Installing-ffmpeg-on-Debian)
* Clone repo
  * `$ git clone https://github.com/jmsaavedra/volvox-microsoft.git`
* Set local time zone
  * Linux ([ref](http://www.christopherirish.com/2012/03/21/how-to-set-the-timezone-on-ubuntu-server/)):
  * `$ date`  // show date
  * `$ more /etc/timezone` // show timezone file
  * `$ sudo dpkg-reconfigure tzdata` // run timezone config
  * if using cron, restart it:
    * `$ /etc/init.d/cron stop`
    * `$ /etc/init.d/cron start`

* Install ffmpeg
  * OSX: `$ brew install ffmpeg`
  * Linux: wget and unpack manually: [see my gist here](https://gist.github.com/jmsaavedra/62bbcd20d40bcddf27ac).
* Install image/graphicsmagick
  * OSX: 
    * `$ brew install gs graphicsmagick` (both gm + ghostscript)
    * `$ brew install imagemagick`
  * Linux: 
    * `$ sudo apt-get install graphicsmagick`
    * `$ sudo apt-get install ghostscript`
 *
* Install PM2
  * $ `$ npm install pm2 -g`    #follow directions if there is a reply from pm2!
  * $ `$ pm2 startup`           #follow directions if there is a reply from pm2!
  * $ `$ pm2 start myapp.js`    #run your app with pm2
  * $ `$ pm2 save`              #save this process to the startup scripts
  * $ `$ pm2 logs`              #tail console logs

  
