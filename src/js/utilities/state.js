import { writable, get } from 'svelte/store';

function isMultiple(keys) {
  return Array.isArray(keys);
}

function isSingleStore(stores) {
  return typeof stores.update === 'function';
}

function collectAsKey(object, key, store, getter) {
  const result = object;
  if (store[key]) result[key] = getter(store, key);
  return result;
}

function generateCollectorWidthStore(store, collector) {
  return (result, key) => collector(result, key, store);
}

function getMultipleKeysFromStore(store, keys, collector) {
  const collectorWithStore = generateCollectorWidthStore(store, collector);
  return keys.reduce(collectorWithStore, {});
}

function getKeysFromStore(store, request, collector, getter) {
  const keys = request || Object.keys(store);
  if (isMultiple(keys)) return getMultipleKeysFromStore(store, keys, collector, getter);
  return getter(store, keys);
}

function getSvelteStoreData(store, key) {
  if (store && store[key]) return get(store[key]);
  return null;
}

function collectSvelteStoreData(object, key, store) {
  return collectAsKey(object, key, store, getSvelteStoreData);
}

export function getStateData(state, keys) {
  return getKeysFromStore(state, keys, collectSvelteStoreData, getSvelteStoreData);
}

function getSvelteStore(store, key) {
  return store[key];
}

function collectSvelteStore(object, key, store) {
  return collectAsKey(object, key, store, getSvelteStore);
}

export function getState(state, keys) {
  return getKeysFromStore(state, keys, collectSvelteStore, getSvelteStore);
}

function updateSvelteStore(key, value, store) {
  const svelteStore = getSvelteStore(store, key);
  if (svelteStore) svelteStore.set(value);
  else initSvelteStore(store, key, value);
}

export function updateData(store, update) {
  Object.entries(update).forEach(([ key, value ]) => { updateSvelteStore(key, value, store); });
}

function changeSvelteStore(key, change, store) {
  const svelteStore = getSvelteStore(store, key);
  if (svelteStore) svelteStore.update(prev => prev + change);
  else initSvelteStore(store, key, change);
}

export function changeData(store, update) {
  Object.entries(update).forEach(([ key, change ]) => { changeSvelteStore(key, change, store); });
}

function toggleSvelteStore(store) {
  store.update(prev => !prev);
}

export function toggleData(store, keys) {
  const state = getState(store, keys);
  if (state) {
    if (isSingleStore(state)) toggleSvelteStore(state);
    else Object.values(state).forEach(toggleSvelteStore);
  }
}

function subscribeWithKey(key, store, task) {
  return store.subscribe(update => task(key, update));
}

export function subscribeAll(store, task) {
  return Object.entries(store).map(([key, svelteStore]) => subscribeWithKey(key, svelteStore, task));
}

export function subscribe(store, key, task) {
  const svelteStore = getSvelteStore(store, key);
  if (svelteStore) return svelteStore.subscribe(task);
  return null;
}

function initSvelteStore(object, key, value) {
  const result = object;
  result[key] = writable(value);
  return result;
}

export function addSvelteStore(object, addition) {
  const [[ key, value ]] = Object.entries(addition);
  initSvelteStore(object, key, value);
  return value;
}

export function initState(options) {
  return Object.entries(options).reduce((result, [ key, value ]) => initSvelteStore(result, key, value), {});
}
