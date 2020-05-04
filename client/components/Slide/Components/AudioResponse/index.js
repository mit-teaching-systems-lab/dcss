import { type, name } from './meta';
export { type, name };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
export const defaultValue = ({ responseId }) => ({
    header: '',
    prompt: 'Record your response',
    recallId: '',
    required: true,
    responseId,
    type
});
