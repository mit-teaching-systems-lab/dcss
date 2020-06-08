import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from '@client/routes';
import store from '@client/store';

import Storage from '@utils/Storage';

document.title = process.env.DCSS_BRAND_NAME_TITLE || 'Teacher Moments';

if (!Storage.get('app/inbound')) {
  Storage.set('app/inbound', location.pathname);
}

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);
