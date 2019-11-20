import { type } from './type';
export { type };
export const defaultValue = ({ responseId }) => ({
    placeholder: 'Placeholder Text',
    prompt: 'Text Prompt (displayed before input field as label)',
    responseId,
    type
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
