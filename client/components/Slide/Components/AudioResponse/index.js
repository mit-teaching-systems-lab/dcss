import { type } from './type';
export { type };
export const defaultValue = ({ responseId }) => ({
    prompt: 'Record your response',
    recallId: '',
    required: true,
    responseId,
    type
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
