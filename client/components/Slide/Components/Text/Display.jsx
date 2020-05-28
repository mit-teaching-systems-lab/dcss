import { type } from './meta';
import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import './Text.css';

const Display = ({ html }) => (
  <RichTextEditor mode="display" defaultValue={html} />
);

Display.propTypes = {
  html: PropTypes.string.isRequired,
  type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
