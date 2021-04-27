import { initState, updateData, getStateData, getState, subscribe } from 'utilities/state';

let userState;

export function initUser(loginData) {
  userState = initState({ ...loginData });
}

export function updateUser(update) {
  updateData(userState, update);
}

export function subscribeUser(key, task) {
  return subscribe(userState, key, task);
}

export function getUserData(keys) {
  return getStateData(userState, keys);
}

export function getUserState(keys) {
  return getState(userState, keys);
}
