import { combineReducers } from 'redux';

import {
  GET_CATEGORIES_SUCCESS,
  GET_LABELS_SUCCESS,
  // SET_LABELS_SUCCESS,
  SET_LABELS_IN_USE_SUCCESS
} from '@actions/types';

export const categories = (state = [], action) => {
  const { categories = [], type } = action;
  switch (type) {
    case GET_CATEGORIES_SUCCESS:
      return categories;
    default:
      return state;
  }
};

export const labels = (state = [], action) => {
  const { labels, type } = action;
  switch (type) {
    case GET_LABELS_SUCCESS: {
      return labels.map(({ id: key, name: value, count = null }) => ({
        key,
        text: value,
        value,
        count
      }));
    }
    default:
      return state;
  }
};

export const labelsInUse = (state = [], action) => {
  const { labelsInUse, type } = action;

  if (!labelsInUse) {
    return state;
  }

  switch (type) {
    case SET_LABELS_IN_USE_SUCCESS: {
      return [...labelsInUse];
    }
    default:
      return state;
  }
};

export default combineReducers({
  categories,
  labels,
  labelsInUse
});
