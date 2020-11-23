import assert from 'assert';
import { state } from '../bootstrap';

import { scenarioInitialState } from '../../reducers/initial-states';
import * as reducer from '../../reducers/scenario';
import * as types from '../../actions/types';

const error = new Error('something unexpected happened on the server');
const original = JSON.parse(JSON.stringify(state));

describe('scenario', () => {
  let state;
  let scenario;
  let slides;

  beforeEach(() => {
    state = {
      id: Infinity,
      title: 'The Wrong One'
    };

    scenario = {
      ...original.scenario
    };

    scenario.slides = [];

    slides = [...original.scenario.slides];
  });

  test('initial state', () => {
    expect(reducer.scenario(undefined, {})).toEqual(scenarioInitialState);
    expect(reducer.scenario(undefined, {})).toEqual(scenarioInitialState);
  });

  test('GET_SCENARIO_SUCCESS', () => {
    const action = {
      type: types.GET_SCENARIO_SUCCESS,
      scenario
    };
    expect(reducer.scenario(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "author": Object {
          "email": "super@email.com",
          "id": 2,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "super",
        },
        "categories": Array [],
        "consent": Object {
          "id": 57,
          "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
        },
        "created_at": "2020-02-31T17:50:28.029Z",
        "deleted_at": null,
        "description": "A scenario about \\"Multiplayer Scenario\\"",
        "finish": Object {
          "components": Array [
            Object {
              "html": "<h2>Thanks for participating!</h2>",
              "type": "Text",
            },
          ],
          "id": 1,
          "is_finish": true,
          "title": "",
        },
        "id": 42,
        "labels": Array [],
        "lock": Object {
          "created_at": "2020-01-01T23:54:19.934Z",
          "ended_at": null,
          "scenario_id": 42,
          "user_id": 2,
        },
        "personas": Array [],
        "slides": Array [],
        "status": 1,
        "title": "Multiplayer Scenario",
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_author": true,
            "is_reviewer": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "super",
            ],
            "username": "super",
          },
        ],
      }
    `);
    expect(reducer.scenario(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "author": Object {
          "email": "super@email.com",
          "id": 2,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "super",
        },
        "categories": Array [],
        "consent": Object {
          "id": 57,
          "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
        },
        "created_at": "2020-02-31T17:50:28.029Z",
        "deleted_at": null,
        "description": "A scenario about \\"Multiplayer Scenario\\"",
        "finish": Object {
          "components": Array [
            Object {
              "html": "<h2>Thanks for participating!</h2>",
              "type": "Text",
            },
          ],
          "id": 1,
          "is_finish": true,
          "title": "",
        },
        "id": 42,
        "labels": Array [],
        "lock": Object {
          "created_at": "2020-01-01T23:54:19.934Z",
          "ended_at": null,
          "scenario_id": 42,
          "user_id": 2,
        },
        "personas": Array [],
        "slides": Array [],
        "status": 1,
        "title": "Multiplayer Scenario",
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_author": true,
            "is_reviewer": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "super",
            ],
            "username": "super",
          },
        ],
      }
    `);
  });

  test('SET_SCENARIO', () => {
    const action = {
      type: types.SET_SCENARIO,
      scenario
    };
    expect(reducer.scenario(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "author": Object {
          "email": "super@email.com",
          "id": 2,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "super",
        },
        "categories": Array [],
        "consent": Object {
          "id": 57,
          "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
        },
        "created_at": "2020-02-31T17:50:28.029Z",
        "deleted_at": null,
        "description": "A scenario about \\"Multiplayer Scenario\\"",
        "finish": Object {
          "components": Array [
            Object {
              "html": "<h2>Thanks for participating!</h2>",
              "type": "Text",
            },
          ],
          "id": 1,
          "is_finish": true,
          "title": "",
        },
        "id": 42,
        "labels": Array [],
        "lock": Object {
          "created_at": "2020-01-01T23:54:19.934Z",
          "ended_at": null,
          "scenario_id": 42,
          "user_id": 2,
        },
        "personas": Array [],
        "slides": Array [],
        "status": 1,
        "title": "Multiplayer Scenario",
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_author": true,
            "is_reviewer": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "super",
            ],
            "username": "super",
          },
        ],
      }
    `);
    expect(reducer.scenario(undefined, action)).toMatchInlineSnapshot(`
      Object {
        "author": Object {
          "email": "super@email.com",
          "id": 2,
          "is_anonymous": false,
          "is_super": true,
          "personalname": "Super User",
          "roles": Array [
            "participant",
            "super_admin",
            "facilitator",
            "researcher",
          ],
          "username": "super",
        },
        "categories": Array [],
        "consent": Object {
          "id": 57,
          "prose": "<p>Educators and researchers in the <a href=\\"http://tsl.mit.edu/\\">MIT Teaching Systems Lab</a> would like to include your responses in research about improving this experience and learning how to better prepare teachers for the classroom.<br><br>All data you enter is protected by <a href=\\"https://couhes.mit.edu/\\">MIT's IRB review procedures</a>.</p><p>None of your personal information will be shared.<br><br>More details are available in the consent form itself.</p>",
        },
        "created_at": "2020-02-31T17:50:28.029Z",
        "deleted_at": null,
        "description": "A scenario about \\"Multiplayer Scenario\\"",
        "finish": Object {
          "components": Array [
            Object {
              "html": "<h2>Thanks for participating!</h2>",
              "type": "Text",
            },
          ],
          "id": 1,
          "is_finish": true,
          "title": "",
        },
        "id": 42,
        "labels": Array [],
        "lock": Object {
          "created_at": "2020-01-01T23:54:19.934Z",
          "ended_at": null,
          "scenario_id": 42,
          "user_id": 2,
        },
        "personas": Array [],
        "slides": Array [],
        "status": 1,
        "title": "Multiplayer Scenario",
        "updated_at": null,
        "users": Array [
          Object {
            "email": "super@email.com",
            "id": 999,
            "is_author": true,
            "is_reviewer": false,
            "is_super": true,
            "personalname": "Super User",
            "roles": Array [
              "super",
            ],
            "username": "super",
          },
        ],
      }
    `);
  });

  test('GET_SLIDES_SUCCESS', () => {
    const action = {
      type: types.GET_SLIDES_SUCCESS,
      slides
    };
    expect(reducer.scenario(state, action)).toMatchInlineSnapshot(`
      Object {
        "id": Infinity,
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          Object {
            "components": Array [
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>As the \\"Teacher\\" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-eb6677358c9e",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-838fd5ec854f",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>Welcome, here's a brief description of the problem we will solve together today!</strong></span></p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 2,
            "is_finish": false,
            "title": "",
          },
        ],
        "title": "The Wrong One",
      }
    `);
    expect(reducer.scenario(state, action)).toMatchInlineSnapshot(`
      Object {
        "id": Infinity,
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          Object {
            "components": Array [
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>As the \\"Teacher\\" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-eb6677358c9e",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-838fd5ec854f",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>Welcome, here's a brief description of the problem we will solve together today!</strong></span></p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 2,
            "is_finish": false,
            "title": "",
          },
        ],
        "title": "The Wrong One",
      }
    `);
  });

  test('SET_SLIDES', () => {
    const action = {
      type: types.SET_SLIDES,
      slides
    };
    expect(reducer.scenario(state, action)).toMatchInlineSnapshot(`
      Object {
        "id": Infinity,
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          Object {
            "components": Array [
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>As the \\"Teacher\\" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-eb6677358c9e",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-838fd5ec854f",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>Welcome, here's a brief description of the problem we will solve together today!</strong></span></p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 2,
            "is_finish": false,
            "title": "",
          },
        ],
        "title": "The Wrong One",
      }
    `);
    expect(reducer.scenario(state, action)).toMatchInlineSnapshot(`
      Object {
        "id": Infinity,
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<h2>Thanks for participating!</h2>",
                "type": "Text",
              },
            ],
            "id": 1,
            "is_finish": true,
            "title": "",
          },
          Object {
            "components": Array [
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>As the \\"Teacher\\" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-eb6677358c9e",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-838fd5ec854f",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>Welcome, here's a brief description of the problem we will solve together today!</strong></span></p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 2,
            "is_finish": false,
            "title": "",
          },
        ],
        "title": "The Wrong One",
      }
    `);
  });

  test('DELETE_SLIDE_SUCCESS', () => {
    const action = {
      type: types.DELETE_SLIDE_SUCCESS,
      slides: slides.slice(1, 2)
    };
    expect(reducer.scenario(state, action)).toMatchInlineSnapshot(`
      Object {
        "id": Infinity,
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>As the \\"Teacher\\" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-eb6677358c9e",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-838fd5ec854f",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>Welcome, here's a brief description of the problem we will solve together today!</strong></span></p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 2,
            "is_finish": false,
            "title": "",
          },
        ],
        "title": "The Wrong One",
      }
    `);
    expect(reducer.scenario(state, action)).toMatchInlineSnapshot(`
      Object {
        "id": Infinity,
        "slides": Array [
          Object {
            "components": Array [
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>As the \\"Teacher\\" in this scenario, you will be guiding a student through solving a complex problem with multiple variants.</strong></span></p>",
                "id": "b7e7a3f1-eb4e-4afa-8569-eb6677358c9e",
                "type": "Text",
              },
              Object {
                "header": "TextResponse-1",
                "id": "aede9380-c7a3-4ef7-add7-838fd5ec854f",
                "placeholder": "Your response",
                "prompt": "",
                "recallId": "",
                "required": true,
                "responseId": "be99fe9b-fa0d-4ab7-8541-1bfd1ef0bf11",
                "timeout": 0,
                "type": "TextResponse",
              },
              Object {
                "html": "<p><span style=\\"font-size: 18px;\\"><strong>Welcome, here's a brief description of the problem we will solve together today!</strong></span></p>",
                "id": "f96ac6de-ac6b-4e06-bd97-d97e12fe72c1",
                "type": "Text",
              },
            ],
            "id": 2,
            "is_finish": false,
            "title": "",
          },
        ],
        "title": "The Wrong One",
      }
    `);
  });
});
