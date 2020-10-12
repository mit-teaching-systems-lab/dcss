import { Router } from 'react-router';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
// import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history'
import { mergeDeepRight } from 'ramda';
import rootReducer from '../reducers';
import { createStoreWithMiddleWare } from '../store';

export const state = require('./state');

export const mounter = (Component, defaultProps = {}) => {
  return (customProps = {}) => {
    const props = {
      ...defaultProps,
      ...customProps
    };
    return mount(<Component {...props} />);
  };
};

export const createStore = (state = {}) => {
  return createStoreWithMiddleWare(rootReducer, mergeDeepRight(rootReducer({}, {}), state));
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

export const snapshot = wrapper => {
  return wrapper.html();
};
