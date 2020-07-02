import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormFieldLabelled extends Component {
  render() {
    const { children, content, label = null } = this.props;
    return (
      <div className="field">
        {label && <label>{label}</label>}
        {content || children}
      </div>
    );
  }
}

FormFieldLabelled.propTypes = {
  children: PropTypes.any,
  content: PropTypes.any,
  label: PropTypes.string
};

export default FormFieldLabelled;
