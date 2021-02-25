import {
  GET_AGENT_SUCCESS,
  SET_AGENT_SUCCESS,
  GET_AGENTS_SUCCESS
} from '@actions/types';
import { agentInitialState } from './initial-states';

export const agent = (state = agentInitialState, action) => {
  const { agent, type } = action;
  switch (type) {
    case GET_AGENT_SUCCESS:
    case SET_AGENT_SUCCESS: {
      return {
        ...state,
        ...agent
      };
    }
    default:
      return state;
  }
};

export const agents = (state = [], action) => {
  const { agent, agents, type } = action;
  switch (type) {
    case GET_AGENT_SUCCESS:
    case SET_AGENT_SUCCESS: {
      const index = state.findIndex(({ id }) => id === agent.id);
      if (index !== -1) {
        state[index] = {
          ...state[index],
          ...agent
        };
      } else {
        state.push(agent);
      }
      return [...state].sort((a, b) => a.id < b.id);
    }
    case GET_AGENTS_SUCCESS: {
      const seen = {
        /*
        agent.id: index
         */
      };
      return [...state, ...agents]
        .reduce((accum, agent) => {
          // If we've already seen this agent, then it was already
          // in "state" and we should replace it with the newer version.
          const index = seen[agent.id];
          if (index !== undefined) {
            accum[index] = agent;
          } else {
            seen[agent.id] = accum.length;
            accum.push(agent);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const agentsById = (state = {}, action) => {
  const { agent, agents, type } = action;
  switch (type) {
    case GET_AGENT_SUCCESS:
    case SET_AGENT_SUCCESS: {
      return {
        ...state,
        [agent.id]: {
          ...agent
        }
      };
    }
    case GET_AGENTS_SUCCESS: {
      const agentsById = agents.reduce((accum, agent) => {
        accum[agent.id] = agent;
        return accum;
      }, {});
      return {
        ...state,
        ...agentsById
      };
    }
    default:
      return state;
  }
};
