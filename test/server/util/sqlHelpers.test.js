const { updateQuery } = require('../../../server/util/sqlHelpers');

describe('sql helpers', () => {
    describe('updateQuery', () => {
        test('where id is number', () => {
            expect(updateQuery('test', 2, { test: 'omg', number: 123 }))
                .toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"test\\" = $1,
                  \\"number\\" = $2
                WHERE id = $3
                RETURNING *;",
                  "values": Array [
                    "omg",
                    123,
                    2,
                  ],
                }
            `);
        });
        test('where id is object', () => {
            expect(
                updateQuery(
                    'test',
                    { some_id: 2, author_id: 4 },
                    { test: 'omg', number: 123 }
                )
            ).toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"test\\" = $1,
                  \\"number\\" = $2
                WHERE  \\"some_id\\" = $3 AND 
                  \\"author_id\\" = $4

                RETURNING *;",
                  "values": Array [
                    "omg",
                    123,
                    2,
                    4,
                  ],
                }
            `);
        });
        test('where is string', () => {
            expect(updateQuery('test', 1, { test: 'omg', number: 123 }))
                .toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"test\\" = $1,
                  \\"number\\" = $2
                WHERE id = $3
                RETURNING *;",
                  "values": Array [
                    "omg",
                    123,
                    1,
                  ],
                }
            `);
        });
        test('undefined in object not set', () => {
            expect(
                updateQuery('test', 1, {
                    test: 'omg',
                    undefined: undefined
                })
            ).toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"test\\" = $1
                WHERE id = $2
                RETURNING *;",
                  "values": Array [
                    "omg",
                    1,
                  ],
                }
            `);
        });

        test('null in object is set', () => {
            expect(updateQuery('test', 1, { test: 'omg', null: null }))
                .toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"test\\" = $1,
                  \\"null\\" = NULL
                WHERE id = $2
                RETURNING *;",
                  "values": Array [
                    "omg",
                    1,
                  ],
                }
            `);
        });

        test('where has a null', () => {
            expect(
                updateQuery(
                    'test',
                    { null: null },
                    { test: 'omg', number: 123 }
                )
            ).toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"test\\" = $1,
                  \\"number\\" = $2
                WHERE  \\"null\\" IS NULL

                RETURNING *;",
                  "values": Array [
                    "omg",
                    123,
                  ],
                }
            `);
        });

        test('uses an array (jsonb)', () => {
            expect(updateQuery('test', 2, { arr: ['1', 2, '3'] }))
                .toMatchInlineSnapshot(`
                Object {
                  "text": "UPDATE \\"test\\"
                SET  \\"arr\\" = $1::jsonb
                WHERE id = $2
                RETURNING *;",
                  "values": Array [
                    "[\\"1\\",2,\\"3\\"]",
                    2,
                  ],
                }
            `);
        });
    });
});
