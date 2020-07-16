import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import { type } from './meta';

class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const { onChange } = this;
    return (
      <RichTextEditor
        id={this.props.scenario.id}
        options={{
          buttons: 'component',
          minHeight: 330
        }}
        defaultValue={this.props.value.html}
        onChange={onChange}
      />
    );
  }

  onChange(html) {
    // eslint-disable-next-line no-console
    // console.log(this.props.value.html === html, this.props.value.html, html);
    this.props.onChange({
      type,
      html
    });
  }
}

TextEditor.propTypes = {
  scenario: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf([type]),
    html: PropTypes.string
  })
};

export default TextEditor;
