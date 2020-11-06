import assert from 'assert';
import {
  createMockStore,
  createPseudoRealStore,
  fetchImplementation,
  makeById,
  state
} from '../bootstrap';

import * as types from '../../actions/types';

test('COPY_SCENARIO_ERROR', () => {
  expect(types.COPY_SCENARIO_ERROR).toMatchInlineSnapshot(
    `"COPY_SCENARIO_ERROR"`
  );
});
test('COPY_SCENARIO_SUCCESS', () => {
  expect(types.COPY_SCENARIO_SUCCESS).toMatchInlineSnapshot(
    `"COPY_SCENARIO_SUCCESS"`
  );
});
test('CREATE_COHORT_ERROR', () => {
  expect(types.CREATE_COHORT_ERROR).toMatchInlineSnapshot(
    `"CREATE_COHORT_ERROR"`
  );
});
test('CREATE_COHORT_SUCCESS', () => {
  expect(types.CREATE_COHORT_SUCCESS).toMatchInlineSnapshot(
    `"CREATE_COHORT_SUCCESS"`
  );
});
test('DELETE_COHORT_ERROR', () => {
  expect(types.DELETE_COHORT_ERROR).toMatchInlineSnapshot(
    `"DELETE_COHORT_ERROR"`
  );
});
test('DELETE_COHORT_SUCCESS', () => {
  expect(types.DELETE_COHORT_SUCCESS).toMatchInlineSnapshot(
    `"DELETE_COHORT_SUCCESS"`
  );
});
test('DELETE_SCENARIO_ERROR', () => {
  expect(types.DELETE_SCENARIO_ERROR).toMatchInlineSnapshot(
    `"DELETE_SCENARIO_ERROR"`
  );
});
test('DELETE_SCENARIO_SUCCESS', () => {
  expect(types.DELETE_SCENARIO_SUCCESS).toMatchInlineSnapshot(
    `"DELETE_SCENARIO_SUCCESS"`
  );
});
test('DELETE_SLIDE_ERROR', () => {
  expect(types.DELETE_SLIDE_ERROR).toMatchInlineSnapshot(
    `"DELETE_SLIDE_ERROR"`
  );
});
test('DELETE_SLIDE_SUCCESS', () => {
  expect(types.DELETE_SLIDE_SUCCESS).toMatchInlineSnapshot(
    `"DELETE_SLIDE_SUCCESS"`
  );
});
test('GET_ALL_COHORTS_ERROR', () => {
  expect(types.GET_ALL_COHORTS_ERROR).toMatchInlineSnapshot(
    `"GET_ALL_COHORTS_ERROR"`
  );
});
test('GET_ALL_COHORTS_SUCCESS', () => {
  expect(types.GET_ALL_COHORTS_SUCCESS).toMatchInlineSnapshot(
    `"GET_ALL_COHORTS_SUCCESS"`
  );
});
test('GET_CATEGORIES_ERROR', () => {
  expect(types.GET_CATEGORIES_ERROR).toMatchInlineSnapshot(
    `"GET_CATEGORIES_ERROR"`
  );
});
test('GET_CATEGORIES_SUCCESS', () => {
  expect(types.GET_CATEGORIES_SUCCESS).toMatchInlineSnapshot(
    `"GET_CATEGORIES_SUCCESS"`
  );
});
test('GET_COHORT_ERROR', () => {
  expect(types.GET_COHORT_ERROR).toMatchInlineSnapshot(`"GET_COHORT_ERROR"`);
});
test('GET_COHORT_PARTICIPANTS_ERROR', () => {
  expect(types.GET_COHORT_PARTICIPANTS_ERROR).toMatchInlineSnapshot(
    `"GET_COHORT_PARTICIPANTS_ERROR"`
  );
});
test('GET_COHORT_PARTICIPANTS_SUCCESS', () => {
  expect(types.GET_COHORT_PARTICIPANTS_SUCCESS).toMatchInlineSnapshot(
    `"GET_COHORT_PARTICIPANTS_SUCCESS"`
  );
});
test('GET_COHORT_RUN_DATA_ERROR', () => {
  expect(types.GET_COHORT_RUN_DATA_ERROR).toMatchInlineSnapshot(
    `"GET_COHORT_RUN_DATA_ERROR"`
  );
});
test('GET_COHORT_RUN_DATA_SUCCESS', () => {
  expect(types.GET_COHORT_RUN_DATA_SUCCESS).toMatchInlineSnapshot(
    `"GET_COHORT_RUN_DATA_SUCCESS"`
  );
});
test('GET_COHORT_SUCCESS', () => {
  expect(types.GET_COHORT_SUCCESS).toMatchInlineSnapshot(
    `"GET_COHORT_SUCCESS"`
  );
});
test('GET_LOGS_ERROR', () => {
  expect(types.GET_LOGS_ERROR).toMatchInlineSnapshot(`"GET_LOGS_ERROR"`);
});
test('GET_LOGS_SUCCESS', () => {
  expect(types.GET_LOGS_SUCCESS).toMatchInlineSnapshot(`"GET_LOGS_SUCCESS"`);
});
test('GET_PERMISSIONS_ERROR', () => {
  expect(types.GET_PERMISSIONS_ERROR).toMatchInlineSnapshot(
    `"GET_PERMISSIONS_ERROR"`
  );
});
test('GET_PERMISSIONS_SUCCESS', () => {
  expect(types.GET_PERMISSIONS_SUCCESS).toMatchInlineSnapshot(
    `"GET_PERMISSIONS_SUCCESS"`
  );
});
test('GET_RESPONSE', () => {
  expect(types.GET_RESPONSE).toMatchInlineSnapshot(`"GET_RESPONSE"`);
});
test('GET_RESPONSE_ERROR', () => {
  expect(types.GET_RESPONSE_ERROR).toMatchInlineSnapshot(
    `"GET_RESPONSE_ERROR"`
  );
});
test('GET_RESPONSE_SUCCESS', () => {
  expect(types.GET_RESPONSE_SUCCESS).toMatchInlineSnapshot(
    `"GET_RESPONSE_SUCCESS"`
  );
});
test('GET_RESPONSES', () => {
  expect(types.GET_RESPONSES).toMatchInlineSnapshot(`"GET_RESPONSES"`);
});
test('GET_RESPONSE_ERROR', () => {
  expect(types.GET_RESPONSES_ERROR).toMatchInlineSnapshot(
    `"GET_RESPONSE_ERROR"`
  );
});
test('GET_RESPONSES_SUCCESS', () => {
  expect(types.GET_RESPONSES_SUCCESS).toMatchInlineSnapshot(
    `"GET_RESPONSES_SUCCESS"`
  );
});
test('GET_RUN', () => {
  expect(types.GET_RUN).toMatchInlineSnapshot(`"GET_RUN"`);
});
test('GET_RUN_DATA', () => {
  expect(types.GET_RUN_DATA).toMatchInlineSnapshot(`"GET_RUN_DATA"`);
});
test('GET_RUN_DATA_ERROR', () => {
  expect(types.GET_RUN_DATA_ERROR).toMatchInlineSnapshot(
    `"GET_RUN_DATA_ERROR"`
  );
});
test('GET_RUN_DATA_SUCCESS', () => {
  expect(types.GET_RUN_DATA_SUCCESS).toMatchInlineSnapshot(
    `"GET_RUN_DATA_SUCCESS"`
  );
});
test('GET_RUN_ERROR', () => {
  expect(types.GET_RUN_ERROR).toMatchInlineSnapshot(`"GET_RUN_ERROR"`);
});
test('GET_RUN_HISTORY', () => {
  expect(types.GET_RUN_HISTORY).toMatchInlineSnapshot(`"GET_RUN_HISTORY"`);
});
test('GET_RUN_HISTORY_ERROR', () => {
  expect(types.GET_RUN_HISTORY_ERROR).toMatchInlineSnapshot(
    `"GET_RUN_HISTORY_ERROR"`
  );
});
test('GET_RUN_HISTORY_SUCCESS', () => {
  expect(types.GET_RUN_HISTORY_SUCCESS).toMatchInlineSnapshot(
    `"GET_RUN_HISTORY_SUCCESS"`
  );
});
test('GET_RUN_SUCCESS', () => {
  expect(types.GET_RUN_SUCCESS).toMatchInlineSnapshot(`"GET_RUN_SUCCESS"`);
});
test('GET_RUNS', () => {
  expect(types.GET_RUNS).toMatchInlineSnapshot(`"GET_RUNS"`);
});
test('GET_RUNS_ERROR', () => {
  expect(types.GET_RUNS_ERROR).toMatchInlineSnapshot(`"GET_RUNS_ERROR"`);
});
test('GET_RUNS_SUCCESS', () => {
  expect(types.GET_RUNS_SUCCESS).toMatchInlineSnapshot(`"GET_RUNS_SUCCESS"`);
});
test('GET_SCENARIO', () => {
  expect(types.GET_SCENARIO).toMatchInlineSnapshot(`"GET_SCENARIO"`);
});
test('GET_SCENARIO_ERROR', () => {
  expect(types.GET_SCENARIO_ERROR).toMatchInlineSnapshot(
    `"GET_SCENARIO_ERROR"`
  );
});
test('GET_SCENARIO_SUCCESS', () => {
  expect(types.GET_SCENARIO_SUCCESS).toMatchInlineSnapshot(
    `"GET_SCENARIO_SUCCESS"`
  );
});
test('GET_SCENARIOS', () => {
  expect(types.GET_SCENARIOS).toMatchInlineSnapshot(`"GET_SCENARIOS"`);
});
test('GET_SCENARIOS_ERROR', () => {
  expect(types.GET_SCENARIOS_ERROR).toMatchInlineSnapshot(
    `"GET_SCENARIOS_ERROR"`
  );
});
test('GET_SCENARIOS_SUCCESS', () => {
  expect(types.GET_SCENARIOS_SUCCESS).toMatchInlineSnapshot(
    `"GET_SCENARIOS_SUCCESS"`
  );
});
test('GET_SCENARIOS_COUNT_ERROR', () => {
  expect(types.GET_SCENARIOS_COUNT_ERROR).toMatchInlineSnapshot(
    `"GET_SCENARIOS_COUNT_ERROR"`
  );
});
test('GET_SCENARIOS_COUNT_SUCCESS', () => {
  expect(types.GET_SCENARIOS_COUNT_SUCCESS).toMatchInlineSnapshot(
    `"GET_SCENARIOS_COUNT_SUCCESS"`
  );
});
test('GET_SESSION_ERROR', () => {
  expect(types.GET_SESSION_ERROR).toMatchInlineSnapshot(`"GET_SESSION_ERROR"`);
});
test('GET_SESSION_SUCCESS', () => {
  expect(types.GET_SESSION_SUCCESS).toMatchInlineSnapshot(
    `"GET_SESSION_SUCCESS"`
  );
});
test('GET_SLIDES', () => {
  expect(types.GET_SLIDES).toMatchInlineSnapshot(`"GET_SLIDES"`);
});
test('GET_SLIDES_ERROR', () => {
  expect(types.GET_SLIDES_ERROR).toMatchInlineSnapshot(`"GET_SLIDES_ERROR"`);
});
test('GET_SLIDES_SUCCESS', () => {
  expect(types.GET_SLIDES_SUCCESS).toMatchInlineSnapshot(
    `"GET_SLIDES_SUCCESS"`
  );
});
test('GET_TRANSCRIPT', () => {
  expect(types.GET_TRANSCRIPT).toMatchInlineSnapshot(`"GET_TRANSCRIPT"`);
});
test('GET_TRANSCRIPTION_OUTCOME_ERROR', () => {
  expect(types.GET_TRANSCRIPTION_OUTCOME_ERROR).toMatchInlineSnapshot(
    `"GET_TRANSCRIPTION_OUTCOME_ERROR"`
  );
});
test('GET_TRANSCRIPTION_OUTCOME_SUCCESS', () => {
  expect(types.GET_TRANSCRIPTION_OUTCOME_SUCCESS).toMatchInlineSnapshot(
    `"GET_TRANSCRIPTION_OUTCOME_SUCCESS"`
  );
});
test('GET_USER', () => {
  expect(types.GET_USER).toMatchInlineSnapshot(`"GET_USER"`);
});
test('GET_USER_COHORTS_ERROR', () => {
  expect(types.GET_USER_COHORTS_ERROR).toMatchInlineSnapshot(
    `"GET_USER_COHORTS_ERROR"`
  );
});
test('GET_USER_COHORTS_SUCCESS', () => {
  expect(types.GET_USER_COHORTS_SUCCESS).toMatchInlineSnapshot(
    `"GET_USER_COHORTS_SUCCESS"`
  );
});
test('GET_USER_ERROR', () => {
  expect(types.GET_USER_ERROR).toMatchInlineSnapshot(`"GET_USER_ERROR"`);
});
test('GET_USER_SUCCESS', () => {
  expect(types.GET_USER_SUCCESS).toMatchInlineSnapshot(`"GET_USER_SUCCESS"`);
});
test('GET_USERS_BY_PERMISSION_ERROR', () => {
  expect(types.GET_USERS_BY_PERMISSION_ERROR).toMatchInlineSnapshot(
    `"GET_USERS_BY_PERMISSION_ERROR"`
  );
});
test('GET_USERS_BY_PERMISSION_SUCCESS', () => {
  expect(types.GET_USERS_BY_PERMISSION_SUCCESS).toMatchInlineSnapshot(
    `"GET_USERS_BY_PERMISSION_SUCCESS"`
  );
});
test('GET_USERS', () => {
  expect(types.GET_USERS).toMatchInlineSnapshot(`"GET_USERS"`);
});
test('GET_USERS_ERROR', () => {
  expect(types.GET_USERS_ERROR).toMatchInlineSnapshot(`"GET_USERS_ERROR"`);
});
test('GET_USERS_SUCCESS', () => {
  expect(types.GET_USERS_SUCCESS).toMatchInlineSnapshot(`"GET_USERS_SUCCESS"`);
});
test('LINK_RUN_TO_COHORT_ERROR', () => {
  expect(types.LINK_RUN_TO_COHORT_ERROR).toMatchInlineSnapshot(
    `"LINK_RUN_TO_COHORT_ERROR"`
  );
});
test('LINK_RUN_TO_COHORT_SUCCESS', () => {
  expect(types.LINK_RUN_TO_COHORT_SUCCESS).toMatchInlineSnapshot(
    `"LINK_RUN_TO_COHORT_SUCCESS"`
  );
});
test('LOG_IN', () => {
  expect(types.LOG_IN).toMatchInlineSnapshot(`"LOG_IN"`);
});
test('LOG_OUT', () => {
  expect(types.LOG_OUT).toMatchInlineSnapshot(`"LOG_OUT"`);
});
test('SET_SESSION_ERROR', () => {
  expect(types.SET_SESSION_ERROR).toMatchInlineSnapshot(`"SET_SESSION_ERROR"`);
});
test('SET_SESSION_SUCCESS', () => {
  expect(types.SET_SESSION_SUCCESS).toMatchInlineSnapshot(
    `"SET_SESSION_SUCCESS"`
  );
});
test('SAVE_RUN_EVENT_ERROR', () => {
  expect(types.SAVE_RUN_EVENT_ERROR).toMatchInlineSnapshot(
    `"SAVE_RUN_EVENT_ERROR"`
  );
});
test('SAVE_RUN_EVENT_SUCCESS', () => {
  expect(types.SAVE_RUN_EVENT_SUCCESS).toMatchInlineSnapshot(
    `"SAVE_RUN_EVENT_SUCCESS"`
  );
});
test('SET_COHORT', () => {
  expect(types.SET_COHORT).toMatchInlineSnapshot(`undefined`);
});
test('SET_COHORT_ERROR', () => {
  expect(types.SET_COHORT_ERROR).toMatchInlineSnapshot(`"SET_COHORT_ERROR"`);
});
test('SET_COHORT_SUCCESS', () => {
  expect(types.SET_COHORT_SUCCESS).toMatchInlineSnapshot(
    `"SET_COHORT_SUCCESS"`
  );
});
test('SET_COHORT_USER_ROLE', () => {
  expect(types.SET_COHORT_USER_ROLE).toMatchInlineSnapshot(
    `"SET_COHORT_USER_ROLE"`
  );
});
test('SET_COHORT_USER_ROLE_ERROR', () => {
  expect(types.SET_COHORT_USER_ROLE_ERROR).toMatchInlineSnapshot(
    `"SET_COHORT_USER_ROLE_ERROR"`
  );
});
test('SET_COHORT_USER_ROLE_SUCCESS', () => {
  expect(types.SET_COHORT_USER_ROLE_SUCCESS).toMatchInlineSnapshot(
    `"SET_COHORT_USER_ROLE_SUCCESS"`
  );
});
test('SET_RESPONSE_ERROR', () => {
  expect(types.SET_RESPONSE_ERROR).toMatchInlineSnapshot(
    `"SET_RESPONSE_ERROR"`
  );
});
test('SET_RESPONSE_SUCCESS', () => {
  expect(types.SET_RESPONSE_SUCCESS).toMatchInlineSnapshot(
    `"SET_RESPONSE_SUCCESS"`
  );
});
test('SET_RESPONSES_ERROR', () => {
  expect(types.SET_RESPONSES_ERROR).toMatchInlineSnapshot(
    `"SET_RESPONSES_ERROR"`
  );
});
test('SET_RESPONSES_SUCCESS', () => {
  expect(types.SET_RESPONSES_SUCCESS).toMatchInlineSnapshot(
    `"SET_RESPONSES_SUCCESS"`
  );
});
test('SET_RUN', () => {
  expect(types.SET_RUN).toMatchInlineSnapshot(`"SET_RUN"`);
});
test('SET_RUN_ERROR', () => {
  expect(types.SET_RUN_ERROR).toMatchInlineSnapshot(`"SET_RUN_ERROR"`);
});
test('SET_RUN_SUCCESS', () => {
  expect(types.SET_RUN_SUCCESS).toMatchInlineSnapshot(`"SET_RUN_SUCCESS"`);
});
test('SET_SCENARIO', () => {
  expect(types.SET_SCENARIO).toMatchInlineSnapshot(`"SET_SCENARIO"`);
});
test('SET_SCENARIO_ERROR', () => {
  expect(types.SET_SCENARIO_ERROR).toMatchInlineSnapshot(
    `"SET_SCENARIO_ERROR"`
  );
});
test('SET_SCENARIO_SUCCESS', () => {
  expect(types.SET_SCENARIO_SUCCESS).toMatchInlineSnapshot(
    `"SET_SCENARIO_SUCCESS"`
  );
});
test('SET_SCENARIOS', () => {
  expect(types.SET_SCENARIOS).toMatchInlineSnapshot(`"SET_SCENARIOS"`);
});
test('SET_SCENARIOS_ERROR', () => {
  expect(types.SET_SCENARIOS_ERROR).toMatchInlineSnapshot(
    `"SET_SCENARIOS_ERROR"`
  );
});
test('SET_SCENARIOS_SUCCESS', () => {
  expect(types.SET_SCENARIOS_SUCCESS).toMatchInlineSnapshot(
    `"SET_SCENARIOS_SUCCESS"`
  );
});
test('SET_SLIDES', () => {
  expect(types.SET_SLIDES).toMatchInlineSnapshot(`"SET_SLIDES"`);
});
test('SET_USER', () => {
  expect(types.SET_USER).toMatchInlineSnapshot(`"SET_USER"`);
});
test('SET_USER_ERROR', () => {
  expect(types.SET_USER_ERROR).toMatchInlineSnapshot(`"SET_USER_ERROR"`);
});
test('SET_USER_ROLE_ERROR', () => {
  expect(types.SET_USER_ROLE_ERROR).toMatchInlineSnapshot(
    `"SET_USER_ROLE_ERROR"`
  );
});
test('SET_USER_ROLE_SUCCESS', () => {
  expect(types.SET_USER_ROLE_SUCCESS).toMatchInlineSnapshot(
    `"SET_USER_ROLE_SUCCESS"`
  );
});
test('SET_USER_SUCCESS', () => {
  expect(types.SET_USER_SUCCESS).toMatchInlineSnapshot(`"SET_USER_SUCCESS"`);
});
test('UNLOCK_SCENARIO_ERROR', () => {
  expect(types.UNLOCK_SCENARIO_ERROR).toMatchInlineSnapshot(
    `"UNLOCK_SCENARIO_ERROR"`
  );
});
test('UNLOCK_SCENARIO_SUCCESS', () => {
  expect(types.UNLOCK_SCENARIO_SUCCESS).toMatchInlineSnapshot(
    `"UNLOCK_SCENARIO_SUCCESS"`
  );
});
