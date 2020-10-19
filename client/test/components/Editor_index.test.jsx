import {
  fetchImplementation,
  mounter,
  reduxer,
  snapshot,
  state
} from '../bootstrap';
import { unmountComponentAtNode } from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';
import Editor from '../../components/Editor/index.jsx';

import {
  GET_CATEGORIES_SUCCESS,
  GET_SCENARIO_SUCCESS,
  GET_USERS_SUCCESS
} from '../../actions/types';
import * as usersActions from '../../actions/users';
import * as scenarioActions from '../../actions/scenario';
import * as tagsActions from '../../actions/tags';
jest.mock('../../actions/users');
jest.mock('../../actions/scenario');
jest.mock('../../actions/tags');

beforeAll(() => {
  (window || global).fetch = jest.fn();
});

let container = null;
beforeEach(() => {
  container = document.createElement('div');
  container.setAttribute('id', 'root');
  document.body.appendChild(container);

  fetchImplementation(fetch);

  scenarioActions.copyScenario = jest.fn();
  scenarioActions.copyScenario.mockImplementation(() => async dispatch => {
    const scenario = {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    };
    dispatch({
      type: GET_SCENARIO_SUCCESS,
      scenario
    });
    return scenario;
  });
  scenarioActions.deleteScenario = jest.fn();
  scenarioActions.deleteScenario.mockImplementation(() => async dispatch => {
    const scenario = {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    };
    dispatch({
      type: GET_SCENARIO_SUCCESS,
      scenario
    });
    return scenario;
  });
  scenarioActions.getScenario = jest.fn();
  scenarioActions.getScenario.mockImplementation(() => async dispatch => {
    const scenario = {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    };
    dispatch({
      type: GET_SCENARIO_SUCCESS,
      scenario
    });
    return scenario;
  });
  scenarioActions.setScenario = jest.fn();
  scenarioActions.setScenario.mockImplementation(() => async dispatch => {
    const scenario = {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    };
    dispatch({
      type: GET_SCENARIO_SUCCESS,
      scenario
    });
    return scenario;
  });
  scenarioActions.endScenarioLock = jest.fn();
  scenarioActions.endScenarioLock.mockImplementation(() => async dispatch => {
    const scenario = {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    };
    dispatch({
      type: GET_SCENARIO_SUCCESS,
      scenario
    });
    return scenario;
  });

  usersActions.getUsers = jest.fn();
  usersActions.getUsers.mockImplementation(() => async dispatch => {
    const users = [
      {
        id: 2,
        email: 'owner@email.com',
        username: 'owner',
        personalname: 'Owner Account',
        roles: ['owner'],
        is_owner: true,
        is_author: true,
        is_reviewer: false
      }
    ];
    dispatch({
      type: GET_USERS_SUCCESS,
      users
    });
    return users;
  });

  usersActions.getUsersByPermission = jest.fn();
  usersActions.getUsersByPermission.mockImplementation(() => async dispatch => {
    const users = [
      {
        id: 2,
        email: 'owner@email.com',
        username: 'owner',
        personalname: 'Owner Account',
        roles: ['owner'],
        is_owner: true,
        is_author: true,
        is_reviewer: false
      }
    ];
    dispatch({
      type: GET_USERS_SUCCESS,
      users
    });
    return users;
  });

  tagsActions.getCategories = jest.fn();
  tagsActions.getCategories.mockImplementation(() => async dispatch => {
    const categories = [];
    dispatch({
      type: GET_CATEGORIES_SUCCESS,
      categories
    });
    return categories;
  });

  const statusOptions = [
    {
      id: 1,
      name: 'draft',
      description: 'Visible only to author'
    },
    {
      id: 2,
      name: 'public',
      description: 'Visible to everyone'
    },
    {
      id: 3,
      name: 'private',
      description: 'Visible only to logged in users'
    }
  ];
  fetchImplementation(fetch, 200, statusOptions);

  delete window.location;
  // eslint-disable-next-line
  window.location = {
    href: ''
  };
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const sharedProps = {
  history: {
    push() {}
  }
};

test('Editor', () => {
  expect(Editor).toBeDefined();
});

test('Snapshot 1', () => {
  const props = {
    ...sharedProps,
    scenario: {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    },
    isCopyScenario: true,
    scenarioId: 1,
    scenarioUser: {
      id: 2,
      email: 'owner@email.com',
      username: 'owner',
      personalname: 'Owner Account',
      roles: ['owner'],
      is_owner: true,
      is_author: true,
      is_reviewer: false
    }
  };
  const mounted = mounter(reduxer(Editor, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

test('Snapshot 2', () => {
  const props = {
    ...sharedProps,
    scenario: {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    },
    isNewScenario: true,
    scenarioId: 1,
    scenarioUser: {
      id: 2,
      email: 'owner@email.com',
      username: 'owner',
      personalname: 'Owner Account',
      roles: ['owner'],
      is_owner: true,
      is_author: true,
      is_reviewer: false
    }
  };
  const mounted = mounter(reduxer(Editor, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

test('Snapshot 3', () => {
  const props = {
    ...sharedProps,
    scenario: {
      author: {
        id: 2,
        username: 'owner',
        personalname: 'Owner Account',
        email: 'owner@email.com',
        is_anonymous: false,
        roles: ['participant', 'super_admin', 'facilitator', 'researcher'],
        is_super: true
      },
      categories: [],
      consent: {
        id: 57,
        prose: ''
      },
      description: 'A Multiplayer Scenario',
      finish: {
        id: 1,
        title: '',
        components: [
          {
            html: '<h2>Thanks for participating!</h2>',
            type: 'Text'
          }
        ],
        is_finish: true
      },
      lock: {
        scenario_id: 42,
        user_id: 2,
        created_at: '2020-10-10T23:54:19.934Z',
        ended_at: null
      },
      slides: [
        {
          id: 1,
          title: '',
          components: [
            {
              html: '<h2>Thanks for participating!</h2>',
              type: 'Text'
            }
          ],
          is_finish: true
        },
        {
          id: 2,
          title: '',
          components: [
            {
              id: 'b7e7a3f1-eb4e-4afa-8569-eb6677358c9e',
              html: '<p>paragraph</p>',
              type: 'Text'
            },
            {
              id: 'aede9380-c7a3-4ef7-add7-838fd5ec854f',
              type: 'TextResponse',
              header: 'TextResponse-1',
              prompt: ',timeout: 0,recallId: ',
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
      title: 'Multiplayer Scenario',
      users: [
        {
          id: 2,
          email: 'owner@email.com',
          username: 'owner',
          personalname: 'Owner Account',
          roles: ['owner'],
          is_owner: true,
          is_author: true,
          is_reviewer: false
        }
      ],
      id: 42,
      created_at: '2020-08-31T17:50:28.089Z',
      updated_at: null,
      deleted_at: null
    },
    scenarioId: 1,
    scenarioUser: {
      id: 2,
      email: 'owner@email.com',
      username: 'owner',
      personalname: 'Owner Account',
      roles: ['owner'],
      is_owner: true,
      is_author: true,
      is_reviewer: false
    }
  };
  const mounted = mounter(reduxer(Editor, props, state))();
  expect(snapshot(mounted)).toMatchSnapshot();
});

/*{INJECTION}*/
