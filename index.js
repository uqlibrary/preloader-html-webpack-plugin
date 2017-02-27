var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');
Promise.promisifyAll(fs);

// MyPlugin.js
function InjectPreloader(options) {
  this.options = _.extend({

    browserIndicatorPlaceholder: '<!-- build:injectBrowserIndicator -->',
    loadIndicatorPlaceholder: '<!-- build:injectLoadIndicator -->',
    browserUpdateScriptPlaceholder: '<!-- build:injectBrowserUpdateScript -->',

    browserIndicatorTemplate: './lib/browserIndicator.html',
    loadIndicatorTemplate: './lib/loadIndicator.html',
    browserCheckScriptTemplate: './lib/browserCheckScript.html'

  }, options);

  this.defaultLoader = `
    <style>
    
      #loadIndicator {
        padding: calc(50vh - 46px) calc(50vw - 46px);
        display: none;
      }
    
      #loadIndicator .loader {
        border: 8px solid #ddd; /* Light grey */
        border-top: 8px solid #49075e; /* UQ Purple */
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: loaderSpin 2s linear infinite;
      }
    
      @keyframes loaderSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    
    </style>
    <div id="loadIndicator">
        <p aria-label="Loading web site" class="loader"> </p>
    </div>
    `;

  this.defaultBrowserIndicator = `
    <div id="preloader">
      <noscript>
      
        <div id="noscript" class="card">
      
          <div class="card-title">
            JavaScript not detected
          </div>
      
          <div class="card-content">
            <p>
            The UQ Library web sites require
            JavaScript to work correctly. Please, <a href="http://enable-javascript.com/">enable JavaScript</a> to
            proceed or check a list of <a href="https://web.library.uq.edu.au/site-information/web-browser-compatibility">supported browsers</a> and try using a different browser, or <a href="http://browser-update.org/update.html">upgrade your current browser</a>.
            </p>
      
          </div>
      
        </div>
      
      </noscript>
      
      <div id="unsupportedBrowser" class="card">
        <div class="card-title">
          Unsupported browser detected
        </div>
        <div class="card-content">
        <p>
            Your current browser is not on UQ Library's <a href="https://web.library.uq.edu.au/site-information/web-browser-compatibility">list of supported browsers</a>.
            If you experience any problems with this site, please try using the site with a different browser, or <a href="http://browser-update.org/update.html">upgrade your current browser</a>
            to the latest version.
          </p>
        </div>
      </div>
      
      <style>
      
        #preloader #unsupportedBrowser {
            display: none;
            position: relative;
            z-index: 999999;
        }
      
        #preloader .card {
          color: rgba(0, 0, 0, 0.870588);
          background-color: rgb(255, 255, 255);
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          box-sizing: border-box;
          font-family: Roboto, sans-serif;
          box-shadow: rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px;
          border-top-left-radius: 2px;
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          border-bottom-left-radius: 2px;
          margin: 16px;
        }
      
        #preloader .card-title {
          padding: 16px; position: relative;
          font-size: 24px;
          color: rgba(0, 0, 0, 0.870588);
          display: block;
          line-height: 36px;
        }
      
        #preloader .card-content {
          padding: 16px;
          font-size: 14px; color:
                rgba(0, 0, 0, 0.870588);
        }
      
      </style>
      
      </div>
  `;

  this.defaultBrowserUpdate = `
    <script type="text/javascript">
    
      var vs = {i:10,f:40,o:30,s:7,c:40};
      var $buoop = {
        vs: vs,
        api:4,
        reminder: 168,                    // after how many hours should the message reappear, 0 = show all the time
        reminderClosed: 168,              // if the user closes message it reappears after x hours
        test: false,                      // true = always show the bar (for testing)
        text: 'Your current browser is not on UQ Library\\'s <a href=\"https://web.library.uq.edu.au/site-information/web-browser-compatibility\">list of supported browsers</a>. If you experience any problems with this site, please try using the site with a different browser, or <a href=\"http://browser-update.org/update.html\">upgrade your current browser</a> to the latest version. ',         // custom notification html text
        newwindow: true,                  // open link in new window/tab
        url: 'https://web.library.uq.edu.au/site-information/web-browser-compatibility' // the url to go to after clicking the notification
      };
      
      function $buo_f(){ 
       var e = document.createElement("script"); 
       e.src = "//browser-update.org/update.min.js"; 
       document.body.appendChild(e);
      };
      try {document.addEventListener("DOMContentLoaded", $buo_f,false)}
      catch(e){window.attachEvent("onload", $buo_f)}
      
      //(c)2017, MIT Style License <browser-update.org/LICENSE.txt>
      //it is recommended to directly link to this file because we update the detection code
      
      function getBrowserDetails() {
        var n, t, ua = navigator.userAgent, donotnotify = false;
        var names = {
          i: 'Internet Explorer',
          e: "Edge",
          f: 'Firefox',
          o: 'Opera',
          s: 'Safari',
          n: 'Netscape',
          c: "Chrome",
          a: "Android Browser",
          y: "Yandex Browser",
          v: "Vivaldi",
          x: "Other"
        };
    
        function ignore(reason, pattern) {
          if (RegExp(pattern, "i").test(ua))return reason;
        }
    
        var ig = ignore("bot", "bot|spider|googlebot|facebook|slurp|bingbot|google web preview|mediapartnersadsbot|AOLBuild|Baiduspider|DuckDuckBot|Teoma") || ignore("discontinued browser", "camino|flot|k-meleon|fennec|galeon|chromeframe|coolnovo") || ignore("complicated device browser", "SMART-TV|SmartTV") || ignore("niche browser", "Dorado|Whale|SamsungBrowser|MIDP|wii|UCBrowser|Chromium|Puffin|Opera Mini|maxthon|maxton|dolfin|dolphin|seamonkey|opera mini|netfront|moblin|maemo|arora|kazehakase|epiphany|konqueror|rekonq|symbian|webos|PaleMoon|QupZilla|Otter|Midori|qutebrowser") || ignore("mobilew without upgrade path or landing page", "iphone|ipod|ipad|kindle|silk|blackberry|bb10|RIM|PlayBook|meego|nokia") || ignore("android(chrome) web view", "; wv");
        if (ig)return {n: "x", v: 0, t: "other browser", donotnotify: ig};
        var mobile = (/iphone|ipod|ipad|android|mobile|phone|ios|iemobile/i.test(ua));
        var pats = [["Trident.*rv:VV", "i"], ["Trident.VV", "io"], ["MSIE.VV", "i"], ["Edge.VV", "e"], ["Vivaldi.VV", "v"], ["OPR.VV", "o"], ["YaBrowser.VV", "y"], ["Chrome.VV", "c"], ["Firefox.VV", "f"], ["Version.VV.{0,10}Safari", "s"], ["Safari.VV", "so"], ["Opera.*Version.VV", "o"], ["Opera.VV", "o"], ["Netscape.VV", "n"]];
        for (var i = 0; i < pats.length; i++)if (ua.match(new RegExp(pats[i][0].replace("VV", "(\\\\d+\\\\.?\\\\d?)")), "i")) {
          n = pats[i][1];
          break;
        }
        var v = parseFloat(RegExp.$1);
        if (!n)return {n: "x", v: 0, t: names[n], mobile: mobile};
        if (ua.indexOf('Android') > -1) {
          var ver = parseInt((/WebKit\\/([0-9]+)/i.exec(ua) || 0)[1], 10) || 2000;
          if (ver <= 534)return {n: "a", v: ver, t: names.a, mob: true, donotnotify: donotnotify, mobile: mobile};
        }
        if (/windows.nt.5.0|windows.nt.4.0|windows.95|windows.98|os x 10.2|os x 10.3|os x 10.4|os x 10.5|os x 10.6|os x 10.7/.test(ua)) donotnotify = "oldOS";
        if (n == "f" && (Math.round(v) == 45 || Math.round(v) == 52)) donotnotify = "ESR";
        if (n == "so") {
          v = 4.0;
          n = "s";
        }
        if (n == "i" && v == 7 && window.XDomainRequest) v = 8;
        if (n == "io") {
          n = "i";
          if (v > 6) v = 11; else if (v > 5) v = 10; else if (v > 4) v = 9; else if (v > 3.1) v = 8; else if (v > 3) v = 7; else v = 9;
        }
        if (n == "e")return {n: "i", v: v, t: names[n] + " " + v, donotnotify: donotnotify, mobile: mobile};
    
        return {n: n, v: v, t: names[n] + " " + v, donotnotify: donotnotify, mobile: mobile};
        
      }
    
      var browserInfo = getBrowserDetails();
        
      if (browserInfo && browserInfo.v > vs[browserInfo.n]) {
        if(document.getElementById('loadIndicator')) {
          //hide loadIndicator if browser is not supported
          document.getElementById('loadIndicator').style.display = 'block';
        }
        //if (document.getElementById('unsupportedBrowser'))
          //hide unsupportedBrowser as soon as possible
          //document.getElementById('unsupportedBrowser').style.display = 'none';
      } else {
      
        if (document.getElementById('unsupportedBrowser')) {
          //hide unsupportedBrowser as soon as possible
          document.getElementById('unsupportedBrowser').style.display = 'block';
        }
          
        if(document.getElementById('loadIndicator')) {
          //hide loadIndicator if browser is not supported
          document.getElementById('loadIndicator').style.display = 'none';
        }
      }
    </script>
    `;
}

