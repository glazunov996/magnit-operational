import { derived } from 'svelte/store';
import { initState, updateData, toggleData, getStateData, getState, subscribe } from 'utilities/state';

let comparisonIndicatorsState;
let comparisonIndicatorKeys;
let activeComparisonIndicatorsState;

function generateComponentState(state, { id }) {
  return {
    ...state,
    [id]: true,
  };
}

function generateInitialState(config) {
  return config.reduce(generateComponentState, {});
}

function initActiveComparisonIndicators() {
  const stores = Object.values(getComparisonIndicatorsState());
  activeComparisonIndicatorsState = derived(stores, updateActive);
}

export function initComparisonIndicators(config) {
  const initialState = generateInitialState(config);
  comparisonIndicatorsState = initState(initialState);
  comparisonIndicatorKeys = Object.keys(comparisonIndicatorsState);
  initActiveComparisonIndicators();
}

export function updateComparisonIndicators(update) {
  updateData(comparisonIndicatorsState, update);
}

export function toggleComparisonIndicators(keys) {
  toggleData(comparisonIndicatorsState, keys);
}

export function subscribeComparisonIndicators(key, task) {
  return subscribe(comparisonIndicatorsState, key, task);
}

export function getComparisonIndicatorsData(keys) {
  return getStateData(comparisonIndicatorsState, keys);
}

export function getComparisonIndicatorsState(keys) {
  return getState(comparisonIndicatorsState, keys);
}

function updateActiveKey(active, value, index) {
  if (value) active.push(comparisonIndicatorKeys[index]);
  return active;
}

function updateActive(update) {
  return update.reduce(updateActiveKey, []);
}

export function getActiveComparisonIndicatorsState() {
  return activeComparisonIndicatorsState;
}

export function destroyComparisons() {
  comparisonIndicatorsState = null;
  comparisonIndicatorKeys = null;
  activeComparisonIndicatorsState = null;
}
