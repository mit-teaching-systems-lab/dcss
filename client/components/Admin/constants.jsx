export const SUPER_ADMIN = {
  super_admin: {
    className: 'users__col-small',
    content: 'Super Admin'
  }
};
export const ADMIN = {
  admin: {
    className: 'users__col-small',
    content: 'Admin'
  }
};
export const RESEARCHER = {
  researcher: {
    className: 'users__col-small',
    content: 'Researcher'
  }
};
export const FACILITATOR = {
  facilitator: {
    className: 'users__col-small',
    content: 'Facilitator'
  }
};
export const PARTICIPANT = {
  participant: {
    className: 'users__col-small',
    content: 'Participant'
  }
};

export const SITE_ROLE_GROUPS = {
  super_admin: {
    ...SUPER_ADMIN,
    ...ADMIN,
    ...RESEARCHER,
    ...FACILITATOR
  },

  admin: {
    ...ADMIN,
    ...FACILITATOR,
    ...RESEARCHER
  },

  facilitator: {
    ...FACILITATOR,
    ...RESEARCHER
  },

  researcher: {
    ...RESEARCHER
  }
};

export const COHORT_ROLE_GROUPS = {
  super_admin: {
    ...SUPER_ADMIN,
    ...ADMIN,
    ...RESEARCHER,
    ...FACILITATOR,
    ...PARTICIPANT
  },

  admin: {
    ...ADMIN,
    ...FACILITATOR,
    ...RESEARCHER,
    ...PARTICIPANT
  },

  facilitator: {
    ...FACILITATOR,
    ...RESEARCHER
  },

  researcher: {
    ...RESEARCHER
  }
};
