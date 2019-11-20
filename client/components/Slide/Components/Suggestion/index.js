import { type } from './type';
export { type };
export const defaultValue = () => ({
    color: 'grey',
    html: '<Message color="grey"><p>Type your suggestion here</p></Message>',
    type
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
