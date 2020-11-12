import {
  DELETE_SCENARIO_SUCCESS,
  UNLOCK_SCENARIO_SUCCESS,
  GET_SCENARIO_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  SET_SCENARIO,
  SET_SCENARIOS
} from '@actions/types';

export const scenarios = (state = [], action) => {
  const { scenario, scenarios, type } = action;

  switch (type) {
    case SET_SCENARIOS:
    case GET_SCENARIOS_SUCCESS: {
      const seen = {
        /*
        scenario.id: index
         */
      };
      return [...state, ...scenarios]
        .reduce((accum, scenario) => {
          // If we've already seen this scenario, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[scenario.id];
          if (index !== undefined) {
            accum[index] = scenario;
          } else {
            seen[scenario.id] = accum.length;
            accum.push(scenario);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    case SET_SCENARIO:
    case GET_SCENARIO_SUCCESS:
    case DELETE_SCENARIO_SUCCESS:
    case UNLOCK_SCENARIO_SUCCESS: {
      if (!scenario || !scenario.id) {
        return [...state];
      }

      const index = state.findIndex(({ id }) => id === scenario.id);

      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...scenario
        };
      } else {
        state.push(scenario);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const scenariosById = (state = {}, action) => {
  const { scenario, scenarios, type } = action;

  switch (type) {
    case SET_SCENARIOS:
    case GET_SCENARIOS_SUCCESS: {
      const scenariosById = scenarios.reduce((accum, scenario) => {
        accum[scenario.id] = scenario;
        return accum;
      }, {});
      return {
        ...state,
        ...scenariosById
      };
    }
    case SET_SCENARIO:
    case DELETE_SCENARIO_SUCCESS:
    case UNLOCK_SCENARIO_SUCCESS:
    case GET_SCENARIO_SUCCESS: {
      if (!scenario || !scenario.id) {
        return {
          ...state
        };
      }
      return {
        ...state,
        [scenario.id]: {
          ...(state[scenario.id] || {}),
          ...scenario
        }
      };
    }
    default:
      return state;
  }
};
