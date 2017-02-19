const webpack            = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const NpmInstallPlugin   = require('npm-install-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const CordovaPlugin      = require('webpack-cordova-plugin');

exports.devServer = function (options) {
  return {
    watchOptions: {
      // Delay the rebuild after the first change
      aggregateTimeout: 300,
      // Poll using interval (in ms, accepts boolean too)
      poll: 2000
    },
    devServer: {
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,
      contentBase: "./build",

      // Display only errors to reduce the amount of output.
      stats: 'errors-only',

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  }
};

exports.setupSCSS = function (paths) {
  return {
    module: {
      loaders: [{
        test: /\.scss$/i,
        loaders: ["style", "css", "sass"]
        //include: paths
      }]
    }
  }
};

exports.setupIndexHTML = function (options) {
  return {
    module: {
      loaders: [
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'app/templates/base.hbs'
      })
    ]
  };
};


exports.copyWebpackPlugin = function (paths, build) {
  return {
    context: paths,
    devServer: {
      // This is required for webpack-dev-server if using a version <3.0.0.
      // The path should be an absolute path to your build destination.
      outputPath: build + '/'
    },
    plugins: [
      new CopyWebpackPlugin([
        // Copy directory contents to {output}/to/directory/
        {from: paths + '/assets/', to: './build'},
        {from: paths + '/*.html', to: './build'}
      ], {
        ignore: [
          // Doesn't copy any files with a txt extension
          '*.txt',

          // Doesn't copy any file, even if they start with a dot
          {glob: '**/*', dot: true}
        ],

        // By default, we only copy modified files during
        // a watch or webpack-dev-server build. Setting this
        // to `true` copies all files.
        copyUnmodified: true
      })
    ]
  }
};

exports.rawLoader = function () {
  return {
    module: {
      loaders: [{
        test: /\.html$/,
        loader: "raw-loader"
      }]
    }
  }
};


exports.npmInstall = function (options) {
  options = options || {};

  return {
    plugins: [
      new NpmInstallPlugin(options)
    ]
  };
};
