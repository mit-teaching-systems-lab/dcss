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
            username: '',
            input: ''
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    updateInput(input) {
        this.setState({ input });
    }

    async handleLogIn() {
        const loginResponse = await (await fetch(
            'http://localhost:5000/login',
            {
                method: 'POST'
            }
        )).json();
        const username = loginResponse.username;
        if (loginResponse.ok) {
            this.props.logIn(username);
        }
    }

    async handleLogOut() {
        const logoutResponse = await fetch('http://localhost:5000/logout', {
            method: 'POST'
        });
        const username = '';

        if (logoutResponse.ok) {
            this.props.logOut(username);
        }
    }

    render() {
        return (
            <div>
                <input
                    onChange={e => this.updateInput(e.target.value)}
                    value={this.state.input}
                />
                <span>
                    <button onClick={this.handleLogIn}>Login</button>
                    <button onClick={this.handleLogOut}>Logout</button>
                </span>
                {this.props.isLoggedIn ? (
                    <p>{this.props.username}</p>
                ) : (
                    <p>Not logged in</p>
                )}
            </div>
        );
    }
}

Login.propTypes = {
    logIn: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    const { isLoggedIn, username } = state.login;
    return { isLoggedIn, username };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
