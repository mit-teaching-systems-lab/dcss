import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Dropdown, Message } from 'semantic-ui-react';
import Editor from 'nib-core';
import { convertFromHTML, convertToHTML } from 'nib-converter';
import { type } from './type';

const options = [
    { key: 'red', value: 'red', text: 'Red' },
    { key: 'orange', value: 'orange', text: 'Orange' },
    { key: 'yellow', value: 'yellow', text: 'Yellow' },
    { key: 'olive', value: 'olive', text: 'Olive' },
    { key: 'green', value: 'green', text: 'Green' },
    { key: 'teal', value: 'teal', text: 'Teal' },
    { key: 'blue', value: 'blue', text: 'Blue' },
    { key: 'violet', value: 'violet', text: 'Violet' },
    { key: 'purple', value: 'purple', text: 'Purple' },
    { key: 'pink', value: 'pink', text: 'Pink' },
    { key: 'brown', value: 'brown', text: 'Brown' },
    { key: 'grey', value: 'grey', text: 'Grey' }
];
class SuggestionEditor extends React.Component {
    constructor(props) {
        super(props);

        const { color = 'grey', html = '', open = false } = props.value;

        const defaultValue = convertFromHTML(html);

        this.state = {
            color,
            defaultValue,
            open
        };

        this.onColorChange = this.onColorChange.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.onTextareaChange = this.onTextareaChange.bind(this);
        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        const { color, defaultValue, open } = this.state;

        const html = convertToHTML(defaultValue.doc);

        this.props.onChange({
            type,
            html,
            color,
            open
        });
    }

    onTextareaChange(defaultValue) {
        this.setState({ defaultValue }, this.updateState);
    }

    onVisibilityChange(event, { checked: open }) {
        this.setState({ open }, this.updateState);
    }

    onColorChange(event, { value: color }) {
        this.setState({ color }, this.updateState);
    }

    render() {
        const { color, open, defaultValue } = this.state;
        const { onColorChange, onTextareaChange, onVisibilityChange } = this;
        const selectedOption = options.find(option => option.key === color);
        return (
            <React.Fragment>
                <Dropdown
                    search
                    selection
                    searchInput={{ type: 'string' }}
                    options={options}
                    defaultValue={selectedOption.key}
                    onChange={onColorChange}
                />
                <Message color={color}>
                    <Editor
                        autoFocus
                        defaultValue={defaultValue}
                        onChange={onTextareaChange}
                        styleConfig={{
                            editor: () => ({
                                height: '150px'
                            })
                        }}
                        config={{
                            toolbar: { options: '' }
                        }}
                    />
                </Message>
                <Checkbox
                    name="open"
                    label="Default to visible?"
                    checked={open}
                    onChange={onVisibilityChange}
                />
            </React.Fragment>
        );
    }
}

SuggestionEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        color: PropTypes.string,
        html: PropTypes.string,
        open: PropTypes.bool,
        type: PropTypes.oneOf([type])
    })
};

export default SuggestionEditor;
