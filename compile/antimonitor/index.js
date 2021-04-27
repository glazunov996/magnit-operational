const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const rimraf = require('rimraf');
const SVGSpriter = require('svg-sprite');
const SVGO = require('svgo');
const mxy = require('../mxy');
const metallo = require('../metallo');

const ICON = path.join(__dirname, 'anti-monitor.jpg');

const SVG_SPRITE_CONFIG = {
  shape: {
    id: {
      generator(name) { return `txspt-${name.replace('/', '-').replace(/.svg$/ui, '')}`; },
    },
  },
  mode: {
    symbol: true,
  },
};

const SVGO_CONFIG = {
  plugins: [
    { removeTitle: true },
    { removeDesc: true },
    { removeViewBox: false },
    { removeUselessDefs: false },
    { removeXMLNS: true },
    { removeRasterImages: true },
    { cleanupIDs: false },
    {
      removeAttrs: {
        attrs: [
          'g:id',
          'path:id',
          'line:id',
          'rect:id',
          'circle:id',
          'symbol:xmlns',
          'fill',
          'stroke',
          'fill-rule',
          'stroke-linecap',
          'stroke-linejoin',
        ],
      },
    },
  ],
};

function isSVG(file) {
  return /.+\.svg$/ui.test(file);
}

function onError(error) {
  mxy.error(error, ICON);
}

function checkDirectory(where) {
  return fs.mkdir(path.dirname(where), { recursive: true });
}

function writeFile(where, what) {
  fs.writeFile(where, what);
}

function tryWriteFile({ name, data }) {
  const where = `${__dirname}/sprites/${name}.svg`;
  checkDirectory(where)
    .then(() => writeFile(where, data))
    .catch(onError);
}

function saveSprites(files) {
  const saves = files.map(tryWriteFile);
  return Promise.all(saves);
}

function logProcessMessage() {
  console.log(`${chalk.yellow('🖥️  processing sprites\n')}`);
}

function logProcessSuccess(start, request) {
  const message = request ? request.replace(',', ', ') : 'all sprites';
  console.log(`${chalk.yellow('🖥️  success:')} ${chalk.bgYellow(` ${chalk.black(`${message} – ${process.hrtime(start)[0]}s`)} `)}\n`);
  mxy.notify('sprites successfully processed', message, ICON);
}

function logUpdateMessage() {
  console.log(`${chalk.yellow('🖥️  updating icons\n')}`);
}

function logUpdateSuccess(start) {
  console.log(`${chalk.yellow('🖥️  success:')} ${chalk.bgYellow(` ${chalk.black(`${process.hrtime(start)[0]}s`)} `)}\n`);
  mxy.notify('icons successfully updated', 'icons updated', ICON);
}

function logEjectMessage(request) {
  const message = request ? request.replace(',', ', ') : 'all sprites';
  console.log(`${chalk.yellow('🖥️  ejecting sprites:')} ${chalk.bgYellow(` ${chalk.black(message)} `)}\n`);
}

function logEjectSuccess() {
  console.log(`${chalk.yellow('🖥️  success')}\n`);
}

function findIconDirectory(stats, sprite) {
  if (stats.isDirectory()) return fs.readdir(`${metallo.getPath('sprites').from}/${sprite}`).then(icons => ({ [sprite]: icons }));
  return false;
}

function findIcons(sprite) {
  return fs.stat(`${metallo.getPath('sprites').from}/${sprite}`).then(stats => findIconDirectory(stats, sprite));
}

function findSVGs(content) {
  const svgs = content.map(findIcons);
  return Promise.all(svgs);
}

function filterSprites(sprites) {
  return sprites.filter(sprite => sprite);
}

function findSprites(names) {
  if (names) {
    return findSVGs(names)
      .then(filterSprites);
  }
  return fs.readdir(`${metallo.getPath('sprites').from}`)
    .then(findSVGs)
    .then(filterSprites);
}

