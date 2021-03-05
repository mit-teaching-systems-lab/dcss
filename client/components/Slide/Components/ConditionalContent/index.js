import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  /*
  Authors will select from currently in-use agents,
  that list is also limited to a subset of agents.

  ChatPrompt agents are not compatible, or relevant to,
  Conditional Content outputs.
  */
  agent: null,
  disableRequireCheckbox: true,
  header: '',
  id: '',
  rules: [
    {
      operator: null,
      value: null
    }
  ],
  persona: null,
  recallId: '',
  required: false,
  responseId,
  html: '<p></p>',
  type
});
