import {
  GET_CATEGORIES_ERROR,
  GET_CATEGORIES_SUCCESS,
  GET_LABELS_ERROR,
  GET_LABELS_SUCCESS,
  CREATE_TAG_ERROR,
  CREATE_TAG_SUCCESS
} from './types';

export let getCategories = () => async dispatch => {
  try {
    const res = await (await fetch('/api/tags/categories')).json();

    if (res.error) {
      throw res;
    }

    const { categories } = res;

    dispatch({ type: GET_CATEGORIES_SUCCESS, categories });
    return categories;
  } catch (error) {
    dispatch({ type: GET_CATEGORIES_ERROR, error });
    return null;
  }
};

export let getLabels = () => async dispatch => {
  try {
    const res = await (await fetch('/api/tags/labels')).json();

    if (res.error) {
      throw res;
    }

    const { labels } = res;

    dispatch({ type: GET_LABELS_SUCCESS, labels });
    return labels;
  } catch (error) {
    dispatch({ type: GET_LABELS_ERROR, error });
    return null;
  }
};

/*
export let createTag = params => async dispatch => {

  // params {
  //   name
  //   tag_type_id
  //   (scenario_id)
  // }

  try {
    const res = await (
      await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })
    ).json();

    if (res.error) {
      throw res;
    }
    const { tag } = res;
    dispatch({ type: CREATE_TAG_SUCCESS, tag });
    return tag;
  } catch (error) {
    dispatch({ type: CREATE_TAG_ERROR, error });
    return null;
  }
};
*/
