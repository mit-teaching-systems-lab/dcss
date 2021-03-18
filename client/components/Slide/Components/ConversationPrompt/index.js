import { type, name, description } from './meta';
export { type, name, description };
export { default as Display } from './Display';
export { default as Editor } from './Editor';
export { default as Card } from './Card';

/*
const player = {
  playing: false,
  loop: false,
  controls: false,
  light: true,
  volume: null,
  muted: false,
  playbackRate: 1,
  progressInterval: 1000,
  playsinline: false,
  pip: false
};
player: Object.assign({}, player),
*/

const defaultConfiguration = {
  duration: 0,
  kind: 'whole',
  start: 0,
  end: 0
};

export const defaultValue = ({ responseId }) => ({
  agent: null,
  configuration: {
    ...defaultConfiguration
  },
  header: '',
  id: '',
  persona: null,
  prompt: '',
  recallId: '',
  recallShares: null,
  required: true,
  responseId,
  timeout: 0,
  type,
  url: ''
});
