import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { type } from './type';

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);

        const content = htmlToDraft(props.value.html);
        let editorState;
        if (content) {
            const contentState = ContentState.createFromBlockArray(
                content.contentBlocks
            );
            editorState = EditorState.createWithContent(contentState);
        }
        this.state = {
            editorState
        };
    }
    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
            />
        );
    }

    onEditorStateChange(editorState) {
        this.setState({ editorState });
        if (this.props.onChange) {
            this.props.onChange({
                type,
                html: draftToHtml(convertToRaw(editorState.getCurrentContent()))
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
