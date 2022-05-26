import { detect } from 'detect-browser';

const { name, os } = Object.entries(detect()).reduce((accum, [key, value]) => {
  accum[key] = value.toLowerCase();
  return accum;
}, {});

// Browser
export const IS_CHROME = name === 'chrome';
export const IS_FIREFOX = name === 'firefox';
export const IS_SAFARI = name === 'safari';

// OS
export const IS_ANDROID = os.toLowerCase().includes('android');

// Capability
export const IS_AUDIO_RECORDING_SUPPORTED = IS_CHROME || IS_FIREFOX;

// Branding
export const BRAND_NAME =
  process.env.DCSS_BRAND_NAME_TITLE || 'Teacher Moments';
