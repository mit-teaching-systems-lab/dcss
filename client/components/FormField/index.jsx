import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormField extends Component {
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

FormField.propTypes = {
    children: PropTypes.any,
    content: PropTypes.any,
    label: PropTypes.string
};

export default FormField;
