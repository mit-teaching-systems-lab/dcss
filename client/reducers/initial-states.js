export const chatInitialState = {
  id: null,
  lobby_id: null,
  host_id: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  ended_at: null,
  users: [],
  usersById: {}
};

export const cohortInitialState = {
  id: null,
  created_at: '',
  updated_at: null,
  deleted_at: null,
  name: '',
  runs: [],
  scenarios: [],
  users: [],
  usersById: {}
};

export const historyInitialState = {
  prompts: [],
  responses: []
};

export const personaInitialState = {
  id: null,
  author_id: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  name: '',
  description: '',
  color: '',
  is_shared: false,
  is_read_only: false
};

export const responseInitialState = {};

export const runInitialState = {};

export const scenarioInitialState = {
  // TODO: Phase out author
  author: {
    id: null,
    username: ''
  },
  categories: [],
  consent: {
    id: null,
    prose: ''
  },
  description: undefined,
  finish: {
    components: [],
    is_finish: true,
    title: ''
  },
  labels: [],
  lock: null,
  personas: [],
  slides: [],
  status: 1,
  title: '',
  users: []
};

export const sessionInitialState = {
  isLoggedIn: false,
  permissions: []
};

export const userInitialState = {
  username: null,
  personalname: null,
  email: null,
  id: null,
  roles: []
};
