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
