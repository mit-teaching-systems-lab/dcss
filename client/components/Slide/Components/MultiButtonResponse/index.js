import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  agent: null,
  header: '',
  id: '',
  buttons: [
    {
      display: '',
      value: ''
    }
  ],
  persona: null,
  recallId: '',
  recallShares: null,
  required: true,
  responseId,
  timeout: 0,
  type
});
