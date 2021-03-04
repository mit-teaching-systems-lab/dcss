import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = () => ({
  /*
  Authors will select from currently in-use agents,
  that list is also limited to a subset of agents.

  ChatPrompt agents are no compatible, or relevant to,
  Conditional Content outputs.
  */
  agent: null,
  persona: null,
  rules: [
    // See util/Conditional
    /* Example:

    This will check an see if an agent responded
    in the affirmative, less than or equal 10 times.
    {
      affirmative: {
        $lte: 10
      }
    }

    All rules must evaluate to true for the content to be displayed.

    */
  ],
  html: '<p></p>',
  type
});
