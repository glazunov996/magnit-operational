/* eslint-env node */
/* eslint no-process-env: "off" */
/* eslint no-use-before-define: "off" */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const metallo = require('../metallo');
const mxy = require('../mxy');

const ICON = path.join(__dirname, 'grundy.jpg');

const MARKUP = `
<!doctype html>

<html>

  <head>
    <meta charset="utf8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta http-equiv="cleartype" content="on">
    <title>${generateMarkupName()}</title>
    <link rel="stylesheet" href="/css/styles.css">
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='43' height='43'%3E%3Crect width='43' height='43' rx='2' fill='%23E30613'/%3E%3Cpath d='M7.928 8.011A9.929 9.929 0 005 15.071V28.16l.897-.137c2.202-.337 4.26-2.398 4.26-4.46v-8.25c0-1.304.615-2.676 1.546-3.61.93-.931 2.308-1.546 3.61-1.546H38V5H14.973c-2.657 0-5.159 1.12-7.045 3.011zM35.072 34.989A9.93 9.93 0 0038 27.929V14.84l-.897.137c-2.202.338-4.26 2.398-4.26 4.46v8.25c0 1.304-.615 2.676-1.546 3.61-.93.931-2.308 1.546-3.61 1.546H5V38h23.027c2.657 0 5.159-1.12 7.045-3.011z' fill='%23fff'/%3E%3Cpath d='M24.502 28.05v-6.655L21.5 25.037l-3.001-3.642v6.655h-3.976v-13.1h3.766l3.21 4.212 3.211-4.212h3.768v13.1h-3.976z' fill='%23fff'/%3E%3C/svg%3E" type="image/svg+xml" />
  </head>

  <body>
    <!-- SPRITES -->
    ${generateScripts()}
    ${generateProxyScripts()}
    ${generateTestScripts()}
  </body>

</html>
`;

function onError(error) {
  mxy.error(error, ICON);
}

function logMessage() {
  console.log(`${chalk.cyan('📅 generating markup')}\n`);
}

function logSuccess(start, to) {
  console.log(`${chalk.cyan('📅 markup successfully generated:')} ${chalk.bgCyan(` ${chalk.black(`${to} – ${process.hrtime(start)[0]}s`)} `)}\n`);
  mxy.notify('markup successfully generated', to, ICON);
}

function generateMarkupName() {
  return process.env.npm_package_name.split('/').pop();
}

function generateScripts() {
  if (process.env.API_TESTS === 'true') return '';
  return '<script src="/js/scripts.js"></script>';
}

function generateProxyScripts() {
  if (process.env.ENV === 'production' || process.env.ENV === 'demo') {
    return `<script src="https://qsense.corp.tander.ru/resources/assets/external/requirejs/require.js"></script>
    <script src="/js/proxy.js"></script>`;
  }
  return '<script src="/js/proxyDev.js"></script>';
}

function generateTestScripts() {
  if (process.env.API_TESTS === 'true') return '<script src="/js/apiTests.js"></script>';
  return '';
}

function readSprite(where) {
  return fs.readFile(where, { encoding: 'utf-8' });
}

function generateMarkup() {
  return new Promise((resolve) => {
    const from = `${metallo.getPath('sprites').to}**/*.svg`;
    glob(from, (error, matches) => {
      if (matches.length > 0) {
        Promise.all(matches.map(readSprite))
          .then(sprites => sprites.join(''))
          .then(result => result.replace('<svg>', '<svg class="txcm-sprites">'))
          .then(result => MARKUP.replace('<!-- SPRITES -->', result))
          .then((result) => { resolve(result); });
      } else resolve(MARKUP.replace('    <!-- SPRITES -->\n', ''));
    });
  });
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

function saveFile(result, to) {
  tryWriteFile(to, result);
}

function generateHTML(to) {
  const start = process.hrtime();
  logMessage();
  return generateMarkup()
    .then(result => saveFile(result, to))
    .then(() => logSuccess(start, to))
    .catch(onError);
}

exports.generateHTML = generateHTML;
