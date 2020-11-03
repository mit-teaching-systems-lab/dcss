import { request } from '../';
import { asyncMiddleware } from '../../util/api';

import * as db from '../../service/components/db';
import * as ep from '../../service/components/endpoints';

const error = new Error('something unexpected happened');

let components = [
  {
    id: '58fb77be-ef45-4200-ad7a-8b3ec47b5bcf',
    type: 'MultiPathResponse',
    paths: [
      {
        value: 3,
        display: 'Go to Slide #2'
      },
      {
        value: 4,
        display: 'Go to slide 3'
      },
      {
        value: 1,
        display: 'Go to Finish'
      },
      {
        value: 6,
        display: 'Go to Slide #5'
      }
    ],
    header: 'MultiPathResponse-1',
    prompt: '',
    timeout: 0,
    recallId: '',
    required: true,
    responseId: '5c13a120-bab6-44c6-a455-02cec1fe2177',
    disableRequireCheckbox: true,
    disableDefaultNavigation: true,
    scenario_id: 2
  }
];

jest.mock('../../service/components/db', () => {
  return {
    ...jest.requireActual('../../service/components/db'),
    getComponentsByUserId: jest.fn(),
    getComponentsByScenarioId: jest.fn()
  };
});

// // This cannot be used inside the mock defined below
// let aep = jest.requireActual('../../service/components/endpoints');

// jest.mock('../../service/components/endpoints', () => {
//   const aep = jest.requireActual('../../service/components/endpoints');
//   return {
//     ...aep,
//     getComponents: jest.fn(),
//     getComponentsByUserId: jest.fn(),
//     getComponentsByScenarioId: jest.fn(),
//   };
// });

describe('/api/components/*', () => {
  let user;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    db.getComponentsByUserId.mockImplementation(async (req, res) => {
      return components;
    });
    db.getComponentsByScenarioId.mockImplementation(async (req, res) => {
      return components;
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('/api/components/user/:id', () => {
    const path = '/api/components/user/999';

    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "components": Array [
            Object {
              "disableDefaultNavigation": true,
              "disableRequireCheckbox": true,
              "header": "MultiPathResponse-1",
              "id": "58fb77be-ef45-4200-ad7a-8b3ec47b5bcf",
              "paths": Array [
                Object {
                  "display": "Go to Slide #2",
                  "value": 3,
                },
                Object {
                  "display": "Go to slide 3",
                  "value": 4,
                },
                Object {
                  "display": "Go to Finish",
                  "value": 1,
                },
                Object {
                  "display": "Go to Slide #5",
                  "value": 6,
                },
              ],
              "prompt": "",
              "recallId": "",
              "required": true,
              "responseId": "5c13a120-bab6-44c6-a455-02cec1fe2177",
              "scenario_id": 2,
              "timeout": 0,
              "type": "MultiPathResponse",
            },
          ],
        }
      `);
      expect(db.getComponentsByUserId.mock.calls.length).toBe(1);
    });
  });

  describe('/api/components/scenario/:id', () => {
    const path = '/api/components/scenario/2';
    test('success', async () => {
      const response = await request({ path });
      expect(await response.json()).toMatchInlineSnapshot(`
        Object {
          "components": Array [
            Object {
              "disableDefaultNavigation": true,
              "disableRequireCheckbox": true,
              "header": "MultiPathResponse-1",
              "id": "58fb77be-ef45-4200-ad7a-8b3ec47b5bcf",
              "paths": Array [
                Object {
                  "display": "Go to Slide #2",
                  "value": 3,
                },
                Object {
                  "display": "Go to slide 3",
                  "value": 4,
                },
                Object {
                  "display": "Go to Finish",
                  "value": 1,
                },
                Object {
                  "display": "Go to Slide #5",
                  "value": 6,
                },
              ],
              "prompt": "",
              "recallId": "",
              "required": true,
              "responseId": "5c13a120-bab6-44c6-a455-02cec1fe2177",
              "scenario_id": 2,
              "timeout": 0,
              "type": "MultiPathResponse",
            },
          ],
        }
      `);
      expect(db.getComponentsByScenarioId.mock.calls.length).toBe(1);
    });
  });
});
