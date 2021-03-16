import { makeDefaultDescription } from '@components/Editor/scenario';

describe('makeDefaultDescription', () => {
  test('Without description', () => {
    const scenario = {
      title: 'A title',
      description: ''
    };
    expect(makeDefaultDescription(scenario)).toMatchInlineSnapshot(
      `"A scenario about \\"A title\\""`
    );
  });

  test('With description', () => {
    const scenario = {
      title: 'A title',
      description: 'A description'
    };
    expect(makeDefaultDescription(scenario)).toMatchInlineSnapshot(
      `"A description"`
    );
  });
});
