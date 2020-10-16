import { LOG_IN, LOG_OUT } from '@actions/types';

const initialState = {
  isLoggedIn: false,
  username: '',
  permissions: []
};

export default function(state = initialState, action) {
  const { login, type } = action;
  switch (type) {
    case LOG_IN: {
      return {
        ...state,
        ...login
      };
    }
    case LOG_OUT: {
      return {
        ...initialState
      };
    }
    default:
      return state;
  }
}
