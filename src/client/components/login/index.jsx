import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logIn, logOut } from '@client/actions';

const mapDispatchToProps = {
    logIn,
    logOut
};

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            loginError: '',
            username: '',
            usernameInput: ''
        };

        this.updateUsernameInput = this.updateUsernameInput.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    updateUsernameInput(usernameInput) {
        this.setState({ usernameInput });
    }

    async handleLogIn() {
        const data = JSON.stringify({ username: this.state.usernameInput });
        const loginResponse = await (await fetch(
            'http://localhost:5000/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            }
        )).json();
        const username = loginResponse.username;
        this.props.logIn(username);

        if (loginResponse.error) {
            this.setState({ loginError: loginResponse.message });
            this.props.logOut('');
        } else {
            this.setState({ loginError: '' });
            this.props.logIn(username);
        }
    }

    async handleLogOut() {
        const logoutResponse = await fetch('http://localhost:5000/logout', {
            method: 'POST'
        });
        const username = '';

        if (!logoutResponse.error) {
            this.props.logOut(username);
        }
    }

    render() {
        return (
            <div>
                <div>
                    <label htmlFor="name">username</label>
                    <input
                        name="username"
                        onChange={e => this.updateUsernameInput(e.target.value)}
                        value={this.state.usernameInput}
                    />
                </div>
                <div>
                    <button onClick={this.handleLogIn}>Login</button>
                    <button onClick={this.handleLogOut}>Logout</button>
                </div>
                {this.props.isLoggedIn ? (
                    <p>Username: {this.props.username}</p>
                ) : (
                    <p>Not logged in</p>
                )}
                {this.state.loginError}
            </div>
        );
    }
}

Login.propTypes = {
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string
};

function mapStateToProps(state) {
    const { isLoggedIn, username } = state.login;
    return { isLoggedIn, username };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
