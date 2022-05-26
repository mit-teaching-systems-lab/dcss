import { BRAND_NAME } from './util/constants';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from '@client/routes';
import store from '@client/store';

document.title = BRAND_NAME;

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);
