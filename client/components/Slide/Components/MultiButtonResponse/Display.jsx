import { type } from './type';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Header, List, Segment } from 'semantic-ui-react';
import PromptRequiredLabel from '../PromptRequiredLabel';

class Display extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
        this.created_at = new Date().toISOString();
        this.onClick = this.onClick.bind(this);
    }

    onClick(event, { name, value }) {
        const { created_at } = this;
        this.props.onResponseChange(event, {
            created_at,
            ended_at: new Date().toISOString(),
            name,
            value,
            type
        });

        this.setState({ value });
    }

    render() {
        const { buttons, prompt, required, responseId } = this.props;
        const { value } = this.state;
        const { onClick } = this;
        const fulfilled = value ? true : false;
        const header = (
            <React.Fragment>
                {prompt}{' '}
                {required && <PromptRequiredLabel fulfilled={fulfilled} />}
            </React.Fragment>
        );
        return (
            <Segment>
                <Header as="h3">{header}</Header>

                <List>
                    {buttons &&
                        buttons.map(({ display, value }, index) => (
                            <List.Item key={`list.item-${index}`}>
                                <Button
                                    fluid
                                    key={`button-${index}`}
                                    content={display}
                                    name={responseId}
                                    value={value}
                                    onClick={onClick}
                                />
                            </List.Item>
                        ))}
                </List>
            </Segment>
        );
    }
}

Display.propTypes = {
    buttons: PropTypes.array,
    prompt: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    onResponseChange: PropTypes.func,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
