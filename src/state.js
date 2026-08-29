import { cloneInitialState } from './data.js';

export function createStore() {
  let state = cloneInitialState();
  const listeners = new Set();

  return {
    getState: () => state,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    setState(updater) {
      state = updater(state);
      listeners.forEach((listener) => listener(state));
    },
    reset() {
      state = cloneInitialState();
      listeners.forEach((listener) => listener(state));
    }
  };
}
