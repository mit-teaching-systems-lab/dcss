export function makeDefaultDescription({ title, description }) {
  let returnValue = description;
  if (!returnValue && title) {
    returnValue = `A scenario about "${title}"`;
  }
  return returnValue;
}
