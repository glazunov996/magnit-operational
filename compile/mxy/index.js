/* eslint-env node */

const chalk = require('chalk');
const notifier = require('node-notifier');

function notify(title, message, icon) {
  notifier.notify({
    title,
    message,
    icon,
    sound: false,
    wait: false,
    time: 1000,
    timeout: 1,
  });
}

function error(errorObject, icon) {
  let errorText = 'error';
  if (errorObject && errorObject.formatted) ({ formatted: errorText } = errorObject);
  else if (errorObject) errorText = errorObject;
  console.error(chalk.red(errorText));
  if (icon) {
    notify('error!', errorText, icon);
  }
}

exports.notify = notify;
exports.error = error;