function readIconFile(icon, name) {
  return fs.readFile(`${metallo.getPath('sprites').from}/${name}/${icon}`, { encoding: 'utf-8' });
}

function readIconFiles(icons, name) {
  const files = icons.map(icon => readIconFile(icon, name));
  return Promise.all(files);
}

function addIcon(file, index, icons, basePath, name, spriter) {
  const iconsPath = `${basePath}/${icons[index]}`;
  const namePath = `${name}/${icons[index]}`;
  spriter.add(iconsPath, namePath, file);
}

function assembleSprite(files, icons, name) {
  const spriter = new SVGSpriter(SVG_SPRITE_CONFIG);
  const iconPath = `/icons/${name}`;
  files.forEach((file, index) => { addIcon(file, index, icons, iconPath, name, spriter); });
  return spriter;
}

function compileSprite(spriter, name) {
  return new Promise((resolve, reject) => {
    spriter.compile((error, result) => {
      if (error) reject(error);
      else resolve({ name, file: result.symbol.sprite.contents });
    });
  });
}

function processSpriteDirectory(sprite) {
  const [[ name, icons ]] = Object.entries(sprite);
  return readIconFiles(icons, name)
    .then(files => assembleSprite(files, icons, name))
    .then(spriter => compileSprite(spriter, name));
}

function processSpriteDirectories(sprites) {
  return sprites.map(processSpriteDirectory);
}

function processSpriteSVGs(sprites) {
  const files = processSpriteDirectories(sprites);
  return Promise.all(files);
}

function processSVGs(names) {
  return findSprites(names)
    .then(processSpriteSVGs);
}

function minifySVG(svg, svgo) {
  const data = svg.file.toString('utf-8');
  return svgo.optimize(data).then(minified => ({ name: svg.name, data: minified.data }));
}

function minifySVGs(svgs) {
  const svgo = new SVGO(SVGO_CONFIG);
  const minSVGs = svgs.map(svg => minifySVG(svg, svgo));
  return Promise.all(minSVGs);
}

function processSprites(request) {
  const names = request ? request.split(',') : null;
  const start = process.hrtime();
  logProcessMessage();
  return processSVGs(names)
    .then(minifySVGs)
    .then(saveSprites)
    .then(() => logProcessSuccess(start, request))
    .catch(onError);
}

function removeIcons() {
  return new Promise((resolve) => {
    rimraf(`${metallo.getPath('sprites').from}`, resolve);
  });
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout || stderr);
    });
  });
}

function moveIconsFolder() {
  return fs.rename(`${__dirname}/tmp/icons`, `${metallo.getPath('sprites').from}`);
}

function removeTmpFolder() {
  return new Promise((resolve) => {
    rimraf(`${__dirname}/tmp`, resolve);
  });
}

function filterSpriteFiles(files) {
  return files.filter(isSVG);
}

function findSpriteFiles() {
  return fs.readdir(`${__dirname}/sprites/`)
    .then(filterSpriteFiles);
}

function copySpriteFile(file, paths) {
  const spriteFile = isSVG(file) ? file : `${file}.svg`;
  return fs.copyFile(`${__dirname}/sprites/${spriteFile}`, `./${paths.to}/${spriteFile}`);
}

function checkSpriteDirectory({ to }) {
  return fs.mkdir(to, { recursive: true });
}

function copySpriteFiles(files, paths) {
  const copies = files.map(file => copySpriteFile(file, paths));
  return Promise.all(copies);
}

function ejectSprites(request) {
  const paths = metallo.getPath('sprites');
  const names = request ? request.split(',') : null;
  logEjectMessage(request);
  if (names) {
    return checkSpriteDirectory(paths)
      .then(() => copySpriteFiles(names, paths))
      .then(logEjectSuccess)
      .catch(onError);
  }
  return checkSpriteDirectory(paths)
    .then(findSpriteFiles)
    .then(files => copySpriteFiles(files, paths))
    .then(logEjectSuccess)
    .catch(onError);
}

exports.processSprites = processSprites;
exports.ejectSprites = ejectSprites;
