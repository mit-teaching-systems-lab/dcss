// From semantic-ui-react@1.3.1

const fitsMaxWidth = (width, maxWidth) =>
  !maxWidth ? true : width <= maxWidth;
const fitsMinWidth = (width, minWidth) =>
  !minWidth ? true : width >= minWidth;

export default function isVisible(width, { maxWidth, minWidth }) {
  return fitsMinWidth(width, minWidth) && fitsMaxWidth(width, maxWidth);
}
