import React from 'react';
import { Route, NavLink, BrowserRouter as Router } from 'react-router-dom';

import App from '@client/components/app';
import Login from '@client/components/login';

function Routes() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                        <a href="https://github.com/mit-teaching-systems-lab/threeflows">
                            Source Code
                        </a>
                    </li>
                </ul>

                <hr />
                <Route path="/" component={App} />
                <Route path="/login" component={Login} />
            </div>
        </Router>
    );
}

export default Routes;
