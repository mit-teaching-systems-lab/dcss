import { GET_CATEGORIES_SUCCESS, GET_CATEGORIES_ERROR } from './types';

export const getCategories = () => async dispatch => {
  try {
    const res = await (await fetch('/api/tags/categories')).json();

    if (res.error) {
      throw res;
    }

    const {
      categories
    } = res;

    dispatch({ type: GET_CATEGORIES_SUCCESS, categories });
    return categories;
  } catch (error) {
    dispatch({ type: GET_CATEGORIES_ERROR, error });
    return null;
  }
};
