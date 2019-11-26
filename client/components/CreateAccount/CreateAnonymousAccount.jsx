import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Button,
    Header,
    Loader,
    Modal,
    Popup,
    Segment
} from 'semantic-ui-react';
import { logIn } from '@client/actions';
import Session from '@client/util/session';
import anonymousUsername from './anonymousUsername';
import './CreateAnonymousAccount.css';

class CreateAnonymousAccount extends Component {
    constructor(props) {
        super(props);

        const from =
            this.props.location.state && this.props.location.state.from;

        this.state = {
            from,
            username: ''
        };

        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.generateUnusedAnonymousUsername();
    }

    async generateUnusedAnonymousUsername() {
        const username = anonymousUsername();
        const { status } = await (await fetch(
            `/api/auth/signup/usernames/${username}/exists`
        )).json();

        if (status === 409) {
            return await this.generateUnusedAnonymousUsername();
        }

        if (username) {
            this.setState({ username });
        }
    }

    async onSubmit() {
        const { from, username } = this.state;
        const body = JSON.stringify({
            username
        });

        const { error, message } = await (await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })).json();

        if (error) {
            this.setState({ message });
            return;
        }

        if (username) {
            Session.create({ username, timeout: Date.now() });
            // Step outside of react to force a real reload
            // after signup and session create
            location.href = from ? from.pathname : '/';
        }
    }

    onClick(event, { name }) {
        if (name === 'no') {
            this.generateUnusedAnonymousUsername();
        }
        if (name === 'nvm') {
            location.href = '/';
        }
    }

    render() {
        const { username } = this.state;
        const { onClick, onSubmit } = this;
        const header = username
            ? 'Do you like this temporary user name?'
            : 'Find a temporary user name for you.';
        return (
            <Modal open size="small">
                <Header icon="user outline" content={header} />
                <Modal.Content>
                    <Segment>
                        {username ? (
                            <Header
                                as="h1"
                                className="createanonymousaccount__header-centered"
                            >
                                <code>{username}</code>
                            </Header>
                        ) : (
                            <Loader active inline="centered" />
                        )}
                    </Segment>

                    <Button.Group fluid>
                        <Popup
                            content="Select this user name to continue."
                            position="bottom center"
                            trigger={
                                <Button
                                    color="green"
                                    content="Yes, continue"
                                    name="yes"
                                    onClick={onSubmit}
                                />
                            }
                        />
                        <Button.Or />
                        <Popup
                            content="Show me another available user name."
                            position="bottom center"
                            trigger={
                                <Button
                                    color="orange"
                                    content="No, see another"
                                    name="no"
                                    onClick={onClick}
                                />
                            }
                        />
                        <Button.Or />
                        <Popup
                            content="Return to list of scenarios."
                            position="bottom center"
                            trigger={
                                <Button
                                    color="grey"
                                    content="Nevermind!"
                                    name="nvm"
                                    onClick={onClick}
                                />
                            }
                        />
                    </Button.Group>
                </Modal.Content>
            </Modal>
        );
    }
}

CreateAnonymousAccount.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    location: PropTypes.object,
    logIn: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string
};

function mapStateToProps(state) {
    const { isLoggedIn, username } = state.login;
    return { isLoggedIn, username };
}

const mapDispatchToProps = {
    logIn
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateAnonymousAccount);
