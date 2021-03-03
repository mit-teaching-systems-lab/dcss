export const agentInitialState = {
  id: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  is_active: false,
  name: '',
  title: '',
  description: '',
  endpoint: '',
  configuration: {},
  interaction: {
    id: null
  },
  owner: {},
  self: null,
  socket: {}
};

export const chatInitialState = {
  id: null,
  host_id: null,
  cohort_id: null,
  scenario_id: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  ended_at: null,
  is_open: false,
  users: [],
  usersById: {}
};

export const cohortInitialState = {
  id: null,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  is_archived: false,
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

export const interactionInitialState = {
  id: null,
  name: null,
  description: null,
  owner: null,
  types: [],
  created_at: null,
  updated_at: null,
  deleted_at: null
};

export const inviteInitialState = {
  id: null,
  sender_id: null,
  receiver_id: null,
  status_id: null,
  props: {},
  code: '',
  created_at: null,
  updated_at: null,
  expire_at: null
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
