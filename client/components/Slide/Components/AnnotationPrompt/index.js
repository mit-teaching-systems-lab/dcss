import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
  disableEmbed: true,
  header: '',
  id: '',
  question: '',
  prompts: [
    /* responseId */
  ],
  persona: null,
  required: true,
  responseId,
  timeout: 0,
  type
});
