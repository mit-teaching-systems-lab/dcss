const Media = {
  secToTime: jest.fn(),
  timeToSec: jest.fn(),
  isAudioFile: jest.fn(),
  isAudioPrompt: jest.fn(),
  fileToMediaURL: jest.fn(),
};

export default Media;
export const IS_AUDIO_RECORDING_SUPPORTED = true;
