import React from 'react';
import { Route, NavLink, BrowserRouter as Router } from 'react-router-dom';

import App from '@client/components/App';
import Editor from '@client/components/Editor';
import Login from '@client/components/Login';
import CreateAccount from '@client/components/CreateAccount';

import Session from '@client/util/session';

Session.timeout();

function Routes() {
    return (
        <Router>
            <div>
                <h1>Teacher Moments</h1>
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/editor/new">Create a Moment</NavLink>
                    </li>
                    <li>
                        {Session.isSessionActive() ? (
                            <NavLink to="/logout">Log out</NavLink>
                        ) : (
                            <NavLink to="/login">Log in</NavLink>
                        )}
                    </li>
                </ul>

                <hr />

                <Route exact path="/" component={App} />
                <Route path="/editor/:id" component={Editor} />
                <Route exact path="/logout" component={Login} />
                <Route exact path="/login" component={Login} />
                <Route path="/login/new" component={CreateAccount} />
            </div>
        </Router>
    );
}

export default Routes;
