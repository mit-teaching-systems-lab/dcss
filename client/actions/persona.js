import {
  GET_PERSONA_ERROR,
  GET_PERSONA_SUCCESS,
  // GET_PERSONAS_COUNT_ERROR,
  // GET_PERSONAS_COUNT_SUCCESS,
  // GET_PERSONAS_ERROR,
  GET_PERSONAS_SUCCESS,
  SET_PERSONA_ERROR,
  SET_PERSONA_SUCCESS,
  // GET_SCENARIO_PERSONAS_ERROR,
  // GET_SCENARIO_PERSONAS_SUCCESS,
  SET_SCENARIO
  // SET_SCENARIO_PERSONAS_ERROR,
  // SET_SCENARIO_PERSONAS_SUCCESS
} from './types';

export let getPersona = id => async dispatch => {
  try {
    const res = await (await fetch(`/api/personas/${id}`)).json();

    if (res.error) {
      throw res;
    }
    const { persona } = res;

    dispatch({ type: GET_PERSONA_SUCCESS, persona });
    return persona;
  } catch (error) {
    dispatch({ type: GET_PERSONA_ERROR, error });
    return null;
  }
};

export let setPersona = (id, params) => async (dispatch, getState) => {
  try {
    if (Object.values(params).length) {
      const body = JSON.stringify(params);
      const res = await (await fetch(`/api/personas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }

      const { persona } = res;
      const { scenario } = getState();

      dispatch({ type: SET_PERSONA_SUCCESS, persona });

      scenario.personas.forEach((sp, index) => {
        if (sp.id === persona.id) {
          scenario.personas[index] = persona;
        }
      });

      dispatch({ type: SET_SCENARIO, scenario });

      return persona;
    }
    return null;
  } catch (error) {
    dispatch({ type: SET_PERSONA_ERROR, error });
    return null;
  }
};

export let createPersona = params => async dispatch => {
  try {
    if (Object.values(params).length) {
      const { name, description, color } = params;
      const body = JSON.stringify({
        name,
        description,
        color
      });
      const res = await (await fetch(`/api/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body
      })).json();

      if (res.error) {
        throw res;
      }
      const { persona } = res;
      dispatch({ type: GET_PERSONA_SUCCESS, persona });
      return persona;
    }
    return null;
  } catch (error) {
    dispatch({ type: GET_PERSONA_ERROR, error });
    return null;
  }
};

export let setPersonas = personas => async dispatch => {
  dispatch({
    type: SET_PERSONAS_SUCCESS,
    personas
  });
};

export let getPersonas = () => async dispatch => {
  try {
    const res = await (await fetch('/api/personas')).json();

    if (res.error) {
      throw res;
    }

    const { personas = [] } = res;
    dispatch({ type: GET_PERSONAS_SUCCESS, personas });
    return personas;
  } catch (error) {
    dispatch({ type: GET_PERSONAS_ERROR, error });
    return null;
  }
};

export let linkPersonaToScenario = (persona_id, scenario_id) => async (
  dispatch,
  getState
) => {
  try {
    const res = await (await fetch(
      `/api/personas/link/${persona_id}/scenario/${scenario_id}`
    )).json();

    if (res.error) {
      throw res;
    }

    const { personas } = res;
    const { scenario } = getState();

    Object.assign(scenario, { personas });

    dispatch({ type: SET_SCENARIO, scenario });

    return scenario;
  } catch (error) {
    dispatch({ type: SET_SCENARIO, error });
    return null;
  }
};

export let unlinkPersonaFromScenario = (persona_id, scenario_id) => async (
  dispatch,
  getState
) => {
  try {
    const res = await (await fetch(
      `/api/personas/unlink/${persona_id}/scenario/${scenario_id}`
    )).json();

    if (res.error) {
      throw res;
    }

    const { personas } = res;
    const { scenario } = getState();

    Object.assign(scenario, { personas });

    dispatch({ type: SET_SCENARIO, scenario });

    return scenario;
  } catch (error) {
    dispatch({ type: SET_SCENARIO, error });
    return null;
  }
};

// export let getPersonasByScenarioId = id => async dispatch => {
//   try {
//     const res = await (await fetch(`/api/personas/scenario/${id}`)).json();
//     if (res.error) {
//       throw res;
//     }
//     const { personas } = res;

//     dispatch({ type: SET_SCENARIO_PERSONAS_SUCCESS, personas });

//     return personas;
//   } catch (error) {
//     dispatch({ type: SET_SCENARIO_PERSONAS_ERROR, error });
//     return null;
//   }
// };
