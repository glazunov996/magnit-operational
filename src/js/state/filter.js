import { initState, updateData, toggleData, getStateData, getState, subscribe, subscribeAll } from 'utilities/state';

let filterState;

function generateOptionState(state, { data }) {
  const { name, pick } = data;
  return {
    ...state,
    [`${name}`]: pick,
  };
}

function generateComponentState(state, { options }) {
  return {
    ...state,
    ...options.reduce(generateOptionState, {}),
  };
}

function generateInitialState(config) {
  return config.reduce(generateComponentState, {});
}

export function initFilter(config) {
  const initialState = generateInitialState(config);
  filterState = initState(initialState);
}

export function updateFilter(update) {
  updateData(filterState, update);
}

export function toggleFilter(keys) {
  toggleData(filterState, keys);
}

export function subscribeFilter(key, task) {
  return subscribe(filterState, key, task);
}

export function subscribeFilterAll(task) {
  return subscribeAll(filterState, task);
}

export function getFilterData(keys) {
  return getStateData(filterState, keys);
}

export function getFilterState(keys) {
  return getState(filterState, keys);
}
