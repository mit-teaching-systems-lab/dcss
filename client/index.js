import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from '@client/routes';
import store from '@client/store';

import Session from '@client/util/session';

document.title = process.env.DCSS_BRAND_NAME_TITLE || 'Teacher Moments';

Session.timeout();

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('root')
);
