/** @TEMPLATE: BEGIN **/
import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect
}));

import {
  fetchImplementation,
  mounter,
  reduxer,
  serialize,
  snapshotter,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import {
  act,
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function waitForPopper() {
  // Popper update() - https://github.com/popperjs/react-popper/issues/350
  await act(async () => await null);
}

/** @TEMPLATE: END **/

/** @GENERATED: BEGIN **/

import * as tlr from '@testing-library/react';

import { SET_FILTER_SCENARIOS_IN_USE } from '../../actions/types';
import * as filtersActions from '../../actions/filters';
jest.mock('../../actions/filters');

import * as QueryString from 'query-string';
jest.mock('query-string');

const s1 = {
  id: 1,
  title: 'Foo',
  description: 'A scenario about Foo!',
  status: 2,
  deleted_at: null,
  updated_at: '2020-12-10T17:50:19.074Z'
};
const s2 = {
  id: 2,
  title: 'Bar',
  description: 'A scenario about Bar!',
  status: 2,
  deleted_at: null,
  updated_at: '2020-12-10T17:50:19.074Z'
};
const s3 = {
  id: 3,
  title: 'Baz',
  description: 'A scenario about Baz!',
  status: 2,
  deleted_at: null,
  updated_at: '2020-12-10T17:50:19.074Z'
};

let scenarios;
let scenariosById;
let scenariosInUse;

import CohortScenarioLabelsFilter from '../../components/Cohorts/CohortScenarioLabelsFilter.jsx';
/** @GENERATED: END **/

/** @TEMPLATE: BEGIN **/
const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;
/** @TEMPLATE: END **/

beforeAll(() => {
  /** @TEMPLATE: BEGIN **/
  (window || global).fetch = jest.fn();
  /** @TEMPLATE: END **/
});

afterAll(() => {
  /** @TEMPLATE: BEGIN **/
  jest.restoreAllMocks();
  /** @TEMPLATE: END **/
});

beforeEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);
  /** @TEMPLATE: END **/

  /** @GENERATED: BEGIN **/

  scenarios = [s1, s2, s3];
  scenariosById = scenarios.reduce((accum, record) => {
    accum[record.id] = record;
    return accum;
  }, {});

  scenariosInUse = [2];

  filtersActions.setFilterScenariosInUse = jest.fn();

  filtersActions.setFilterScenariosInUse.mockImplementation(
    scenariosInUse => async dispatch => {
      dispatch({ type: SET_FILTER_SCENARIOS_IN_USE, scenariosInUse });
      return scenariosInUse;
    }
  );

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    search: ''
  };

  QueryString.parse.mockImplementation(() => {
    return {
      s: [1],
      search: ''
    };
  });

  /** @GENERATED: END **/

  /** @TEMPLATE: BEGIN **/
  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
  /** @TEMPLATE: END **/
});

afterEach(() => {
  /** @TEMPLATE: BEGIN **/
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
  /** @TEMPLATE: END **/
});

test('CohortScenarioLabelsFilter', () => {
  expect(CohortScenarioLabelsFilter).toBeDefined();
});

