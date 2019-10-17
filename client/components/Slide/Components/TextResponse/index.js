import { type } from './type';
export { type };
export const defaultValue = () => ({
    type,
    prompt: 'Text Prompt (displayed before input field as label)',
    placeholder: 'Placeholder Text',
    responseId: 'response-1'
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
