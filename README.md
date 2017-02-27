# preloader-html-webpack-plugin
This is a [webpack](http://webpack.github.io/) hook for [html-webpack-plugin]() which inserts standard browser checks, unsupported browser messages, and loading indicator.

Installation
------------
This hook is not registered with npm, to install it, insert into package.json and then run ```npm install```

```
    "preloader-html-webpack-plugin": "github:uqlibrary/preloader-html-webpack-plugin#master"
```

Basic Usage
-----------

The hook will insert HTML/JS required for browser check, noscript message, loader graphic. Just add the plugin to your webpack
config as follows:

```javascript
var InjectPreloader = require('preloader-html-webpack-plugin');

var webpackConfig = {
  plugins: [new InjectPreloader()]
};
```

Your HTML entry page has to have placeholders for the hook to insert the code.


Configuration
-------------

You can pass a hash of configuration options to `InjectPreloader`.
Allowed values are as follows:

- `browserIndicatorPlaceholder`: a placeholder where noscript/unsupported browser message to be inserted. default value is `<!-- build:injectBrowserIndicator -->` 
- `loadIndicatorPlaceholder`: a placeholder where a loader graphic to be inserted. default value is `<!-- build:injectLoadIndicator -->` 
- `browserUpdateScriptPlaceholder`: a placeholder where a browser check script to be inserted. default value is `<!-- build:injectBrowserUpdateScript -->`
- `browserIndicatorTemplate`: an HTML template of a noscript/unsupported browser message if default is not suitable. Default value is `./lib/browserIndicator.html` 
- `loadIndicatorTemplate`: an HTML template of a load graphic if default is not suitable. Default value is `./lib/loadIndicator.html` 
- `browserCheckScriptTemplate`: a browser check script template if default is not suitable. Default value is `./lib/browserCheckScript.html` 


# License

This project is licensed under [MIT](https://github.com/uqlibrary/preloader-html-webpack-plugin/blob/master/LICENSE).
