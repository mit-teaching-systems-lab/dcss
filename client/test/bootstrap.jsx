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
import toJson from 'enzyme-to-json';
import { prettyDOM } from '@testing-library/react';

export const state = require('./state');

export const serialize = container => {
  return prettyDOM(container, Infinity, {
    highlight: false
  });
};

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

export const reduxer = (
  Component,
  props = {},
  state = {},
  memoryHistory = {}
) => {
  const history = createMemoryHistory(memoryHistory);
  const store = createPseudoRealStore(state);
  function BootstrapWrapper() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Component {...props} />
        </Router>
      </Provider>
    );
  }

  BootstrapWrapper.history = history;
  BootstrapWrapper.store = store;

  return BootstrapWrapper;
};

export const snapshotter = wrapper => {
  try {
    const text = wrapper.text ? wrapper.text() : JSON.stringify(wrapper);

    return wrapper.html ? wrapper.html() : text;
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
  const wrapper = attachTo ? mount(rendered, { attachTo }) : mount(rendered);

  return wrapper;
};
