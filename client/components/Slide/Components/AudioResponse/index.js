import { type } from './type';
export { type };
export const defaultValue = ({ responseId }) => ({
    prompt: 'Click then speak',
    responseId,
    type
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
