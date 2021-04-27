import { default as filterRequestConfig } from 'configs/requests/financial/filter.json';

const LFL_START = 2019;

let lflOptions;
let lflAttempt = 0;

function hasLFL(entries) {
  return entries.some(([ key ]) => key === 'LFL' || key === 'NonLFL');
}

function processLFL(data) {
  const lflDataIndex = data.findIndex(option => option.key === 'LFL');
  const result = data[lflDataIndex].data.reduce((options, option) => {
    const { year } = option;
    option.data.forEach((dataOption) => {
      const index = dataOption.qText === 'LFL' ? 0 : 1;
      options[index].data.push({
        label: year,
        value: year,
        picked: dataOption.qState === 'S',
        disabled: dataOption.qState === 'X',
      });
    });
    return options;
  }, [{ key: 'LFL', data: [] }, { key: 'NonLFL', data: [] }]);
  data.splice(lflDataIndex, 1);
  data.push(...result);
  lflOptions = result[0].data.map(option => option.value);
  lflAttempt = 0;
  return result;
}

function processFilterElementRowsData(key, rows) {
  return {
    key,
    data: rows.map(row => ({
      label: row.qText,
      value: row.qText,
      picked: row.qState === 'S',
      disabled: row.qState === 'X',
    })),
  };
}

function qlikRequestFilterLFLState(app, resolve, object) {
  const result = object;
  const key = `LFL${LFL_START + lflAttempt}`;
  const request = app.field(key).getData().OnData;
  request.bind(function onFilterElementData() {
    request.unbind(onFilterElementData);
    if (this.rows.length === 0) {
      resolve(result);
    } else {
      result.data.push({ year: LFL_START + lflAttempt, data: this.rows });
      lflAttempt += 1;
      qlikRequestFilterLFLState(app, resolve, result);
    }
  });
}

function qlikRequestFilterElementState(key, app) {
  if (key === 'LFL') {
    return new Promise((resolve) => {
      const result = { key: 'LFL', data: [] };
      qlikRequestFilterLFLState(app, resolve, result);
    });
  }
  return new Promise((resolve) => {
    const request = app.field(key).getData().OnData;
    request.bind(function onFilterElementData() {
      request.unbind(onFilterElementData);
      const filterElementData = processFilterElementRowsData(key, this.rows);
      resolve(filterElementData);
      request.close();
    });
  });
}

function qlikRequestFilterStateData(app) {
  return Promise.all(filterRequestConfig.map(key => qlikRequestFilterElementState(key, app)));
}

export async function qlikRequestFilterState(app) {
  const data = await qlikRequestFilterStateData(app);
  processLFL(data);
  return data;
}

export function qlikRequestFilterUpdate(promise, key, value, app) {
  return promise.then(() => (
    new Promise((resolve) => {
      const field = app.field(key);
      if (Array.isArray(value) && value.length > 0) {
        field.clear()
          .then(() => field.selectValues(value, true, true))
          .then(resolve);
      } else if (value && !Array.isArray(value)) {
        field.clear()
          .then(() => field.selectValues([value], true, true))
          .then(resolve);
      } else {
        field.clear()
          .then(resolve);
      }
    })
  ));
}

function adjustLFLConditions(entries) {
  const lflIndex = entries.findIndex(([ key ]) => key === 'LFL');
  const [ [ , lflData ] ] = entries.splice(lflIndex, 1);
  const nonLFLIndex = entries.findIndex(([ key ]) => key === 'NonLFL');
  const [ [ , nonLFLData ] ] = entries.splice(nonLFLIndex, 1);
  const lflFiltersData = lflOptions.map((year) => {
    const options = [];
    if (lflData.includes(year)) options.push('LFL');
    if (nonLFLData.includes(year)) options.push('non LFL');
    return [`LFL${year}`, options];
  });
  if (lflFiltersData.length > 0) entries.push(...lflFiltersData);
}

export function qlikRequestFiltersUpdate(app, conditions) {
  const entries = Object.entries(conditions);
  if (hasLFL(entries)) adjustLFLConditions(entries);
  return entries.reduce((promise, [ key, value ]) => qlikRequestFilterUpdate(promise, key, value, app), Promise.resolve());
}
