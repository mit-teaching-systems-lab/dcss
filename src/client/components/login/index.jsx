import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logIn, logOut } from '@client/actions';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            isLoggedIn: false
        };

        this.handleLogIn = this.handleLogIn.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
    }

    handleLogIn() {
        this.props.logIn(this.state.username);
    }

    handleLogOut() {
        this.props.logOut(this.state.username);
    }

    // async login() {
    //     const loginData = await (await fetch('http://localhost:5000/login', {
    //         method: 'POST'
    //     })).json();
    //     this.setState({ username: loginData.username });
    // }

    // async logout() {
    //     const logoutResponse = await fetch('http://localhost:5000/logout', {
    //         method: 'POST'
    //     });
    //     if (logoutResponse.ok) {
    //         this.setState({ username: '' });
    //     }
    // }

    render() {
        return (
            <div>
                <input />
                <span>
                    <button onClick={this.handleLogIn}>Login</button>
                    <button onClick={this.handleLogOut}>Logout</button>
                </span>
                {this.isLoggedIn ? (
                    <p>{this.state.username}</p>
                ) : (
                    <p>Not logged in</p>
                )}
            </div>
        );
    }
}

export default connect(
    null,
    { logIn, logOut }
)(Login);
