import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Header, Icon, Modal } from 'semantic-ui-react';
import './LoginRoutePromptModal.css';

class LoginRoutePromptModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: null
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick(event, { name }) {
        const { location } = this.props;
        const state = { from: location };
        const redirect = {
            pathname: name,
            state
        };

        this.setState({ redirect });
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to={redirect} />;
        }

        const { onClick } = this;
        const buttonLogin = (
            <Button fluid size="large" name="/login" onClick={onClick}>
                <Icon.Group className="loginroutepromptmodal__action-icon-spacing">
                    <Icon name="user outline" />
                    <Icon corner name="lock" />
                </Icon.Group>
                Log in
            </Button>
        );
        const buttonCreateAccount = (
            <Button fluid size="large" name="/login/new" onClick={onClick}>
                <Icon.Group className="loginroutepromptmodal__action-icon-spacing">
                    <Icon name="user outline" />
                    <Icon corner name="plus" />
                </Icon.Group>
                Create an account
            </Button>
        );
        const buttonCreateAnonymous = (
            <Button
                fluid
                size="large"
                name="/login/anonymous"
                onClick={onClick}
            >
                <Icon.Group className="loginroutepromptmodal__action-icon-spacing">
                    <Icon name="user outline" />
                    <Icon corner name="question" />
                </Icon.Group>
                Continue anonymously
            </Button>
        );
        return (
            <Modal open size="small">
                <Header
                    icon="user outline"
                    content="Log in, Create an account, or Continue anonymously?"
                />
                <Modal.Content>
                    <p>
                        To continue with this scenario, please choose one of the
                        following options:
                    </p>
                    <Grid columns={2} divided>
                        <Grid.Row>
                            <Grid.Column>{buttonLogin}</Grid.Column>
                            <Grid.Column>
                                <p>If you already have an account</p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>{buttonCreateAccount}</Grid.Column>
                            <Grid.Column>
                                <p>
                                    If you do not have an account, but wish to
                                    create one.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>{buttonCreateAnonymous}</Grid.Column>
                            <Grid.Column>
                                <p>
                                    If you do not have an account, and do not
                                    wish to create one.
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

LoginRoutePromptModal.propTypes = {
    location: PropTypes.object
};

export default LoginRoutePromptModal;
