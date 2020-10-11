import {
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import {
  unmountComponentAtNode
} from 'react-dom';
import {
  cleanup,
  fireEvent,
  render
} from '@testing-library/react';
import UsersTable from '../../components/Admin/UsersTable.jsx';

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetch.mockImplementation(() => {
    return Promise.resolve({
      status: 200,
      json() {
        return Promise.resolve({});
      },
    });
  });
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const sharedProps = {
  history: {
    push() {},
  },
};

test('UsersTable', () => {
  expect(UsersTable).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    activePage: 0,
    cohort: {
      id: 2,
      created_at: '2020-08-31T14:01:08.656Z',
      name: 'A New Cohort That Exists Within Inline Props',
      runs: [],
      scenarios: [],
      users: [{
        id: 2,
        email: 'owner@email.com',
        username: 'owner',
        cohort_id: 2,
        roles: ['owner', 'facilitator'],
        is_anonymous: false,
        is_owner: true,
      }, ],
      roles: ['owner', 'facilitator'],
      usersById: {
        2: {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          cohort_id: 2,
          roles: ['owner', 'facilitator'],
          is_anonymous: false,
          is_owner: true,
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
  const mounted = mounter(reduxer(UsersTable, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
