import { initState, updateData, getStateData, getState, subscribe, subscribeAll } from 'utilities/state';

const EXPORT_INITIAL_STATE = {
  downloading: 0,
  slices: [],
  slicesValue: '00000000000',
  slicesFilter: {},
  indicators: [],
  expressionsValue: '00000000000',
};

let exportState;

function generateInitialState() {
  return {
    ...EXPORT_INITIAL_STATE,
  };
}

export function initExport() {
  const initialState = generateInitialState();
  exportState = initState(initialState);
}

export function resetExport() {
  updateData(exportState, EXPORT_INITIAL_STATE);
}

export function updateExport(update) {
  updateData(exportState, update);
}

export function subscribeExport(key, task) {
  return subscribe(exportState, key, task);
}

export function subscribeExportAll(task) {
  return subscribeAll(exportState, task);
}

export function getExportData(keys) {
  return getStateData(exportState, keys);
}

export function getExportState(keys) {
  return getState(exportState, keys);
}
