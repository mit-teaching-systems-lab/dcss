import { combineReducers } from 'redux';

import {
  GET_CATEGORIES_SUCCESS,
} from '@client/actions/types';

export const categories = (state = [], action) => {
  const { categories = [], type } = action;
  switch (type) {
    case GET_CATEGORIES_SUCCESS:
      return categories;
    default:
      return state;
  }
};

export default combineReducers({
  categories
});
