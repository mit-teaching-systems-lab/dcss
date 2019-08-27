import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import LoginPage from '../loginPage';

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="tm__app">
                <h1>Teacher Moments</h1>
                <LoginPage />
            </div>
        );
    }
}

export default hot(module)(App);
