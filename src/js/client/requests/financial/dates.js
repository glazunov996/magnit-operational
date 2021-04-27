import { default as datesRequestConfig } from 'configs/requests/financial/dates.json';

function processDateData(rows) {
  return rows.map(row => ({
    label: row.qText,
    year: parseInt(row.qText.slice(0, 4), 10),
    month: parseInt(row.qText.slice(-2), 10),
    picked: row.qState === 'S',
    disabled: row.qState === 'X',
  }));
}

function qlikRequestDateData(key, app) {
  return new Promise((resolve) => {
    const request = app.field('MONTH_ID', key).getData().OnData;
    request.bind(function onDateData() {
      request.unbind(onDateData);
      const dateData = processDateData(this.rows);
      resolve(dateData);
    });
  });
}

function qlikRequestDatesData(app) {
  return Promise.all(datesRequestConfig.map(key => qlikRequestDateData(key, app)));
}

export async function qlikRequestDates(app) {
  const data = await qlikRequestDatesData(app);
  return data;
}

function generateValues(year, months) {
  const values = months.map(month => parseInt(`${year}${`${month}`.padStart(2, 0)}`, 10));
  return values;
}

function generateQuarterMonths(month) {
  const startMonth = (3 * (Math.ceil(month / 3) - 1)) + 1;
  const months = [startMonth];
  for (let shift = 1; shift <= 2; shift += 1) months.push(startMonth + shift);
  return months;
}

function generateYearMonths() {
  const months = [];
  for (let month = 1; month <= 12; month += 1) months.push(month);
  return months;
}

function generateDateValues(timestamp, precision) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (precision === 1) return generateValues(year, [month]);
  if (precision === 2) return generateValues(year, generateQuarterMonths(month));
  return generateValues(year, generateYearMonths());
}

function qlikRequestDateUpdate(key, index, app, values) {
  const field = app.field('MONTH_ID', key);
  return field.clear()
    .then(() => field.selectValues(values[index], true, true));
}

export function qlikRequestDatesUpdate(app, date, datePoP, columnPrecision) {
  const dateValues = generateDateValues(date, columnPrecision);
  const datePoPValues = generateDateValues(datePoP, columnPrecision);
  return Promise.all(datesRequestConfig.map((key, index) => qlikRequestDateUpdate(key, index, app, [dateValues, datePoPValues])));
}
