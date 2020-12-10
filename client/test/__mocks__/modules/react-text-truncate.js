import React from 'react';

export default function(props) {
  let element = props.element || 'span';
  let children = props.children || props.text || '';
  return React.createElement(element, null, `${children}${props.truncateText}`);
}
