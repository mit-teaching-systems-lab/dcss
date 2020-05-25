import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import { type } from './meta';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    const defaultValue = (props.value && props.value.html) || '';
    this.state = {
      defaultValue
    };
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const { onChange } = this;
    const { defaultValue } = this.state;

    return (
      <RichTextEditor
        defaultValue={this.props.value.html}
        onBlur={onChange}
      />
    );
  }

  onChange(html) {
    console.log(this.props.value.html === html, this.props.value.html, html);
    if (this.props.onChange) {

      this.props.onChange({
        type,
        html
      });
    }
  }
}

TextEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    type: PropTypes.oneOf([type]),
    html: PropTypes.string
  })
};

export default TextEditor;
