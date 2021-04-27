import { derived } from 'svelte/store';
import { initState, updateData, toggleData, getStateData, getState, subscribe } from 'utilities/state';

let indicatorsState;
let indicatorKeys;
let activeIndicatorsState;

function generateComponentState(state, { id, status }) {
  return {
    ...state,
    [id]: status,
  };
}

function generateInitialState(config) {
  return config
    .reduce((flat, group) => [...flat, ...group.indicators], [])
    .reduce(generateComponentState, {});
}

function initActiveIndicators() {
  const stores = Object.values(getIndicatorsState());
  activeIndicatorsState = derived(stores, updateActive);
}

export function initIndicators(config) {
  if (!!indicatorsState)
    return;
  const initialState = generateInitialState(config);
  indicatorsState = initState(initialState);
  indicatorKeys = Object.keys(indicatorsState);
  initActiveIndicators();
}

export function updateIndicators(update) {
  updateData(indicatorsState, update);
}

export function toggleIndicators(keys) {
  toggleData(indicatorsState, keys);
}

export function subscribeIndicators(key, task) {
  return subscribe(indicatorsState, key, task);
}

export function getIndicatorsData(keys) {
  return getStateData(indicatorsState, keys);
}

export function getIndicatorsState(keys) {
  return getState(indicatorsState, keys);
}

function updateActiveKey(active, value, index) {
  if (value) active.push(indicatorKeys[index]);
  return active;
}

function updateActive(update) {
  return update.reduce(updateActiveKey, []);
}

export function getActiveIndicatorsState() {
  return activeIndicatorsState;
}
