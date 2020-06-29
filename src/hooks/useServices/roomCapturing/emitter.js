import { assign } from "./utils";

export const emitter = object => {
  let listener = {};

  function on(method, callbackFn) {
    if (!listener[method]) {
      listener[method] = [];
    }

    listener[method].push(callbackFn);
  }

  function off(method, callbackFn) {
    if (listener[method]) {
      const index = listener[method].indexOf(callbackFn);
      if (index > -1) {
        listener[method].splice(index, 1);
      }
    }
  }

  function emit(method, ...args) {
    if (listener[method]) {
      for (let callbackFn of listener[method]) {
        if (callbackFn && typeof callbackFn === "function") {
          callbackFn(...args);
        }
      }
    }
  }

  function resetEmitter() {
    listener = {};
  }

  assign(object, {
    on,
    off,
    emit,
    resetEmitter,
  });

  return object;
};

export default emitter;
