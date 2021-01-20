import { SET_FILTER_SCENARIOS_IN_USE } from './types';

export let setFilterScenariosInUse = scenariosInUse => dispatch => {
  dispatch({ type: SET_FILTER_SCENARIOS_IN_USE, scenariosInUse });
};
