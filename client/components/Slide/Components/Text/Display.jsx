import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import nextKey from '@utils/key';
import './Text.css';

const Display = ({ html: defaultValue }) => {
  const key = nextKey();
  const mode = 'display';
  return (
    <RichTextEditor
      key={key}
      defaultValue={defaultValue}
      mode={mode}
    />
  );
};

Display.propTypes = {
  html: PropTypes.string.isRequired,
  type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
