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
  fireEvent,
  prettyDOM,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as tagsActions from '../../actions/tags';
jest.mock('../../actions/tags');

import DropdownLabels from '../../components/ScenarioEditor/DropdownLabels.jsx';

const original = JSON.parse(JSON.stringify(state));
let container = null;
let commonProps = null;
let commonState = null;

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  tagsActions.getLabels = jest.fn();
  tagsActions.getLabels.mockImplementation(() => async dispatch => {
    const labels = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' }
    ];
    return labels;
  });

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('DropdownLabels', () => {
  expect(DropdownLabels).toBeDefined();
});

test('Render 1 1', async done => {
  const Component = DropdownLabels;

  const props = {
    ...commonProps,
    scenario: {
      author: {
        id: 999,
        username: 'super',
        personalname: 'Super User',
        email: 'super@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: { id: 69, prose: '' },
      description: "This is the description of 'Some Other Scenario'",
      finish: {
        id: 11,
        title: '',
        components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 999,
        created_at: '2020-02-31T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 11,
          title: '',
          components: [{ html: '<h2>Bye!</h2>', type: 'Text' }],
          is_finish: true
        },
        {
          id: 22,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-838fd5ec854f',
              html: '<p>HTML!</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-eb6677358c9e',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: '',
              timeout: 0,
              recallId: '',
              required: true,
              responseId: 'be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11',
              placeholder: 'Your response'
            },
            {
              id: 'f96ac6de-ac6b-4e06-bd97-d97e12fe72c1',
              html: '<p>?</p>',
              type: 'Text'
            }
          ],
          is_finish: false
        }
      ],
      status: 1,
      title: 'Some Other Scenario',
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          personalname: 'Super User',
          roles: ['super'],
          is_super: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 99,
      created_at: '2020-07-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null,
      labels: ['a']
    },
    onChange() {}
  };

  const state = {
    ...commonState
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});
