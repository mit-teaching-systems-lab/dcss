import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '@client/reducers';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const middleware = [thunk];

// if (process.env.NODE_ENV !== 'production' && !process.env.JEST_WORKER_ID) {
// }
middleware.push(logger);

// Previously, this was written as:
// import rootReducer from '@client/reducers';
// export default createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(...middleware))
// );

export const createStoreWithMiddleWare = composeEnhancers(
  applyMiddleware(...middleware)
)(createStore);
export default createStoreWithMiddleWare(rootReducer);
