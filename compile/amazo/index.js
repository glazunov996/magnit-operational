/* eslint-env node */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const chokidar = require('chokidar');
const grundy = require('../grundy');
const lobo = require('../lobo');
const starro = require('../starro');
const mxy = require('../mxy');
const metallo = require('../metallo');

const ICON = path.join(__dirname, 'amazo.jpg');

const WATCH_OPTIONS = {
  cwd: `${metallo.getPath('src')}/`,
  depth: 7,
  ignored: /(?:^|[/\\])\../gu,
  persistent: true,
};

const TASKS = {
  styles: starro.processStyles,
  js: lobo.processScripts,
};

const TYPES = {
  '.scss': 'styles',
  '.sass': 'styles',
  '.css': 'styles',
  '.js': 'js',
  '.svelte': 'js',
  '.json': 'js',
};

let watcher;
let waiting;

let stylePaths;
let styleFiles;

let scriptPaths;
let scriptFiles;

function onError(error) {
  mxy.error(error);
}

function logAdd(where) {
  console.log(`${chalk.green('🤖 file added:')} ${chalk.black(chalk.bgGreen(` ${where} `))}\n`);
}

function logUnlink(where) {
  console.log(`${chalk.green('🤖 file removed:')} ${chalk.black(chalk.bgGreen(` ${where} `))}\n`);
}

function logChange(where) {
  console.log(`${chalk.green('🤖 file changed:')} ${chalk.black(chalk.bgGreen(` ${where} `))}\n`);
}

function logMessage() {
  console.log(chalk.green('🤖 listening for changes\n'));
  mxy.notify('listening for changes', 'add, edit or remove files to trigger processing', ICON);
}

function clearFiles(files, directory) {
  return Promise.all(files.map(file => fs.unlink(path.join(directory, file))));
}

function clearDirectory(directory) {
  return fs.readdir(directory)
    .then(files => clearFiles(files, directory))
    .catch(onError);
}

function startWatcher() {
  return chokidar.watch('./', WATCH_OPTIONS);
}

function detectType(where) {
  const ext = path.extname(where);
  return TYPES[ext];
}

function chooseTask(type) {
  return TASKS[type];
}

function choosePaths(item, type) {
  let paths;
  let toName;
  if (type === 'styles') {
    paths = stylePaths;
    toName = `${item.name}.css`;
  } else {
    paths = scriptPaths;
    toName = item.file;
  }
  return {
    from: `${paths.from}/${item.file}`,
    to: `${paths.to}/${toName}`,
  };
}

function runFileTask(item, type, task) {
  if (task) return task(choosePaths(item, type));
  return Promise.resolve();
}

function runFilesTask(files, type, task) {
  return files.map(item => runFileTask(item, type, task));
}

function runTask(where, type) {
  const taskType = type || detectType(where);
  const task = chooseTask(taskType);
  const files = taskType === 'styles' ? styleFiles : scriptFiles;
  return Promise.all(runFilesTask(files, taskType, task));
}

function runInititalStylesTask() {
  if (styleFiles) return Promise.all(runFilesTask(styleFiles, 'styles', starro.processStyles));
  return Promise.resolve();
}

function runInititalScriptsTask() {
  if (scriptFiles) return Promise.all(runFilesTask(scriptFiles, 'js', lobo.processScripts));
  return Promise.resolve();
}

function runInititalTasks() {
  const markupTo = path.join(metallo.getPath('markup').to, metallo.getConfigComponent('markup'));
  return grundy.generateHTML(markupTo)
    .then(runInititalStylesTask)
    .then(runInititalScriptsTask);
}

function detectPaths() {
  stylePaths = metallo.getPath('styles');
  scriptPaths = metallo.getPath('js');
}

function filterStyles(item) {
  const ext = path.extname(item);
  const isExtStyles = ext === '.scss' || ext === '.sass' || ext === '.css';
  const notTest = !item.includes('.test.');
  return isExtStyles && notTest;
}

function filterScripts(item) {
  const ext = path.extname(item);
  const isExtScripts = ext === '.js' || ext === '.svelte';
  const notTest = !item.includes('.test.');
  return isExtScripts && notTest;
}

function saveFile(file) {
  const name = file.split('.').shift();
  return { file, name };
}

function filterFiles(items, filterTask) {
  return items.filter(filterTask).map(saveFile);
}

function saveFiles(lists) {
  if (lists[0]) styleFiles = filterFiles(lists[0], filterStyles);
  if (lists[1]) scriptFiles = filterFiles(lists[1], filterScripts);
}

function readDir(where) {
  return fs.stat(where)
    .then((stats) => {
      if (stats.isDirectory()) return fs.readdir(where);
      return Promise.resolve(null);
    })
    .catch(() => Promise.resolve(null));
}

function detectFiles() {
  return Promise.all([ readDir(stylePaths.from), readDir(scriptPaths.from) ])
    .then(saveFiles)
    .catch(onError);
}

function onAdd(where) {
  logAdd(where);
  waiting = waiting.then(() => (
    detectFiles(where)
      .then(() => runTask(where))
  ));
}

function onUnlink(where) {
  const type = detectType(where);
  const directory = type === 'styles' ? stylePaths.to : scriptPaths.to;
  logUnlink(where);
  waiting = waiting.then(() => (
    Promise.all([
      clearDirectory(directory),
      detectFiles(where),
    ]))
    .then(() => runTask(where, type)));
}

function onChange(where) {
  logChange(where);
  waiting = waiting.then(() => runTask(where));
}

function onReady() {
  logMessage();
  waiting = runInititalTasks();
  watcher.on('add', onAdd);
  watcher.on('unlink', onUnlink);
  watcher.on('change', onChange);
  watcher.on('error', onError);
}

function watchResources() {
  detectPaths();
  detectFiles();
  watcher = startWatcher(WATCH_OPTIONS);
  waiting = Promise.resolve();
  watcher.on('ready', onReady);
}

exports.watchResources = watchResources;
