import assert from 'assert';
import { state } from '../bootstrap';

import { cohortInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/cohort';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

let cohort;
let cohorts;
let cohortsById;
let users;
let usersById;

beforeEach(() => {
  cohort = {
    ...original.cohort
  };

  cohorts = [cohort];
  cohortsById = {
    [cohort.id]: cohort
  };

  users = cohort.users.slice();
  usersById = { ...cohort.usersById };
});

afterEach(() => {
  cohort = null;
  cohorts = null;
  cohortsById = null;
  users = null;
  usersById = null;
});

describe('cohort', () => {
  test('initial state', () => {
    expect(reducer.cohort(undefined, {})).toMatchInlineSnapshot(`
      Object {
        "created_at": "",
        "deleted_at": null,
        "id": null,
        "name": "",
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
    expect(reducer.cohort(undefined, {})).toMatchInlineSnapshot(`
      Object {
        "created_at": "",
        "deleted_at": null,
        "id": null,
        "name": "",
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [],
        "usersById": Object {},
      }
    `);
  });

  test('CREATE_COHORT_SUCCESS', () => {
    const action = {
      type: types.CREATE_COHORT_SUCCESS,
      cohort
    };
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
  });
  test('SET_COHORT_SUCCESS', () => {
    const action = {
      type: types.SET_COHORT_SUCCESS,
      cohort
    };
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
  });
  test('SET_COHORT_SCENARIOS_SUCCESS', () => {
    const action = {
      type: types.SET_COHORT_SCENARIOS_SUCCESS,
      cohort
    };
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
  });
  test('GET_COHORT_SUCCESS', () => {
    const action = {
      type: types.GET_COHORT_SUCCESS,
      cohort
    };
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
  });
  test('GET_COHORT_PARTICIPANTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORT_PARTICIPANTS_SUCCESS,
      cohort
    };
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
    expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "created_at": "2020-02-31T14:01:02.656Z",
        "deleted_at": null,
        "id": 2,
        "name": "A New Cohort That Exists In Bootstrap State For Testing",
        "roles": Array [
          "super",
          "facilitator",
        ],
        "runs": Array [],
        "scenarios": Array [],
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        ],
        "usersById": Object {
          "999": Object {
            "email": "super@email.com",
            "id": 999,
            "is_anonymous": false,
            "is_super": true,
            "roles": Array [
              "super",
              "facilitator",
            ],
            "username": "super",
          },
        },
      }
    `);
  });

  describe('SET_COHORT_USER_ROLE_SUCCESS', () => {
    test('with users', () => {
      const action = {
        type: types.SET_COHORT_USER_ROLE_SUCCESS,
        users,
        usersById
      };
      expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
        Object {
          "created_at": "",
          "deleted_at": null,
          "id": null,
          "name": "",
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        }
      `);
      expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
        Object {
          "created_at": "",
          "deleted_at": null,
          "id": null,
          "name": "",
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        }
      `);
    });

    test('without users', () => {
      const action = {
        type: types.SET_COHORT_USER_ROLE_SUCCESS
      };
      expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
        Object {
          "created_at": "",
          "deleted_at": null,
          "id": null,
          "name": "",
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [],
          "usersById": Object {},
        }
      `);
      expect(reducer.cohort(undefined, action)).toMatchInlineSnapshot(`
        Object {
          "created_at": "",
          "deleted_at": null,
          "id": null,
          "name": "",
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [],
          "usersById": Object {},
        }
      `);
    });
  });
});

describe('cohorts', () => {
  test('initial state', () => {
    expect(reducer.cohorts(undefined, {})).toMatchInlineSnapshot(`Array []`);
  });

  test('GET_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      cohorts
    };
    expect(reducer.cohorts(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      ]
    `);
    expect(reducer.cohorts(undefined, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      ]
    `);
  });

  test('GET_COHORTS_SUCCESS dedupe', () => {
    const state = cohorts;
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      cohorts: [...cohorts, ...cohorts, ...cohorts]
    };
    expect(reducer.cohorts(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      ]
    `);
    expect(reducer.cohorts(state, action)).toMatchInlineSnapshot(`
      Array [
        Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      ]
    `);
  });
});

describe('cohortsById', () => {
  test('initial state', () => {
    expect(reducer.cohortsById(undefined, {})).toMatchInlineSnapshot(
      `Object {}`
    );
  });

  test('GET_COHORTS_SUCCESS', () => {
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      cohorts
    };
    expect(reducer.cohortsById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "2": Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      }
    `);
    expect(reducer.cohortsById(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "2": Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      }
    `);
  });
  test('GET_COHORTS_SUCCESS dedupe', () => {
    const state = {
      ...cohortsById
    };
    const action = {
      type: types.GET_COHORTS_SUCCESS,
      cohorts: [...cohorts, ...cohorts, ...cohorts]
    };
    expect(reducer.cohortsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "2": Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      }
    `);
    expect(reducer.cohortsById(state, action)).toMatchInlineSnapshot(`
      Object {
        "2": Object {
          "created_at": "2020-02-31T14:01:02.656Z",
          "deleted_at": null,
          "id": 2,
          "name": "A New Cohort That Exists In Bootstrap State For Testing",
          "roles": Array [
            "super",
            "facilitator",
          ],
          "runs": Array [],
          "scenarios": Array [],
          "updated_at": null,
          "users": Array [
            Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          ],
          "usersById": Object {
            "999": Object {
              "email": "super@email.com",
              "id": 999,
              "is_anonymous": false,
              "is_super": true,
              "roles": Array [
                "super",
                "facilitator",
              ],
              "username": "super",
            },
          },
        },
      }
    `);
  });
});
