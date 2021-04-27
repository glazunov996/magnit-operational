import { initState, updateData, changeData, toggleData, getStateData, getState, subscribe } from 'utilities/state';

const GRAPH_INITIAL_STATE = {
  count: 0,
  highlighted: null,
  step: 0,
  shift: 0,
  status: 0,
  dynamics: 'graphDetailQuarter',
  kind: 0,
  optionWidthMax: 0,
  scroll: 0,
  scrollMax: 0
};

let graphsState;

function generateInitialState(graphsConfig, dashboard) {
  const dynamics = dashboard === 'financial' ? 3 : 0;
  return {
    ...GRAPH_INITIAL_STATE,
    mode: graphsConfig.modes[0].value,
    dynamics: graphsConfig.dynamics[dynamics].value,
  };
}

export function initGraphs(graphsConfig, dashboard) {
  const initialState = generateInitialState(graphsConfig, dashboard);
  graphsState = initState(initialState);
}

export function updateGraphs(update) {
  updateData(graphsState, update);
}

export function changeGraphs(change) {
  changeData(graphsState, change);
}

export function toggleGraphs(keys) {
  toggleData(graphsState, keys);
}

export function subscribeGraphs(key, task) {
  return subscribe(graphsState, key, task);
}

export function getGraphsData(keys) {
  return getStateData(graphsState, keys);
}

export function getGraphsState(keys) {
  return getState(graphsState, keys);
}

export function destroyGraphs() {
  graphsState = null;
}
