import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  id: '',
  placeholder: '',
  prompt: '',
  recallId: '',
  required: true,
  responseId,
  type
});
