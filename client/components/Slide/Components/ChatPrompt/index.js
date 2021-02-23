import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  id: '',
  disableDelete: true,
  disableDuplicate: true,
  disableEmbed: true,
  disableOrdering: true,
  disablePersona: true,
  disableRequireCheckbox: {
    timer: {
      $gt: 0
    }
  },
  prompt: '',
  required: false,
  responseId,
  timer: 0,
  type
});
