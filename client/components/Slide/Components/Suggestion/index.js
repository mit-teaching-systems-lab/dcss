import { type } from './type';
export { type };
export const defaultValue = () => ({
    type,
    html: '<Message color="grey"><p>Type your suggestion here</p></Message>',
    color: 'grey'
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
