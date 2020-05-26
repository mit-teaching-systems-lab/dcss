import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import 'suneditor/dist/css/suneditor.min.css';
import 'katex/dist/katex.min.css';
import './Text.css';

const Display = ({ html: __html }) => (
  <div
    className="sun-editor-editable richtext__container"
    dangerouslySetInnerHTML={{
      __html
    }}
  />
);

Display.propTypes = {
  html: PropTypes.string.isRequired,
  type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
