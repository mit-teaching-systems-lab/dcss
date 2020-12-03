// Defined in WCAG 2.2
// https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio

const BLACK = '#000000';
const WHITE = '#FFFFFF';

// https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
export const relativeLuminance = (r, g, b) => {
  const RsRGB = r / 255;
  const GsRGB = g / 255;
  const BsRGB = b / 255;

  const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : ((RsRGB + 0.055) / 1.055) ** 2.4;
  const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : ((GsRGB + 0.055) / 1.055) ** 2.4;
  const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : ((BsRGB + 0.055) / 1.055) ** 2.4;

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

export const foregroundColor = (color, fallback = WHITE) => {
  const hex = color.replace(/#/, '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const bC = (relativeLuminance(r, g, b) + 0.05) / 0.05;
  const wC = 1.05 / (relativeLuminance(r, g, b) + 0.05);

  if (bC >= 7.0 && wC >= 7.0) {
    return fallback;
  }

  return bC > wC ? BLACK : WHITE;
};
