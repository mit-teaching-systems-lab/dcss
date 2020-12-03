import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = () => ({
  color: 'grey',
  html: '<Message color="grey"><p>Type your suggestion here</p></Message>',
  id: '',
  persona: null,
  type
});
