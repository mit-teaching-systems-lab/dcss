import React from 'react';
import { Router } from 'react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { mergeDeepRight } from 'ramda';
import rootReducer from '../reducers';
import { createStoreWithMiddleWare } from '../store';
import configureMockStore from 'redux-mock-store';
import toJson from 'enzyme-to-json'

export const state = require('./state');


export const createPseudoRealStore = (state = {}) => {
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
  const store = createPseudoRealStore(state);
  return function BootstrapWrapper() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Component {...props} />
        </Router>
      </Provider>
    );
  };
};

export const snapshotter = wrapper => {
  try {
    return wrapper.html
      ? wrapper.html()
      : wrapper.text
        ? wrapper.text()
        : JSON.stringify(wrapper);
  } catch (error) {
    try {
      return toJson(wrapper);
    } catch (error) {
      void error;
    }
  }
  return '';
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

export const mounter = (Component, attachTo) => {
  const rendered = <Component />;
  const wrapper = attachTo
    ? mount(rendered, { attachTo })
    : mount(rendered);

  return wrapper;
};
