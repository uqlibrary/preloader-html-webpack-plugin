var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var RSVP = require('rsvp');

function InjectPreloader(options) {
  this.options = _.extend({

    browserIndicatorPlaceholder: '<!-- build:injectBrowserIndicator -->',
    loadIndicatorPlaceholder: '<!-- build:injectLoadIndicator -->',
    browserUpdateScriptPlaceholder: '<!-- build:injectBrowserUpdateScript -->',

    browserIndicatorTemplate: path.join(__dirname, 'lib/browserIndicator.html'),
    loadIndicatorTemplate: path.join(__dirname, 'lib/loadIndicator.html'),
    browserCheckScriptTemplate: path.join(__dirname, 'lib/browserCheckScript.html')

  }, options);

}

InjectPreloader.prototype.apply = function (compiler) {
  var self = this;
  compiler.hooks.compilation.tap('InjectPreloader', (compilation) => {
    compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
      'InjectPreloader',
      (htmlPluginData, callback) => {
        var loadFile = function (path) {
          return new RSVP.Promise(function (resolve, reject) {
            fs.readFile (path, 'utf8', function (error, data) {
              if (error) {
                reject(error);
              }
              resolve(data);
            });
          });
        };

        var promises = {
          browserIndicator: loadFile(self.options.browserIndicatorTemplate),
          loadIndicator: loadFile(self.options.loadIndicatorTemplate),
          browserScript: loadFile(self.options.browserCheckScriptTemplate)
        };

        RSVP.hash(promises).then(function(files) {

          htmlPluginData.html = htmlPluginData.html.replace(self.options.browserIndicatorPlaceholder, files.browserIndicator);
          htmlPluginData.html = htmlPluginData.html.replace(self.options.loadIndicatorPlaceholder, files.loadIndicator);
          htmlPluginData.html = htmlPluginData.html.replace(self.options.browserUpdateScriptPlaceholder, files.browserScript);

          callback(null, htmlPluginData);

        }).catch(function(reason) {
          reason.plugin = 'preloader-html-webpack-plugin';
          console.error(reason);
          callback(reason, htmlPluginData);
        });
      }
    );
  });
};

module.exports = InjectPreloader;
