import { type } from './meta';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import Identity from '@utils/Identity';
import './Text.css';

class Display extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.html !== nextProps.html;
  }

  render() {
    const { html: defaultValue } = this.props;
    const key = Identity.id();
    const mode = 'display';

    return <RichTextEditor key={key} defaultValue={defaultValue} mode={mode} />;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  html: PropTypes.string,
  type: PropTypes.oneOf([type]).isRequired
};

export default Display;
