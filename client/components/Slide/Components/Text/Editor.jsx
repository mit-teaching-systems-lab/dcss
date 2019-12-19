import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'nib-core';
import { convertFromHTML, convertToHTML } from 'nib-converter';
import * as HTMLParser from 'node-html-parser';
import { type } from './type';

// The nodeVisitor is used for finding and interacting
// with nodes in the document created by Prosemirror (via Nib).
function nodeVisitor(node, nodeVisitorCallback) {
    const { type, content } = node;
    nodeVisitorCallback(node);
    if (type && content) {
        for (const node of content) {
            nodeVisitor(node, nodeVisitorCallback);
        }
    }
}

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
            nodeVisitor(defaultValue.doc, node => {
                // This catches images that are missing an alt description
                // and forces the author to provide one.
                if (node.type === 'image' && !node.attrs.alt) {
                    node.attrs.alt = prompt('Image description required:');
                }
                // This adds "?rel=0" to the end of youtube video ifrane src embeds
                if (node.type === 'embed' && (node.attrs && node.attrs.html)) {
                    const element = HTMLParser.parse(node.attrs.html);

                    if (element && element.firstChild) {
                        const {
                            firstChild: { rawAttrs }
                        } = element;

                        if (rawAttrs.includes('youtube')) {
                            const hasRelZero = /src=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)\?rel=0?/.test(
                                rawAttrs
                            );

                            if (!hasRelZero) {
                                element.firstChild.rawAttrs = rawAttrs.replace(
                                    /(src=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.))/,
                                    '$1?rel=0'
                                );
                            }

                            node.attrs.html = element.toString();
                        }
                    }
                }
            });
            const html = convertToHTML(defaultValue.doc);

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
