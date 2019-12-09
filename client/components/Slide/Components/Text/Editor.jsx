import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'nib-core';
import { convertFromHTML, convertToHTML } from 'nib-converter';
import { type } from './type';

class TextEditor extends React.Component {
    constructor(props) {
        super(props);

        const defaultHtml = (props.value && props.value.html) || '';
        const hasWrapper = /^(<.+>.*<\/.+>)$/gm.test(defaultHtml);
        const defaultValue = convertFromHTML(
            hasWrapper ? defaultHtml : `<p>${defaultHtml}</p>`
        );

        this.onChange = this.onChange.bind(this);
        this.state = {
            defaultValue
        };
    }
    render() {
        const { defaultValue } = this.state;
        const config = this.props.config ? { config: this.props.config } : {};

        const defaultStyleConfig = {
            editor: () => ({
                height: '300px'
            })
        };
        const styleConfig = this.props.styleConfig
            ? { styleConfig: this.props.styleConfig }
            : { styleConfig: defaultStyleConfig };
        return (
            <Editor
                {...config}
                defaultValue={defaultValue}
                onChange={this.onChange}
                spellCheck={true}
                {...styleConfig}
            />
        );
    }

    onChange(defaultValue) {
        this.setState({ defaultValue });
        if (this.props.onChange) {
            const html = convertToHTML(defaultValue.doc).replace(
                /<p><\/p>/g,
                '<br>'
            );
            this.props.onChange({
                type,
                html
            });
        }
    }
}

TextEditor.propTypes = {
    config: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    styleConfig: PropTypes.object,
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        html: PropTypes.string
    })
};

export default TextEditor;
