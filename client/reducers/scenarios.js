import {
  DELETE_SCENARIO_SUCCESS,
  GET_COHORT_SCENARIOS_SUCCESS,
  GET_RECENT_SCENARIOS_SUCCESS,
  GET_SCENARIOS_SUCCESS,
  GET_SCENARIO_SUCCESS,
  RESTORE_SCENARIO_SUCCESS,
  SET_SCENARIO,
  SET_SCENARIOS,
  UNLOCK_SCENARIO_SUCCESS
} from '@actions/types';

export const scenarios = (state = [], action) => {
  const { scenario, scenarios, type } = action;

  switch (type) {
    case GET_COHORT_SCENARIOS_SUCCESS:
    case GET_SCENARIOS_SUCCESS:
    case SET_SCENARIOS: {
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
    case UNLOCK_SCENARIO_SUCCESS:
    case RESTORE_SCENARIO_SUCCESS: {
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
    case GET_COHORT_SCENARIOS_SUCCESS:
    case GET_SCENARIOS_SUCCESS:
    case SET_SCENARIOS: {
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

export const recentScenarios = (state = [], action) => {
  const { recentScenarios, scenario, type } = action;

  switch (type) {
    case GET_RECENT_SCENARIOS_SUCCESS: {
      return recentScenarios;
    }
    case RESTORE_SCENARIO_SUCCESS:
    case GET_SCENARIO_SUCCESS: {
      const index = state.findIndex(({ id }) => id === scenario.id);

      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...scenario
        };

        return [...state];
      }

      return state;
    }
    default: {
      return state;
    }
  }
};
