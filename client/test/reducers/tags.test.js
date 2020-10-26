import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/tags';
import * as types from '../../actions/types';

const initialState = [];
const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('categories', () => {
  let categories;

  beforeEach(() => {
    categories = [
      1, 2, 3
    ];
  });

  test('initial state', () => {
    expect(reducer.categories(undefined, {})).toEqual(initialState);
    expect(reducer.categories(undefined, {})).toEqual(initialState);
  });

  test('GET_CATEGORIES_SUCCESS', () => {
    const action = {
      type: types.GET_CATEGORIES_SUCCESS,
      categories
    };
    expect(reducer.categories(undefined, action)).toMatchSnapshot();
    expect(reducer.categories(undefined, action)).toMatchSnapshot();
  });

  test('GET_CATEGORIES_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_CATEGORIES_SUCCESS,
      categories: [...categories, ...categories, ...categories]
    };
    expect(reducer.categories(undefined, action)).toMatchSnapshot();
    expect(reducer.categories(undefined, action)).toMatchSnapshot();
  });
});
