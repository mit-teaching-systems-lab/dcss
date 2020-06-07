import {
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_ERROR,
} from './types';

export const getCategories = () => async dispatch => {
  try {
    const categories = await (await fetch('/api/tags/categories')).json();
    dispatch({ type: GET_CATEGORIES_SUCCESS, categories });
    return categories;
  } catch (error) {
    const { message, status, stack } = error;
    dispatch({ type: GET_CATEGORIES_ERROR, status, message, stack });
  }
};
