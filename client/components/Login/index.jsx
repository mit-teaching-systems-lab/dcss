import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Item } from 'semantic-ui-react';

import { logIn, logOut } from '@client/actions';
import Session from '@client/util/session';

const method = 'POST';

class Login extends Component {
    constructor(props) {
        super(props);

        const mode =
            this.props.mode || this.props.location.pathname.includes('logout')
                ? 'logout'
                : 'login';
        const isLoggedIn = false;
        const loginError = '';
        const username = '';
        const password = '';

        this.state = {
            isLoggedIn,
            loginError,
            mode,
            username,
            password
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.doLogin = this.doLogin.bind(this);
        this.doLogout = this.doLogout.bind(this);

        if (mode === 'logout') {
            this.doLogout();
        }
    }

    onChange(event, { name, value }) {
        this.setState({ [name]: value });
    }

    onSubmit(event) {
        event.preventDefault();
        this.doLogin();
    }

    async doLogin() {
        const { username, password } = this.state;

        const body = JSON.stringify({
            username,
            password
        });
        const { error, message: loginError = '' } = await (await fetch(
            '/api/auth/login',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method,
                body
            }
        )).json();

        if (error) {
            this.setState({ loginError });
            this.props.logOut('');
        } else {
            this.setState({ loginError });
            this.props.logIn({ username, isLoggedIn: true });
            Session.create({ username, timeout: Date.now() });

            // Step outside of react to force a real reload
            // force a real request after log-in.
            location.href = '/';
        }
    }

    async doLogout() {
        await fetch('/api/auth/logout', {
            method
        });
        Session.destroy();
        // Step outside of react and react-router to
        // force a real request after logout.
        location.href = '/';
    }

    render() {
        const { loginError, mode, password, username } = this.state;
        const { onChange, onSubmit } = this;

        if (mode === 'logout') {
            return null;
        }

        return (
            <Form className="login__form" onSubmit={onSubmit}>
                <Form.Field>
                    <label htmlFor="name">Username</label>
                    <Form.Input
                        name="username"
                        autoComplete="username"
                        onChange={onChange}
                        value={username}
                    />
                </Form.Field>
                <Form.Field>
                    <label htmlFor="password">Password</label>
                    <Form.Input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={onChange}
                        value={password}
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
                    <Grid.Column>{loginError}</Grid.Column>
                </Grid>
            </Form>
        );
    }
}

Login.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    location: PropTypes.object,
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    mode: PropTypes.string,
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

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Login)
);
