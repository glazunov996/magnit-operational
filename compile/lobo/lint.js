/* eslint-env node */

const lobo = require('./index');

function lint() {
  lobo.lintScripts();
}

lint();
