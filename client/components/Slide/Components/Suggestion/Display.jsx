import { type } from './type';
import React from 'react';
import { Button, Container, Icon, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class Display extends React.Component {
    constructor(props) {
        super(props);

        const { color, html: __html, open } = this.props;

        this.state = {
            color,
            __html,
            open
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const { open } = this.state;
        this.setState({ open: !open });
    }

    render() {
        const { color, __html, open } = this.state;
        const { onClick } = this;
        const props = open ? {} : { hidden: true };
        return (
            <Container style={{ margin: '1rem 0 1rem 0' }}>
                <Button
                    onClick={onClick}
                    compact
                    inverted
                    circular
                    icon
                    color={color}
                >
                    <Icon name="info circle" />
                    Information
                </Button>
                <Message color={color} {...props}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html
                        }}
                    ></div>
                </Message>
            </Container>
        );
    }
}

Display.propTypes = {
    color: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    type: PropTypes.oneOf([type]).isRequired
};

export default React.memo(Display);
