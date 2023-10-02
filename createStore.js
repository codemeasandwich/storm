
import { auto, reducers } from './index.js';

// applyMiddleware implementation
const applyMiddleware = (...middlewares) => (createStore) => (reducer) => {
  const store = createStore(reducer);
  let dispatch = (action) => {
    throw new Error(
      'Dispatching while constructing your middleware is not allowed. ' +
      'Other middleware would not be applied to this dispatch.'
    );
  };
  const middlewareAPI = {
    getState: store.getState,
    dispatch: (action) => dispatch(action),
  };
  const chain = middlewares.map((middleware) => middleware(middlewareAPI));
  dispatch = compose(...chain)(store.dispatch);
  return { ...store, dispatch };
};

// combineReducers implementation
const combineReducersPoly = (reducers) => {
  const keys = Object.keys(reducers)
  return (state = {}, action) => {
    return keys.reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};

function combineReducersWithLoadingMeta(reducers, combineReducers) {
  if (!combineReducers) {
    combineReducers = combineReducersPoly
  }
  const s_a = combineReducers(reducers)

  return (state, action) => {
    //console.log(321)
    const __AUTO_loadingAsync_proto_ = state && state.loading ? Object.assign({}, state.loading) : {}
    const __proto_ = {}
    Object.defineProperty(__proto_, "__AUTO_loadingAsync_proto_", { enumerable: false, writable: false, value: __AUTO_loadingAsync_proto_ })
    const withProtoLoading = Object.create(__proto_)
    const actionWithInbedded_loadingAsync = Object.assign(withProtoLoading, action)

    const nextState = s_a(state, actionWithInbedded_loadingAsync)

    if (nextState !== state) {
      return Object.assign(Object.create({ loading: __AUTO_loadingAsync_proto_ }), nextState)
    }
    return nextState
  }
}




// createStore implementation
const createStore = (reducer, enhancer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
    return action;
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  dispatch({ type: "@@redux/INIT" })
  return { getState, dispatch, subscribe };
};

// compose implementation
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
};

export default (webpackModules) => {
  const storeFiles = webpackModules.keys().filter(t => t.startsWith('.'))
  const setDispatch = auto(webpackModules, storeFiles)

  const store = createStore(combineReducersWithLoadingMeta(reducers),
    applyMiddleware(setDispatch));
  return store
};
