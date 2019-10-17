import { type } from './type';
export { type };
export const defaultValue = () => ({
    type,
    prompt: 'Label Text',
    unchecked: 'Unchecked Value',
    checked: 'Checked Value',
    responseId: 'check-1'
});

export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';
