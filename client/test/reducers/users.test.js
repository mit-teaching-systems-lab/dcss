import assert from 'assert';
import { state } from '../bootstrap';

import * as reducer from '../../reducers/users';
import * as types from '../../actions/types';

const initialState = [];
const initialStateById = {};

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('users', () => {
  let users;
  let usersById;

  beforeEach(() => {
    users = [
      ...original.users
    ];

    usersById = {
      ...original.usersById
    };

  });

  test('initial state', () => {
    expect(reducer.users(undefined, {})).toEqual(initialState);
    expect(reducer.users(undefined, {})).toEqual(initialState);
    expect(reducer.usersById(undefined, {})).toEqual(initialStateById);
    expect(reducer.usersById(undefined, {})).toEqual(initialStateById);
  });

  test('GET_USERS_SUCCESS', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users
    };
    expect(reducer.users(undefined, action)).toMatchSnapshot();
    expect(reducer.users(undefined, action)).toMatchSnapshot();
  });

  test('GET_USERS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users: [...users, ...users, ...users]
    };
    expect(reducer.users(undefined, action)).toMatchSnapshot();
    expect(reducer.users(undefined, action)).toMatchSnapshot();
  });

  test('GET_USERS_SUCCESS', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users
    };
    expect(reducer.usersById(undefined, action)).toMatchSnapshot();
    expect(reducer.usersById(undefined, action)).toMatchSnapshot();
  });


  test('GET_USERS_SUCCESS dedupe', () => {
    const action = {
      type: types.GET_USERS_SUCCESS,
      users: [...users, ...users, ...users]
    };
    expect(reducer.usersById(undefined, action)).toMatchSnapshot();
    expect(reducer.usersById(undefined, action)).toMatchSnapshot();
  });
});
