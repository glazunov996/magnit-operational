/* eslint no-new: 'off' */

import { initUI, updateUI } from 'state/ui';
import { updateConfig } from 'utilities/config';
import { requestMeta } from 'utilities/meta';
import { initFormatters } from 'utilities/formatters';
import App from 'components/App.svelte';

function calcualteMinDate([ dates ]) {
  const date = dates[0];
  return Date.UTC(date.year, (date.month - 1), date.day);
}

function calculateMinDateNumber([ dates ]) {
  return dates[0].number;
}

function calcualteMaxDate([ dates ]) {
  const date = dates[dates.length - 1];
  return Date.UTC(date.year, (date.month - 1), date.day);
}

function calculateStartDate([ dates ], dateMax) {
  const picked = dates
    .slice()
    .reverse()
    .find(date => date.picked);
  if (picked) return Date.UTC(picked.year, (picked.month - 1), picked.day);
  const exist = dates
    .slice()
    .reverse()
    .find(date => date.dateDataExist);
  if (exist) return Date.UTC(exist.year, (exist.month - 1), exist.day);
  return dateMax;
}

function initApp() {
  initFormatters();
  initUI();
}

function mountApp() {
  window.removeEventListener('proxyready', mountApp);
  initApp();
  new App({ target: document.body });
  requestMeta()
    .then(startApp);
}

function startApp([ templates, dates ]) {
  console.log("START APP", dates)
  const dateMin = calcualteMinDate(dates);
  const dateMax = calcualteMaxDate(dates);
  const dateStart = calculateStartDate(dates, dateMax);
  updateConfig({ dateMin, dateMax, dateStart, dates });
  updateUI({ templates, initialized: true });
}

window.addEventListener('proxyready', mountApp);
