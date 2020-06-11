import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Message, Popup } from 'semantic-ui-react';

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
    const trigger = (
      <Fragment>
        <Form.TextArea
          required
          label="Data Header"
          name="header"
          value={content}
          {...eventHandlers}
        />
        This is only displayed in researcher data, as the column name for this
        response.
      </Fragment>
    );
    const popup = (
      <Popup
        content="Set a data header. This is only displayed in the data view and data download."
        trigger={trigger}
      />
    );
    return <Message color={color} content={popup} />;
  }
}

DataHeader.propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  content: PropTypes.any
};

export default DataHeader;
