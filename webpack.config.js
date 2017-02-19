const path     = require('path');
const webpack  = require('webpack');
const merge    = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS           = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'www'),
  template: path.join(__dirname, 'app/templates/', 'base.hbs'),
  style: path.join(__dirname, 'app/scss/', 'app.scss')
};
const TARGET          = process.env.npm_lifecycle_event;
const ENABLE_POLLING  = process.env.ENABLE_POLLING;
process.env.BABEL_ENV = TARGET;

const common = merge(
  {
    context: __dirname,
    // Entry accepts a path or an object of entries.
    // We'll be using the latter form given it's
    // convenient with more complex configurations.
    entry: {
      app: PATHS.app + '/entry.js'
    },
    output: {
      path: PATHS.build + '/',
      filename: '[name].js',
      //publicPath: 'http://localhost:8080',

      // Modify the name of the generated sourcemap file.
      // You can use [file], [id], and [hash] replacements here.
      // The default option is enough for most use cases.
      sourceMapFilename: '[file].map', // Default

      // This is the sourcemap filename template. It's default format
      // depends on the devtool option used. You don't need to modify this
      // often.
      devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]'
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      })

    ]
  }
);

let config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map'
      },
      parts.setupSCSS(PATHS.style),
      // parts.setFreeVariable(
      //     'process.env.NODE_ENV',
      //     'production'
      // ),
      // parts.extractBundle({
      //     name: 'vendor'
      // }),
      // parts.minify()
      parts.setupSCSS(PATHS.style)
    );
    break;
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map'
      },
      parts.CleanWebpackPlugin(__dirname),
      parts.babel(),
      parts.setupIndexHTML(
        PATHS.template
      ),
      parts.setupSCSS(PATHS.style),
      parts.copyWebpackPlugin(PATHS.app, PATHS.build),
      parts.cordova()
      //parts.rawLoader()
      // parts.devServer({
      //     // Customize host/port here if needed
      //     host: process.env.HOST,
      //     port: process.env.PORT
      // }),
      // parts.npmInstall()
    )
    ;
}

module.exports = validate(config);

