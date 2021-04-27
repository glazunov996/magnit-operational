import { CONFIG } from 'utilities/config';
import { initState, updateData, getStateData, getState, subscribe } from 'utilities/state';

const DASHBOARD_INITIAL_STATE = {
  units: 0,
  yoyMode: false,
};

let dashboardState;

function generateDashboardInitialDatePrecision(dashboard) {
  if (dashboard === 'financial') return 2;
  return 0;
}

function generateDashboardInitialColumnPrecision(dashboard) {
  if (dashboard === 'financial') return 3;
  return 0;
}

function generateDates(dashboard) {
  const timestamp = CONFIG.dateStart;
  const date = new Date(timestamp);
  const timestampPoP = date.setFullYear(date.getFullYear() - 1);
  return {
    date: timestamp,
    datePoP: timestampPoP < CONFIG.dateMin ? CONFIG.dateMin : timestampPoP,
    datePrecision: generateDashboardInitialDatePrecision(dashboard),
    columnPrecision: generateDashboardInitialColumnPrecision(dashboard),
  };
}

function generateInititalState(dashboard) {
  return {
    ...generateDates(dashboard),
    ...DASHBOARD_INITIAL_STATE,
  };
}

export function initDashboard(dashboard) {
  if (!!dashboardState)
    return;
  dashboardState = initState(generateInititalState(dashboard));
}

export function updateDashboard(update) {
  updateData(dashboardState, update);
}

export function subscribeDashboard(key, task) {
  return subscribe(dashboardState, key, task);
}

export function getDashboardData(keys) {
  return getStateData(dashboardState, keys);
}

export function getDashboardState(keys) {
  return getState(dashboardState, keys);
}
