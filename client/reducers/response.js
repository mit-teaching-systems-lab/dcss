import {
  GET_RESPONSE_SUCCESS,
  GET_RESPONSES_SUCCESS,
  SET_RESPONSE_SUCCESS,
  SET_RESPONSES_SUCCESS
} from '@actions/types';

const initialState = {};

export const response = (state = initialState, action) => {
  const { response = {}, type } = action;

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS: {
      return {
        ...response,
        // The actual response object that we want is here.
        ...(response.response || {})
      };
    }
    default:
      return state;
  }
};

export const responses = (state = [], action) => {
  const { response = {}, responses = [], type } = action;
  const data = {
    ...response
  };

  // There must be an actual property called "response".
  // This needs to be refactored eventually.
  if (!data.response) {
    data.response = {};
  }

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
      responses.push(data);
      // then.. fall through!
    case GET_RESPONSES_SUCCESS:
    case SET_RESPONSES_SUCCESS: {
      const seen = {
        // response.id: index
      };
      return [...state, ...responses]
        .reduce((accum, item) => {
          const index = seen[item.id];
          if (index !== undefined) {
            accum[index] = item;
          } else {
            seen[item.id] = accum.length;
            accum.push(item);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};

export const responsesById = (state = {}, action) => {
  const { response, responses, responsesById, type } = action;
  let data = {};

  if (responsesById) {
    data = {
      ...data,
      ...responsesById
    };
  }

  if (responses) {
    const responsesByIdFromArray = responses.reduce((accum, response) => {
      if (!response.response_id) {
        return accum;
      }
      accum[response.response_id] = {
        ...response,
        ...response.response
      };
      return accum;
    }, {});

    data = {
      ...data,
      ...responsesByIdFromArray
    };
  }

  if (response && response.response_id) {
    data = {
      ...data,
      [response.response_id]: {
        ...response,
        ...response.response
      }
    };
  }

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
    case GET_RESPONSES_SUCCESS:
    case SET_RESPONSES_SUCCESS:
      return {
        ...state,
        ...data
      };
    default:
      return state;
  }
};


/*
WIP: replacement implementation.
export const response = (state = initialState, action) => {
  const { response = {}, type } = action;
  const data = {
    ...response
  };

  // There must be an actual property called "response".
  // This needs to be refactored eventually.
  if (!data.response) {
    data.response = {};
  }

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS: {
      return {
        ...state,
        ...data
      };
    }
    default:
      return state;
  }
};

export const responses = (state = [], action) => {
  const { response = {}, responses = [], type } = action;
  const data = {
    ...response
  };

  // There must be an actual property called "response".
  // This needs to be refactored eventually.
  if (!data.response) {
    data.response = {};
  }

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
      responses.push(data);
      // then.. fall through!
    case GET_RESPONSES_SUCCESS:
    case SET_RESPONSES_SUCCESS: {
      const seen = {
        // response.response_id: index
      };
      return [...state, ...responses]
        .reduce((accum, item) => {
          if (!item.id) {
            return accum;
          }
          const index = seen[item.id];
          if (index !== undefined) {
            accum[index] = item;
          } else {
            seen[item.id] = accum.length;
            accum.push(item);
          }
          return accum;
        }, [])
        .sort((a, b) => a.id < b.id);
    }
    default:
      return state;
  }
};


export const responsesById = (state = {}, action) => {
  const { response, responses, responsesById, type } = action;
  let data = {};

  if (responsesById) {
    data = responsesById;
  } else {
    if (responses) {
      data = responses.reduce((accum, response) => {
        accum[response.response_id] = {
          ...response
        };
        return accum;
      }, {});
    }
  }

  if (response) {
    data = {
      ...data,
      [response.response_id]: {
        ...response
      }
    };
  }

  switch (type) {
    case GET_RESPONSE_SUCCESS:
    case SET_RESPONSE_SUCCESS:
    case GET_RESPONSES_SUCCESS:
    case SET_RESPONSES_SUCCESS:
      return {
        ...state,
        ...data
      };
    default:
      return state;
  }
};
 */
