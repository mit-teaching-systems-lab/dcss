import { LOG_IN, LOG_OUT } from '@client/actions/types';

const initialState = {
  isLoggedIn: false,
  username: '',
  permissions: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOG_IN:
    case LOG_OUT: {
      return {
        ...state,
        ...action.payload
      };
    }
    default:
      return state;
  }
}
