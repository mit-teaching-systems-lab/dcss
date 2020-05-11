import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Message, Popup } from 'semantic-ui-react';

class DataHeader extends Component {
  render() {
    const { content, onChange } = this.props;

    const trigger = (
      <Fragment>
        <Form.TextArea
          required
          label="Data Header"
          name="header"
          value={content}
          onChange={onChange}
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
    return <Message color={content ? 'grey' : 'red'} content={popup} />;
  }
}

DataHeader.propTypes = {
  onChange: PropTypes.func.isRequired,
  content: PropTypes.any
};

export default DataHeader;
