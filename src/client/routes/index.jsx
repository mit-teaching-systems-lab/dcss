import React from 'react';
import { Route, NavLink, BrowserRouter as Router } from 'react-router-dom';

import App from '@client/components/app';

function Routes() {
    return (
        <Router>
            <div>
                <Route path="/" component={App} />
            </div>
        </Router>
    );
}

export default Routes;
