import { Router } from 'react-router';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { mergeDeepRight } from 'ramda';
import rootReducer from '../reducers';
import { createStoreWithMiddleWare } from '../store';
import configureMockStore from 'redux-mock-store';

export const state = require('./state');

export const mounter = (Component, attachTo) => {
  return mount(<Component />, { attachTo });
};

export const createStore = (state = {}) => {
  return createStoreWithMiddleWare(
    rootReducer,
    mergeDeepRight(rootReducer({}, {}), state)
  );
};

export const createMockStore = (state = {}) => {
  const configured = configureMockStore([thunk]);
  return configured(state);
};

export const reduxer = (Component, props = {}, state = {}) => {
  const history = createMemoryHistory();
  return function reduxWrap() {
    return (
      <Provider store={createStore(state)}>
        <Router history={history}>
          <Component {...props} />
        </Router>
      </Provider>
    );
  };
};

export const snapshotter = wrapper => {
  return wrapper.html();
};

export const makeById = records => {
  return records.reduce((accum, record) => {
    accum[record.id] = record;
    return accum;
  }, {});
};

export const fetchImplementation = (fetch, status = 200, resolveValue = {}) => {
  fetch.mockImplementation(async () => {
    return {
      status,
      async json() {
        return resolveValue;
      }
    };
  });
};
