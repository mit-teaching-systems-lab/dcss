import {
  GET_PERSONA_SUCCESS,
  SET_PERSONA_SUCCESS,
  GET_PERSONAS_SUCCESS
} from '@actions/types';
import { personaInitialState } from './initial-states';

export const persona = (state = personaInitialState, action) => {
  const { persona, type } = action;
  switch (type) {
    case GET_PERSONA_SUCCESS:
    case SET_PERSONA_SUCCESS: {
      return {
        ...state,
        ...persona
      };
    }
    default:
      return state;
  }
};

export const personas = (state = [], action) => {
  const { persona, personas, type } = action;
  switch (type) {
    case GET_PERSONA_SUCCESS:
    case SET_PERSONA_SUCCESS: {
      const index = state.findIndex(({ id }) => id === persona.id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...persona
        };
      } else {
        state.push(persona);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    case GET_PERSONAS_SUCCESS: {
      const seen = {
        /*
        persona.id: index
         */
      };
      return [...state, ...personas]
        .reduce((accum, persona) => {
          // If we've already seen this persona, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[persona.id];
          if (index !== undefined) {
            accum[index] = persona;
          } else {
            seen[persona.id] = accum.length;
            accum.push(persona);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const personasById = (state = {}, action) => {
  const { persona, personas, type } = action;
  switch (type) {
    case GET_PERSONA_SUCCESS:
    case SET_PERSONA_SUCCESS: {
      return {
        ...state,
        [persona.id]: {
          ...persona
        }
      };
    }
    case GET_PERSONAS_SUCCESS: {
      const personasById = personas.reduce((accum, persona) => {
        accum[persona.id] = persona;
        return accum;
      }, {});
      return {
        ...state,
        ...personasById
      };
    }
    default:
      return state;
  }
};
