import { type } from './meta';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import Identity from '@utils/Identity';
import '../Text/Text.css';

class Display extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.html !== nextProps.html;
  }

  render() {
    const { html: defaultValue } = this.props;
    const id = Identity.id();
    const mode = 'display';

    return <RichTextEditor id={id} defaultValue={defaultValue} mode={mode} />;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  rules: PropTypes.array,
  html: PropTypes.string,
  type: PropTypes.oneOf([type]).isRequired
};

export default Display;
