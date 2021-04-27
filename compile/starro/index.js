/* eslint-env node */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const sass = require('node-sass');
const mxy = require('../mxy');
const metallo = require('../metallo');

const ICON = path.join(__dirname, 'starro.jpg');

const SASS_DEV_OPTIONS = {
  sourceMap: true,
  precision: 3,
  outputStyle: 'expanded',
  includePaths: ['node_modules/'],
};

const SASS_BUILD_OPTIONS = {
  sourceMap: false,
  precision: 3,
  outputStyle: 'compressed',
  includePaths: ['node_modules/'],
};

const POSTCSS_DEV_OPTIONS = {
  map: { inline: false },
};

const POSTCSS_BUILD_OPTIONS = {
  map: false,
};

function onError(error) {
  mxy.error(error, ICON);
}

function logMessage(from) {
  console.log(`${chalk.magenta('⭐ processing styles:')} ${chalk.black(chalk.bgMagenta(` ${from} `))}\n`);
}

function logSuccess(start, from) {
  console.log(`${chalk.magenta('⭐ styles successfully processed:')} ${chalk.bgMagenta(` ${chalk.black(`${from} – ${process.hrtime(start)[0]}s`)} `)}\n`);
  mxy.notify('styles successfully processed', from, ICON);
}

function checkDirectory(where) {
  return fs.mkdir(path.dirname(where), { recursive: true });
}

function writeFile(where, what) {
  return fs.writeFile(where, what);
}

function tryWriteFile(where, what) {
  checkDirectory(where)
    .then(() => writeFile(where, what))
    .catch(onError);
}

function onSassRender(error, result, resolve, reject) {
  if (error) reject(error);
  else resolve(result.css);
}

function processSass(file, options) {
  return new Promise((resolve, reject) => {
    sass.render({ file, ...options }, (error, result) => onSassRender(error, result, resolve, reject));
  });
}

function processCSS(css, from, to, options) {
  return postcss([autoprefixer]).process(css, { from, to, ...options });
}

function saveCSS(result, to) {
  tryWriteFile(to, result.css);
  if (result.map) tryWriteFile(`${to}.map`, result.map);
}

function processStyles({ from, to }) {
  const start = process.hrtime();
  logMessage(from);
  return processSass(from, SASS_DEV_OPTIONS)
    .then(css => processCSS(css, from, to, POSTCSS_DEV_OPTIONS))
    .then(result => saveCSS(result, to))
    .then(() => logSuccess(start, from))
    .catch(onError);
}

function buildStyles({ from, to }) {
  const start = process.hrtime();
  logMessage(from);
  return processSass(from, SASS_BUILD_OPTIONS)
    .then(css => processCSS(css, from, to, POSTCSS_BUILD_OPTIONS))
    .then(result => saveCSS(result, to))
    .then(() => logSuccess(start, from))
    .catch(onError);
}

function lintStyles() {
  const stylelintProcess = exec(`./node_modules/.bin/stylelint ${metallo.getPath('styles').from} --color`);
  stylelintProcess.on('exit', (code) => { if (code !== 0) throw new Error('Linting errors'); });
  stylelintProcess.stdout.pipe(process.stdout);
  stylelintProcess.stderr.pipe(process.stderr);
}

exports.processStyles = processStyles;
exports.buildStyles = buildStyles;
exports.lintStyles = lintStyles;
