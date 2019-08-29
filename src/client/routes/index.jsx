import React from 'react';
import { Route, NavLink, BrowserRouter as Router } from 'react-router-dom';

import App from '@client/components/app';
import Login from '@client/components/login';

function Routes() {
    return (
        <Router>
            <div>
                <Route path="/" component={App} />
                <Route path="/login" component={Login} />
            </div>
        </Router>
    );
}

export default Routes;
