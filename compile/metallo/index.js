/* eslint-env node */

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const mxy = require('../mxy');
const project = require('./project.json');

const STYLES_PATHS = {
  from: ['src', 'sass'],
  to: ['public', 'css'],
  buildTo: ['build', 'css'],
  include: ['src', 'sass', 'components'],
};

const JS_PATHS = {
  from: ['src', 'js'],
  to: ['public', 'js'],
  buildTo: ['build', 'js'],
  include: ['src', 'js'],
};

const FONT_PATHS = {
  from: ['src', 'fonts'],
  to: ['public', 'fonts'],
  buildTo: ['build', 'fonts'],
};

const SPRITES_PATHS = {
  from: ['src', 'sprites'],
  to: ['public', 'sprites'],
  buildTo: ['build', 'sprites'],
};

const DICTIONARIES_PATHS = {
  from: ['src', 'dictionaries'],
  include: ['src', 'js', 'configs', 'dictionaries'],
};

const MARKUP_PATHS = {
  to: ['public'],
  buildTo: ['build'],
};

const PATHS = {
  styles: STYLES_PATHS,
  js: JS_PATHS,
  fonts: FONT_PATHS,
  sprites: SPRITES_PATHS,
  dictionaries: DICTIONARIES_PATHS,
  markup: MARKUP_PATHS,
  public: ['public'],
  build: ['build'],
  src: ['src'],
};

function onError(error) {
  mxy.error(error);
}

function logMessage(file) {
  console.log(`${chalk.cyan('🤘 ejecting config:')} ${chalk.bgCyan(` ${chalk.black(file)} `)}\n`);
}

function logSuccess(file) {
  console.log(`${chalk.cyan('🤘 successfully ejected:')} ${chalk.bgCyan(` ${chalk.black(file)} `)}\n`);
}

function getConfigComponent(key) {
  return project[key];
}

function generateConfigFilePath(file) {
  return `configs/${file}`;
}

function generateConfigPaths(type) {
  const file = getConfigComponent(type);
  const src = generateConfigFilePath(file);
  return { file, src };
}

function collectComponents(keys) {
  return keys.map(key => getConfigComponent(key));
}

function joinPaths(paths) {
  return path.join(...collectComponents(paths));
}

function joinMultiplePaths(paths) {
  return paths.map(joinPaths);
}

function renderPath(object, [ key, value ]) {
  const result = object;
  result[key] = joinPaths(value);
  return result;
}

function renderPaths(paths) {
  if (Array.isArray(paths)) return joinPaths(paths);
  return Object.entries(paths).reduce(renderPath, {});
}

function getPath(type) {
  const paths = PATHS[type];
  if (paths) return renderPaths(paths);
  return null;
}

function ejectConfig(type) {
  const paths = generateConfigPaths(type);
  logMessage(paths.file);
  return fs.copyFile(`${__dirname}/${paths.src}`, `./${paths.file}`)
    .then(() => { logSuccess(paths.file); })
    .catch(onError);
}

function ejectConfigs(types) {
  return Promise.all(types.map(ejectConfig));
}

function ejectComponentConfigs() {
  return ejectConfigs(['browserslist', 'stylelint', 'eslint', 'editor', 'jest', 'husky']);
}

function ejectLibraryConfigs() {
  return ejectConfigs(['browserslist', 'eslint', 'editor', 'jest', 'husky']);
}

function ejectStoreConfigs() {
  return ejectConfigs(['browserslist', 'eslint', 'editor', 'jest', 'husky']);
}

exports.getPath = getPath;
exports.ejectConfigs = ejectConfigs;
exports.ejectComponentConfigs = ejectComponentConfigs;
exports.ejectLibraryConfigs = ejectLibraryConfigs;
exports.ejectStoreConfigs = ejectStoreConfigs;
exports.generateConfigPaths = generateConfigPaths;
exports.getConfigComponent = getConfigComponent;
