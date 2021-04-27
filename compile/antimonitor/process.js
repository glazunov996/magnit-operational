const antiMonitor = require('./index.js');

function proccess() {
  const [ request ] = process.argv.slice(2);
  antiMonitor.processSprites(request);
}

proccess();