InjectPreloader.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('compilation', function (compilation) {

    console.log('BrowserCheck: The compiler is starting a new compilation...');

    compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {

      htmlPluginData.html = htmlPluginData.html.replace(self.options.browserIndicatorPlaceholder, self.defaultBrowserIndicator);
      htmlPluginData.html = htmlPluginData.html.replace(self.options.loadIndicatorPlaceholder, self.defaultLoader);
      htmlPluginData.html = htmlPluginData.html.replace(self.options.browserUpdateScriptPlaceholder, self.defaultBrowserUpdate);

      callback(null, htmlPluginData);

      //TODO: load from files if templates have been provided...
      // //'node_modules/uqlibrary-browser-supported/preloader.html'
      // const filename = path.resolve(self.options.preloaderTemplate);
      //
      // return Promise.props({
      //   size: fs.statAsync(filename),
      //   source: fs.readFileAsync(filename)
      // })
      // .catch(function () {
      //   return Promise.reject(new Error('BrowserCheck: could not load file ' + filename));
      // })
      // .then(function (results) {
      //
      //   //insert preloader template
      //   htmlPluginData.html = htmlPluginData.html.replace(self.options.preloaderPlaceholder, results.source);
      //
      //   //insert browser check template
      //   htmlPluginData.html = htmlPluginData.html.replace(self.options.browserCheckPlaceholder,'<!-- TBA: browser check script -->');
      //
      //   callback(null, htmlPluginData);
      // });
    });
  });
};
module.exports = InjectPreloader;
