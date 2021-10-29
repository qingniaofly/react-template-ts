// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../config/env');

const {
    createCompiler,
    prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils');
const clearConsole = require('react-dev-utils/clearConsole');

const webpack = require('webpack');
const fsExtra = require('fs-extra');
const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('../config/paths');
const config = require('../webpack.config.dev');
const createDevServerConfig = require('../webpackDevServer.config');
const openBrowser = require('react-dev-utils/openBrowser');

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000; //eslint-disable-line
const HOST = process.env.HOST || '127.0.0.1';
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const urls = prepareUrls(protocol, HOST, DEFAULT_PORT);
const devSocket = {
    warnings: warnings =>
      devServer.sockWrite(devServer.sockets, 'warnings', warnings),
    errors: errors =>
      devServer.sockWrite(devServer.sockets, 'errors', errors),
  };
    const compiler = createCompiler({
    appName: paths.appName,
    config,
    devSocket,
    urls,
    useYarn,
    useTypeScript: false,
    webpack,
  });

if (!fs.existsSync(paths.appBuild)) {
    copyPublicFolder()
}
// WebpackDevServer.addDevServerEntrypoints(config, createDevServerConfig);
// const compiler = Webpack(config);
const server = new WebpackDevServer(compiler, createDevServerConfig(urls.lanUrlForConfig));

server.listen(DEFAULT_PORT, HOST, (err) => {
    if (err) throw err;

    if (isInteractive) {
        clearConsole();
    }
    console.log(chalk.cyan('Starting the development server...\n'));
    // openBrowser(`http://${HOST}:${DEFAULT_PORT}`);
});

function copyPublicFolder() {
    fsExtra.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: file => file !== paths.appHtml
    });
}
