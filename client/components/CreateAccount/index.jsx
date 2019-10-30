import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form, Grid } from 'semantic-ui-react';

import { logIn } from '@client/actions';

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameInput: '',
            emailInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
            createMessage: ''
        };

        this.validFormInput = this.validFormInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    validFormInput() {
        if (!this.state.passwordInput || !this.state.confirmPasswordInput) {
            this.setState({
                createMessage:
                    'Please enter and confirm your intended password.'
            });
            return false;
        }

        if (this.state.passwordInput !== this.state.confirmPasswordInput) {
            this.setState({
                createMessage:
                    'Password fields do not match. Please confirm your intended password.'
            });
            return false;
        }

        if (!this.state.usernameInput) {
            this.setState({
                createMessage: 'Please enter a username for your account.'
            });
            return false;
        }

        return true;
    }

    async onSubmit() {
        if (!this.validFormInput()) {
            return;
        }
        const data = JSON.stringify({
            username: this.state.usernameInput,
            email: this.state.emailInput,
            password: this.state.passwordInput
        });
        const createResponse = await (await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })).json();

        if (createResponse.error) {
            this.setState({ createMessage: createResponse.message });
            return;
        }

        if (createResponse.username) {
            this.props.logIn(createResponse.username);
            this.props.history.push('/');
        }
    }

    onChange(event) {
        if (this.state.createMessage) {
            this.setState({ createMessage: '' });
        }
        this.setState({ [`${event.target.name}Input`]: event.target.value });
    }

    render() {
        return (
            <Form className="signup__form">
                <Form.Field>
                    <label htmlFor="name">Username</label>
                    <input
                        required
                        name="username"
                        autoComplete="username"
                        onChange={this.onChange}
                        value={this.state.usernameInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="email">Email Address</label>
                    <input
                        name="email"
                        autoComplete="email"
                        placeholder="(Optional)"
                        onChange={this.onChange}
                        value={this.state.emailInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="password">Password</label>
                    <input
                        required
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        onChange={this.onChange}
                        value={this.state.passwordInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        required
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        onChange={this.onChange}
                        value={this.state.confirmPasswordInput}
                    />
                </Form.Field>
                <Grid columns={2}>
                    <Grid.Column>
                        <Button
                            primary
                            type="submit"
                            size="large"
                            onClick={this.onSubmit}
                        >
                            Create Account
                        </Button>
                    </Grid.Column>
                    <Grid.Column>{this.state.createMessage}</Grid.Column>
                </Grid>
            </Form>
        );
    }
}

CreateAccount.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
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
