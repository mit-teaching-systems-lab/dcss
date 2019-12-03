import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { type } from './type';

class ResponseRecallEditor extends React.Component {
    constructor(props) {
        super(props);
        const { components = [], recallId = '' } = props.value;

        this.state = {
            components,
            recallId
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.fetchResponseIds();
    }

    async fetchResponseIds() {
        const { scenarioId } = this.props;
        const response = await fetch(
            `/api/scenarios/${scenarioId}/slides/response-components`
        );

        const { components, status } = await response.json();

        if (status === 200) {
            this.setState({ components });
        }
    }

    onChange(event, { name, value }) {
        this.setState({ [name]: value }, () => {
            const { recallId } = this.state;
            this.props.onChange({
                type,
                recallId
            });
        });
    }

    render() {
        const { components, recallId } = this.state;
        const { onChange } = this;

        const prompts = components.reduce((accum, component, index) => {
            const { prompt, responseId } = component;
            const text = `Slide: "${component.slide.title}", Prompt: "${prompt}"`;
            accum.push({ key: index, text, value: responseId });
            return accum;
        }, []);

        prompts.unshift({
            key: '',
            text: 'No Response Embed',
            value: ''
        });

        return (
            prompts && (
                <Dropdown
                    style={{ marginBottom: '1rem' }}
                    label="Embed Participant response for prompt:"
                    defaultValue={recallId}
                    selection
                    fluid
                    name="recallId"
                    onChange={onChange}
                    options={prompts}
                />
            )
        );
    }
}

ResponseRecallEditor.propTypes = {
    scenarioId: PropTypes.string,
    value: PropTypes.shape({
        type: PropTypes.oneOf([type]),
        recallId: PropTypes.string,
        components: PropTypes.array
    }),
    onChange: PropTypes.func.isRequired
};

export default ResponseRecallEditor;
