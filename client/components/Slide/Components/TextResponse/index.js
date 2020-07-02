import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  id: '',
  placeholder: 'Placeholder Text (displayed inside the input text field)',
  prompt: 'Prompt (displayed before input text field as label)',
  recallId: '',
  required: true,
  responseId,
  type
});
