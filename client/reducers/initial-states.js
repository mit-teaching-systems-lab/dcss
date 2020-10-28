export const cohortInitialState = {
  id: null,
  created_at: '',
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

export const sessionInitialState = {
  isLoggedIn: false,
  permissions: []
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
  lock: null,
  slides: [],
  status: 1,
  title: '',
  users: []
};

export const userInitialState = {
  username: null,
  personalname: null,
  email: null,
  id: null,
  roles: []
};
