import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navigation from './Navigation';
import Routes from './Routes';
import './Nav.css';

import Session from '@client/util/session';

Session.timeout();

function App() {
    return (
        <Router>
            <Navigation />
            <Routes />
        </Router>
    );
}
export default App;
