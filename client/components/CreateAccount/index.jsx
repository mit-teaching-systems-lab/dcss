import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, Grid } from 'semantic-ui-react';

import { logIn } from '@client/actions';
import Session from '@client/util/session';

class CreateAccount extends Component {
    constructor(props) {
        super(props);

        const from =
            this.props.location.state && this.props.location.state.from;

        this.state = {
            from,
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            message: ''
        };

        this.validFormInput = this.validFormInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    validFormInput() {
        const { confirmPassword, password, username } = this.state;

        if (!password || !confirmPassword) {
            this.setState({
                message: 'Please enter and confirm your intended password.'
            });
            return false;
        }

        if (password !== confirmPassword) {
            this.setState({
                message:
                    'Password fields do not match. Please confirm your intended password.'
            });
            return false;
        }

        if (!username) {
            this.setState({
                message: 'Please enter a username for your account.'
            });
            return false;
        }

        return true;
    }

    async onSubmit() {
        if (!this.validFormInput()) {
            return;
        }

        const { email, from, password, username } = this.state;

        const body = JSON.stringify({
            email,
            password,
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

    onChange(event, { name, value }) {
        if (this.state.message) {
            this.setState({ message: '' });
        }
        this.setState({ [name]: value });
    }

    render() {
        const {
            email,
            confirmPassword,
            message,
            password,
            username
        } = this.state;
        const { onChange, onSubmit } = this;
        return (
            <Form onSubmit={onSubmit} className="signup__form">
                <Form.Field>
                    <Form.Input
                        required
                        label="Username:"
                        name="username"
                        autoComplete="username"
                        onChange={onChange}
                        value={username}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        name="email"
                        label="Email Address:"
                        autoComplete="email"
                        placeholder="(Optional)"
                        onChange={onChange}
                        value={email}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        required
                        label="Password:"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        onChange={onChange}
                        value={password}
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                        required
                        label="Confirm Password:"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        onChange={onChange}
                        value={confirmPassword}
                    />
                </Form.Field>
                <Grid columns={2}>
                    <Grid.Column>
                        <Button
                            primary
                            type="submit"
                            size="large"
                            onClick={onSubmit}
                        >
                            Create Account
                        </Button>
                    </Grid.Column>
                    <Grid.Column>{message}</Grid.Column>
                </Grid>
            </Form>
        );
    }
}

CreateAccount.propTypes = {
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
)(CreateAccount);
