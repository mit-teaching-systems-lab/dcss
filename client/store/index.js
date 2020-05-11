import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
        : compose;

const middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
}

import rootReducer from '@client/reducers';
export default createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);
