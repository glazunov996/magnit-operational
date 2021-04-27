/* eslint-env node */

const path = require('path');
const chalk = require('chalk');
const livereload = require('livereload');
const mxy = require('../mxy');
const metallo = require('../metallo');

const ICON = path.join(__dirname, 'mongul.jpg');

const LIVERELOAD_OPTIONS = {
  extraExts: ['svelte'],
  delay: 1000,
};

function onError(error) {
  mxy.error(error);
}

function logMessage() {
  console.log(`${chalk.yellow('👽 livereload server has started')}\n`);
  mxy.notify('livereload server started', 'add, edit or remove files to trigger browser refresh', ICON);
}

function startServer() {
  return new Promise((resolve) => {
    const server = livereload.createServer(LIVERELOAD_OPTIONS, resolve);
    const publicPath = metallo.getPath('public');
    server.watch(publicPath);
  });
}

function watchResources() {
  startServer()
    .then(logMessage)
    .catch(onError);
}

exports.watchResources = watchResources;
