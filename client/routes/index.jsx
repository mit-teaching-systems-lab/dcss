import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';
import Navigation from './Navigation';
import Notification from './Notification';
import Routes from './Routes';
import './Nav.css';

import Session from '@client/util/session';

Session.timeout();

const History = withRouter(
    class extends Component {
        constructor(props) {
            super(props);

            this.onPopState = this.onPopState.bind(this);
        }

        componentDidMount() {
            window.addEventListener('popstate', this.onPopState);
        }

        componentWillUnmount() {
            window.removeEventListener('popstate', this.onPopState);
        }

        onPopState(event) {
            console.log(event);
            console.log(this.props.history);
            console.log('onPopState');
            // this.props.history.goBack();
        }

        render() {
            return this.props.children;
        }
    }
);

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <History>
                    <Navigation />
                    <Routes />
                    <Notification />
                </History>
            </Router>
        );
    }
}

export default App;
