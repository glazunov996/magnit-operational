const antiMonitor = require('./index.js');

function eject() {
  const [ request ] = process.argv.slice(2);
  antiMonitor.ejectSprites(request);
}

eject();
