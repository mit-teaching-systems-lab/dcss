const defaultOptions = {
  behavior: 'smooth',
  block: 'nearest',
  inline: 'nearest'
};
export default function(element, optionsOrBooleanFlag = defaultOptions) {
  if (element) {
    if (typeof optionsOrBooleanFlag === 'boolean') {
      element.scrollIntoView(optionsOrBooleanFlag);
    } else {
      element.scrollIntoView(Object.assign({}, defaultOptions, optionsOrBooleanFlag));
    }
  }
}
