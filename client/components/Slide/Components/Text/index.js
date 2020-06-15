import { type, name } from './meta';
export { type, name };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = () => ({
  html: '',
  id: '',
  type
});
