import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from '@components/UI';

class DataHeader extends Component {
  shouldComponentUpdate(newProps) {
    return this.props.content !== newProps.content;
  }

  render() {
    const { content, onBlur, onChange } = this.props;
    const color = content ? 'grey' : 'red';
    const eventHandlers = {};
    if (onBlur) {
      eventHandlers.onBlur = onBlur;
    }
    if (onChange) {
      eventHandlers.onChange = onChange;
    }
    const textarea = (
      <Fragment>
        <Form.TextArea
          required
          label="Data Header"
          name="header"
          value={content}
          {...eventHandlers}
        />
        This is only appears in data downloads, as the column header or row name.
      </Fragment>
    );
    return (
      <Message
        color={color}
        content={textarea}
      />
    );
  }
}

DataHeader.propTypes = {
  content: PropTypes.any,
  id: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
};

export default DataHeader;