/** @GENERATED: BEGIN **/
test('Render 1 1', async done => {
  const Component = CohortScenarioLabelsFilter;
  const props = {
    ...commonProps
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
/** @GENERATED: END **/

/* INJECTION STARTS HERE */

test('No scenarios in state', async done => {
  const Component = CohortScenarioLabelsFilter;

  const props = {
    ...(commonProps || {})
  };

  const filters = {
    scenariosInUse
  };

  const state = {
    ...commonState,
    filters,
    scenarios: [],
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Selected scenariosInUse', async done => {
  const Component = CohortScenarioLabelsFilter;

  const props = {
    ...(commonProps || {})
  };

  const filters = {
    scenariosInUse
  };

  const state = {
    ...commonState,
    filters,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('No selected scenariosInUse, with unmatched search term', async done => {
  const Component = CohortScenarioLabelsFilter;

  QueryString.parse.mockImplementation(() => {
    return {
      s: [],
      search: 'z'
    };
  });

  const props = {
    ...(commonProps || {})
  };

  const filters = {
    scenariosInUse: []
  };

  const state = {
    ...commonState,
    filters,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('No selected scenariosInUse, no search term', async done => {
  const Component = CohortScenarioLabelsFilter;

  QueryString.parse.mockImplementation(() => {
    return {
      s: [],
      search: ''
    };
  });

  const props = {
    ...(commonProps || {})
  };

  const filters = {
    scenariosInUse: []
  };

  const state = {
    ...commonState,
    filters,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

test('Add and remove a filter', async done => {
  const Component = CohortScenarioLabelsFilter;

  const onChange = jest.fn();

  const props = {
    ...(commonProps || {}),
    onChange
  };

  const filters = {
    scenariosInUse
  };

  const state = {
    ...commonState,
    filters,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const dropdown = await screen.getByRole('combobox');
  expect(asFragment()).toMatchSnapshot();

  const input = await tlr.findAllByDisplayValue(dropdown, '');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(dropdown);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(input[0]);
  userEvent.type(input[0], '');
  expect(asFragment()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(1);
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
      ],
      Array [
        2,
        1,
      ],
    ]
  `);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(2);
  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
        1,
      ],
      Array [
        2,
      ],
    ]
  `);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(3);
  expect(props.onChange).toHaveBeenCalledTimes(3);
  expect(props.onChange.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
      ],
      Array [
        2,
        1,
      ],
    ]
  `);

  done();
});

test('Add and remove a filter, at a page, with a search term', async done => {
  const Component = CohortScenarioLabelsFilter;

  QueryString.parse.mockImplementation(() => {
    return {
      page: 1,
      s: [],
      search: 'Foo'
    };
  });

  const onChange = jest.fn();

  const props = {
    ...(commonProps || {}),
    onChange
  };

  const filters = {
    scenariosInUse
  };

  const state = {
    ...commonState,
    filters,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const dropdown = await screen.getByRole('combobox');
  expect(asFragment()).toMatchSnapshot();

  const input = await tlr.findAllByDisplayValue(dropdown, '');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(dropdown);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(input[0]);
  userEvent.type(input[0], '');
  expect(asFragment()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(1);
  expect(props.onChange).toHaveBeenCalledTimes(1);
  expect(props.onChange.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
      ],
      Array [
        2,
        1,
      ],
    ]
  `);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(2);
  expect(props.onChange).toHaveBeenCalledTimes(2);
  expect(props.onChange.mock.calls[1]).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
        1,
      ],
      Array [
        2,
      ],
    ]
  `);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(3);
  expect(props.onChange).toHaveBeenCalledTimes(3);
  expect(props.onChange.mock.calls[2]).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
      ],
      Array [
        2,
        1,
      ],
    ]
  `);

  done();
});

test('Search filters', async done => {
  const Component = CohortScenarioLabelsFilter;

  const props = {
    ...(commonProps || {})
  };

  const filters = {
    scenariosInUse
  };

  const state = {
    ...commonState,
    filters,
    scenarios,
    scenariosById
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  const dropdown = await screen.getByRole('combobox');
  expect(asFragment()).toMatchSnapshot();

  const input = await tlr.findAllByDisplayValue(dropdown, '');
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(dropdown);
  expect(asFragment()).toMatchSnapshot();

  userEvent.click(input[0]);
  userEvent.type(input[0], 'F');
  expect(asFragment()).toMatchSnapshot();

  let options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(1);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(2);

  // The options are now re-ordered, so query again...
  options = await tlr.findAllByRole(dropdown, 'option');

  userEvent.click(options[0]);
  expect(asFragment()).toMatchSnapshot();
  expect(filtersActions.setFilterScenariosInUse).toHaveBeenCalledTimes(3);

  done();
});
