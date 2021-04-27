const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');
const XLSX = require('xlsx');
const mxy = require('../mxy');
const metallo = require('../metallo');

/* 
  Файлы словарей в формате xlsx необходимо положить в `src/dictionaries`.
  На основе каждого файла будет создан json с аналогичным названием
  и размещен в `src/js/config/dictionaries`.

  Первый столбец исходного файла будет ключём, второй - значением.
  Остальные столбцы игнорируются.
  Строки без первой/второй ячейки игнорируются.
  Все страницы файла собираются в один json.
*/

function isXlsx(file) {
  return /.+\.xlsx$/ui.test(file);
}

function onError(error) {
  mxy.error(error);
}

function checkDirectory(where) {
  return fs.mkdir(path.dirname(where), { recursive: true });
}

function writeFile(where, what) {
  return fs.writeFile(where, what).then(() => Promise.resolve(where));
}

function tryWriteFile({ name, data }) {
  // console.log(name, data);
  const where = `${__dirname}/temp/${name}.json`;
  return checkDirectory(where)
    .then(() => writeFile(where, data))
    .catch(onError);
}

function logProcessMessage() {
  console.log(`${chalk.yellow('🖥️  processing dictionaries\n')}`);
}

function logProcessSuccess(start, request) {
  const message = request ? request.replace(',', ', ') : 'all dictionaries';
  console.log(`${chalk.yellow('🖥️  success:')} ${chalk.bgYellow(` ${chalk.black(`${message} – ${process.hrtime(start)[0]}s`)} `)}\n`);
  mxy.notify('dictionaries successfully processed', message);
}

/* Получение исходных файлов словарей */
function getInitialFile(pathName) {
  const data = XLSX.readFile(`${metallo.getPath('dictionaries').from}/${pathName}`, { type: 'buffer', encoding: 'utf-8' });
  return { name: pathName.replace('.xlsx', ''), data };
}

function findInitialFiles(items) {
  const files = items.filter(isXlsx).map(getInitialFile);
  return Promise.all(files);
}

function findInitialDictionaries() {
  return fs.readdir(metallo.getPath('dictionaries').from).then(findInitialFiles);
}
/* END Получение исходных файлов словарей */

/* Форматирование данных справочника в Json-строку */
function parseDictionaryToJson({ data, ...rest }) {
  const dictionaryJson = {};

  for (let i = 0; i < data.SheetNames.length; i++) {
    const tableData = XLSX.utils.sheet_to_json(data.Sheets[data.SheetNames[i]], { header: ['key', 'value'] });

    tableData.forEach(({key, value}) => {
      if (key && value) {
        const name = key.trim();
        const val = value.trim();

        dictionaryJson[name] = val;
      }
    })
  }

  return { ...rest, data: JSON.stringify(dictionaryJson, null, 2) }
}

function parseDictionariesToJson(dictionaries) {
  const items = dictionaries.map(parseDictionaryToJson);
  return Promise.resolve(items);
}
/* END Форматирование данных справочника в Json-строку */

/* Перемещение готовых json-файлов в рабочий каталог */
function copyJsonFile(path) {
  const paths = path.split('/');
  const fileName = paths[paths.length - 1];
  const where = `${metallo.getPath('dictionaries').include}/${fileName}`;

  return checkDirectory(where).then(() => fs.copyFile(path, where));
}

function moveJsonDictionariesToSources(paths) {
  const moved = paths.map(copyJsonFile);

  return Promise.all(moved)
}

function removeTempFolder() {
  return new Promise((resolve) => {
    rimraf(`${__dirname}/temp`, resolve);
  });
}
/* END Перемещение готовых json-файлов в рабочий каталог */

function saveJsonDictionaries(files) {
  const saves = files.map(tryWriteFile);
  return Promise.all(saves)
    .then(moveJsonDictionariesToSources)
    .then(removeTempFolder);
}

function processDictionaries() {
  const start = process.hrtime();
  logProcessMessage();

  return findInitialDictionaries()
    .then(parseDictionariesToJson)
    .then(saveJsonDictionaries)
    .then(() => logProcessSuccess(start))
    .catch(onError);
}

processDictionaries();
