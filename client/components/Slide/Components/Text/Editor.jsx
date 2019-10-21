import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'nib-core';
import { convertFromHTML, convertToHTML } from 'nib-converter';
import { type } from './type';

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        const defaultValue = convertFromHTML(props.value.html) || '';
        this.onChange = this.onChange.bind(this);
        this.state = {
            defaultValue
        };
    }
    render() {
        const { defaultValue } = this.state;
        return <Editor defaultValue={defaultValue} onChange={this.onChange} />;
    }

    onChange(defaultValue) {
        this.setState({ defaultValue });
        if (this.props.onChange) {
            this.props.onChange({
                type,
                html: convertToHTML(defaultValue.doc)
            });
        }
    }
}

TextEditor.propTypes = {
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        html: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default TextEditor;
