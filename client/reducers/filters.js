import { combineReducers } from 'redux';
import { SET_FILTER_SCENARIOS_IN_USE } from '@actions/types';

export const scenariosInUse = (state = [], action) => {
  const { scenariosInUse, type } = action;

  if (!scenariosInUse) {
    return state;
  }

  switch (type) {
    case SET_FILTER_SCENARIOS_IN_USE: {
      return [...scenariosInUse];
    }
    default:
      return state;
  }
};

export default combineReducers({
  scenariosInUse
});
