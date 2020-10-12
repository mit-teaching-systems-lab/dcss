import { GET_RUN_HISTORY_SUCCESS, GET_RUN_HISTORY_ERROR } from './types';

export const getHistoryForScenario = (
  scenario_id,
  cohort_id
) => async dispatch => {
  try {
    const endpoint = cohort_id
      ? `/api/history/${scenario_id}/cohort/${cohort_id}`
      : `/api/history/${scenario_id}`;

    const res = await (await fetch(endpoint)).json();

    if (res.error) {
      throw res;
    }

    const { history } = res;

    dispatch({ type: GET_RUN_HISTORY_SUCCESS, history });
    return { ...history };
  } catch (error) {
    dispatch({ type: GET_RUN_HISTORY_ERROR, error });
    return null;
  }
};
