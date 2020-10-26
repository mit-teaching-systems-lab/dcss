import React from 'react';
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

import assert from 'assert';
import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshotter,
  state,
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';

import { mount, shallow } from 'enzyme';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Identity from '@utils/Identity';
jest.mock('@utils/Identity', () => {
  let count = 0;
  return {
    ...jest.requireActual('@utils/Identity'),
    id() {
      return ++count;
    },
  };
});
import UsersTable from '../../components/Admin/UsersTable.jsx';

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
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  commonProps = {};
  commonState = JSON.parse(JSON.stringify(original));
});

afterEach(() => {
  jest.resetAllMocks();
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  commonProps = null;
  commonState = null;
});

test('UsersTable', () => {
  expect(UsersTable).toBeDefined();
});

test('Render 1 1', async (done) => {
  const Component = UsersTable;

  const props = {
    ...commonProps,
    activePage: 0,
    cohort: {
      id: 1,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      runs: [],
      scenarios: [42, 99],
      users: [
        {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true,
        },
        {
          id: 555,
          email: 'regs@email.com',
          username: 'regs',
          cohort_id: 1,
          roles: ['researcher'],
          is_anonymous: false,
          is_super: false,
        },
      ],
      roles: ['super', 'facilitator'],
      usersById: {
        999: {
          id: 999,
          email: 'super@email.com',
          username: 'super',
          cohort_id: 1,
          roles: ['super', 'facilitator'],
          is_anonymous: false,
          is_super: true,
        },
        555: {
          id: 555,
          email: 'regs@email.com',
          username: 'regs',
          cohort_id: 1,
          roles: ['researcher'],
          is_anonymous: false,
          is_super: false,
        },
      },
    },
    columns: {},
    grantableRoles: {},
    onPageChange() {},
    rowsPerPage: 1,
    pages: 2,
    rows: {},
  };

  const state = {
    ...commonState,
  };

  const ConnectedRoutedComponent = reduxer(Component, props, state);
  const mounted = mounter(ConnectedRoutedComponent);
  expect(snapshotter(mounted)).toMatchSnapshot();
  expect(
    snapshotter(mounted.findWhere((n) => n.type() === Component))
  ).toMatchSnapshot();

  const { asFragment } = render(<ConnectedRoutedComponent {...props} />);
  expect(asFragment()).toMatchSnapshot();

  done();
});

/*{INJECTION}*/

