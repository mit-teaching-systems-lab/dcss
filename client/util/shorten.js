export default function(str, length, separator = ' ') {
  const suffix = str.length > length ? '\u2026' : '';
  if (str.length <= length) {
    return str;
  }
  return `${str.substr(0, str.lastIndexOf(separator, length))}${suffix}`;
}
