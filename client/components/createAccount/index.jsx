import React, { Component } from 'react';
import { Button, Form, Grid } from 'semantic-ui-react';

class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameInput: '',
            emailInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
            createError: ''
        };

        this.validFormInput = this.validFormInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    validFormInput() {
        if (!this.state.passwordInput || !this.state.confirmPasswordInput) {
            this.setState({
                createError: 'Please enter and confirm your intended password.'
            });
            return false;
        }

        if (this.state.passwordInput !== this.state.confirmPasswordInput) {
            this.setState({
                createError:
                    'Password fields do not match. Please confirm your intended password.'
            });
            return false;
        }

        if (!this.state.username && this.state.email) {
            this.setState({
                createError:
                    'Please enter a username or email address for your account.'
            });
            return false;
        }

        return true;
    }

    async handleSubmit() {
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
            this.setState({ createError: createResponse.message });
        }
    }

    handleChange(event) {
        if (this.state.createError) {
            this.setState({ createError: '' });
        }
        this.setState({ [`${event.target.name}Input`]: event.target.value });
    }

    render() {
        return (
            <Form className="signup__form">
                <Form.Field>
                    <label htmlFor="name">Username</label>
                    <input
                        name="username"
                        onChange={event => this.handleChange(event)}
                        value={this.state.usernameInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="email">Email Address</label>
                    <input
                        name="email"
                        onChange={event => this.handleChange(event)}
                        value={this.state.emailInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        onChange={event => this.handleChange(event)}
                        value={this.state.passwordInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        onChange={event => this.handleChange(event)}
                        value={this.state.confirmPasswordInput}
                    />
                </Form.Field>
                <Grid columns={2}>
                    <Grid.Column>
                        <Button
                            type="submit"
                            primary
                            size="large"
                            onClick={this.handleSubmit}
                        >
                            Create Account
                        </Button>
                    </Grid.Column>
                    <Grid.Column>{this.state.createError}</Grid.Column>
                </Grid>
            </Form>
        );
    }
}

export default CreateAccount;
