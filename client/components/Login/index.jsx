import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Item } from 'semantic-ui-react';

import { logIn, logOut } from '@client/actions';
import Session from '@client/util/session';

const method = 'POST';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            username: '',
            loginError: '',
            usernameInput: '',
            passwordInput: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onLogIn = this.onLogIn.bind(this);
        this.onLogOut = this.onLogOut.bind(this);
    }

    onChange(event) {
        this.setState({ [`${event.target.name}Input`]: event.target.value });
    }

    onLogIn(event) {
        event.preventDefault();
        this.handleLogin();
    }
    async handleLogin() {
        const body = JSON.stringify({
            username: this.state.usernameInput,
            password: this.state.passwordInput
        });
        const loginResponse = await (await fetch('/api/auth/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method,
            body
        })).json();
        const { username, error, message: loginError = '' } = loginResponse;

        if (error) {
            this.setState({ loginError });
            this.props.logOut('');
        } else {
            this.setState({ loginError });
            this.props.logIn(username);
            Session.create({ username, timeout: Date.now() });
            this.props.history.push('/');
        }
    }

    async onLogOut() {
        const logoutResponse = await fetch('/api/auth/logout', {
            method
        });
        if (!logoutResponse.error) {
            this.props.logOut('');
            Session.destroy();
        }
        this.props.history.push('/login');
    }

    render() {
        if (this.props.isLoggedIn) {
            return (
                <Button
                    type="submit"
                    primary
                    size="large"
                    onClick={this.onLogOut}
                >
                    Log out
                </Button>
            );
        }

        return (
            <Form className="login__form" onSubmit={this.onLogIn}>
                <Form.Field>
                    <label htmlFor="name">Username</label>
                    <input
                        name="username"
                        autoComplete="username"
                        onChange={this.onChange}
                        value={this.state.usernameInput}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="password">Password</label>
                    <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={this.onChange}
                        value={this.state.passwordInput}
                    />
                </Form.Field>
                <Grid columns={2}>
                    <Grid.Column>
                        <Item>
                            <Item.Extra>
                                <Button type="submit" primary size="large">
                                    Log in
                                </Button>
                            </Item.Extra>
                            <Item.Extra className="login__form--create-link">
                                <Link to="/login/new">Create an account</Link>
                            </Item.Extra>
                        </Item>
                    </Grid.Column>
                    <Grid.Column>{this.state.loginError}</Grid.Column>
                </Grid>
            </Form>
        );
    }
}

Login.propTypes = {
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
    logIn,
    logOut
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
