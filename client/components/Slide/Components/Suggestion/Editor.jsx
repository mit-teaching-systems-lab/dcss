import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Message } from 'semantic-ui-react';
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

        const color = props.value.color || 'grey';
        const defaultValue = convertFromHTML(props.value.html || '');

        this.onChange = this.onChange.bind(this);
        this.state = {
            defaultValue,
            color
        };
    }
    render() {
        const { color, defaultValue } = this.state;
        const selectedOption = options.find(option => option.key === color);
        return (
            <React.Fragment>
                <Dropdown
                    search
                    selection
                    searchInput={{ type: 'string' }}
                    options={options}
                    defaultValue={selectedOption.key}
                    onChange={(event, data) => {
                        this.setState({ color: data.value }, () => {
                            this.onChange(this.state);
                        });
                    }}
                />
                <Message color={this.state.color}>
                    <Editor
                        autoFocus
                        defaultValue={defaultValue}
                        onChange={defaultValue => {
                            this.setState({ defaultValue }, () => {
                                this.onChange(this.state);
                            });
                        }}
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
            </React.Fragment>
        );
    }

    onChange({ color, defaultValue }) {
        const html = convertToHTML(defaultValue.doc);
        if (this.props.onChange) {
            this.props.onChange({
                type,
                html,
                color
            });
        }
    }
}

SuggestionEditor.propTypes = {
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        html: PropTypes.string,
        color: PropTypes.string
    }),
    onChange: PropTypes.func.isRequired
};

export default SuggestionEditor;
