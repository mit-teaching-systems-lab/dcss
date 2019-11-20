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

        const responseIdList = components.reduce((accum, component, index) => {
            const { prompt, responseId } = component;
            const text = `Slide: "${component.slide.title}", Prompt: ${prompt}`;
            accum.push({ key: index, text, value: responseId });
            return accum;
        }, []);

        return (
            responseIdList && (
                <React.Fragment>
                    <p>Embed Participant response for prompt:</p>
                    <Dropdown
                        defaultValue={recallId}
                        header="'Slide title', Prompt: '...')"
                        inline
                        name="recallId"
                        onChange={onChange}
                        options={responseIdList}
                        scrolling
                    />
                </React.Fragment>
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
