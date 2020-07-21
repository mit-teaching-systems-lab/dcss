import { detect } from 'detect-browser';

export const IS_AUDIO_RECORDING_SUPPORTED = ['chrome', 'firefox'].includes(
  detect().name
);

export function secToTime(duration) {
  let seconds = parseInt(duration % 60);
  let minutes = parseInt((duration / 60) % 60);
  let hours = parseInt((duration / (60 * 60)) % 24);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${hours}:${minutes}:${seconds}`;
}
export function timeToSec(time) {
  const digits = time.split(':');
  return (
    parseInt(digits[0], 10) * 3600 +
    parseInt(digits[1], 10) * 60 +
    parseFloat(digits[2], 10)
  );
}

export function isAudioFile(input) {
  // Previously, this was determined by looking at both the path
  // and the extension, ie:
  // return /^audio\/\d.+\/AudioResponse/.test(input) &&
  //        input.endsWith('.mp3');
  //
  // Using /exp/.test(...) provided an implicit cast to string,
  // which protected us from errors caused by input not being a
  // string. That's replaced here by explicitly checking whether
  // input is a string, before checking if it ends with "mp3"
  return typeof input === 'string' && input.endsWith('.mp3');
}

export function isAudioPrompt(component) {
  // TODO: I'd prefer to have each component declare a list of
  // permissions that it needs, however that would require migrating
  // thousands of existing slide components, which is risky.
  return (
    component.type.startsWith('Conversation') ||
    component.type.startsWith('Audio')
  );
}

export default {
  IS_AUDIO_RECORDING_SUPPORTED,
  secToTime,
  timeToSec,
  isAudioFile,
  isAudioPrompt
};
