import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from '@client/routes';
import store from '@client/store';

const rootEl = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    rootEl
);
