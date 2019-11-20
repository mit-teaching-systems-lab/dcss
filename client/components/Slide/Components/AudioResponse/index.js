import { type } from './type';
export { type };
export const defaultValue = ({ responseId }) => ({
    prompt: 'Provide a prompt for users to respond to here.',
    responseId,
    type
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
