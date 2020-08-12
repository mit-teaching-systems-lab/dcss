import { GET_LOGS_SUCCESS, GET_LOGS_ERROR } from './types';

export const getLogs = ({
  queryBy = 'date',
  min,
  max,
  direction = 'DESC'
}) => async dispatch => {
  if (queryBy === 'date') {
    const today = new Date();
    max = max || today.toISOString().slice(0, 10);
    today.setDate(today.getDate() - 5);
    min = min || today.toISOString().slice(0, 10);
  }

  if (queryBy === 'count') {
    max = max || 50;
    min = min || 0;
  }

  try {
    const url = `/api/logs/range/${queryBy}/${min}/${max}/${direction}`;
    const { logs } = await (await fetch(url)).json();
    dispatch({ type: GET_LOGS_SUCCESS, logs });
    return logs;
  } catch (error) {
    dispatch({ type: GET_LOGS_ERROR, error });
    return error;
  }
};
