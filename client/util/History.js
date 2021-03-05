import QueryString from '@utils/QueryString';

export default {
  composeUrl(location, keyVals) {
    return `${location.pathname}?${QueryString.mergedStringify(keyVals)}`;
  }
};
