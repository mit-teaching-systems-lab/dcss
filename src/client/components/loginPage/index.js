import React, { Component } from 'react';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        }

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login() {
        const loginData = await (await fetch('http://localhost:5000/login', { method: 'POST'})).json();
        this.setState({ username: loginData.username });
    }

    async logout() {
        const logoutResponse = await fetch('http://localhost:5000/logout', { method: 'POST'});
        if (logoutResponse.ok) {
            this.setState({ username: ''});
        }
    }

    render() {
        return(
            <div>
                <span>
                    <button onClick={this.login}>Login</button>
                    <button onClick={this.logout}>Logout</button>
                </span>
                {
                    !this.state.username ? <p>Not logged in</p> : <p>{this.state.username}</p>
                }
            </div>
        );
    }
}
