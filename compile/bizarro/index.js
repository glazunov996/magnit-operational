/* eslint-env node */

const fs = require('fs').promises;
const https = require('https');
const path = require('path');
const url = require('url');
const networkInterfaces = require('os').networkInterfaces();
const chalk = require('chalk');
const connect = require('connect');
const serveStatic = require('serve-static');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mxy = require('../mxy');
const metallo = require('../metallo');

const ICON = path.join(__dirname, 'bizarro.jpg');

let app;

let directory;
let port;
let backend;
let ip;

function logMessage() {
  console.log(`${chalk.yellow('🚀 server has started:')}\n`);
  if (ip) console.log(`${chalk.yellow('🚀 network address:')} ${chalk.black(chalk.bgYellow(` https://${ip}:${port} `))}`);
  console.log(`${chalk.yellow('🚀 local address:')} ${chalk.black(chalk.bgYellow(` https://localhost:${port} `))}\n`);
  mxy.notify('server has started', `${ip ? `https://${ip}:${port}\n` : ''}https://localhost:${port}`, ICON);
}

function logResponse(file) {
  console.log(`${chalk.yellow('🚀 serving file:')} ${chalk.black(chalk.bgYellow(` ${file} `))}\n`);
}

function log404(file) {
  console.log(`${chalk.red('🚀 file not found:')} ${chalk.white(chalk.bgRed(` ${file} `))}\n`);
}

function logAPICall(apiPath, method) {
  console.log(`${chalk.cyan('🚀 API call:')} ${chalk.black(chalk.bgCyan(` (${method}) ${apiPath} `))}\n`);
}

function findIP() {
  const info = Object.values(networkInterfaces)
    .flat()
    .find(option => option.family === 'IPv4' && !option.internal);
  ip = info ? info.address : null;
}

function generatePagesResponse(buffer, res) {
  const response = {
    headers: {
      'Content-Type': 'text/html',
      'Content-Length': buffer.length,
    },
    body: buffer,
  };
  res.writeHead(200, response.headers);
  res.end(buffer);
  return response;
}

function serveResource(file, res) {
  return fs.readFile(file)
    .then(buffer => generatePagesResponse(buffer, res, file));
}

function generateFilename(pathname, name, ext) {
  const filename = `${name ? '' : 'index'}${ext ? '' : '.html'}`;
  return `${pathname}${filename}`;
}

function normalizePage(req, res, next) {
  const reqURL = url.parse(req.url);
  const { pathname } = reqURL;
  const { name, ext } = path.parse(pathname);
  if (ext === '' || ext === '.html' || ext === '.htm') {
    const filename = generateFilename(pathname, name, ext);
    const filepath = `${directory}${filename}`;
    return fs.stat(filepath)
      .then(() => serveResource(filepath, res))
      .catch(() => serveResource(`${directory}/index.html`, res));
  }
  return next();
}

function logRequest(req, res, next) {
  const reqURL = url.parse(req.url);
  const { pathname } = reqURL;
  if (pathname.includes('/api/')) {
    logAPICall(pathname, req.method);
  } else {
    const { name, ext } = path.parse(pathname);
    const filename = generateFilename(pathname, name, ext);
    const filepath = `${directory}${filename}`;
    if (ext === '' || ext === '.html' || ext === '.htm') {
      fs.stat(filepath)
        .then(() => logResponse(filepath))
        .catch(() => logResponse(`${directory}/index.html`));
    } else {
      fs.stat(filepath)
        .then(() => logResponse(filepath))
        .catch(() => log404(filepath));
    }
  }
  return next();
}

function readCredentials() {
  return Promise.all([
    fs.readFile(path.join(__dirname, 'key.pem')),
    fs.readFile(path.join(__dirname, 'cert.pem')),
  ]);
}

function createServer([ key, cert ]) {
  https.createServer({ key, cert }, app).listen(port);
}

function initApp() {
  app = connect();
  app.use(logRequest);
  app.use('/api', createProxyMiddleware({
    target: `https://localhost:${backend}`,
    changeOrigin: true,
    logLevel: 'silent',
  }));
  app.use(normalizePage);
  app.use(serveStatic(directory));
}

function startServer() {
  directory = metallo.getPath('public');
  port = metallo.getConfigComponent('port');
  backend = metallo.getConfigComponent('backendPort');
  findIP();
  initApp();
  logMessage();
  readCredentials().then(createServer);
}

exports.startServer = startServer;
