import { type } from './type';
export { type };
export const defaultValue = () => ({
    type,
    prompt: 'Provide a prompt for users to respond to here.'
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
