/* eslint-env node */

const mongul = require('./index');

function start() {
  mongul.watchResources();
}

start();
