import React from 'react';
import {
    Route,
    Switch,
    NavLink,
    BrowserRouter as Router
} from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import ScenariosList from '@client/components/ScenariosList';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import AccountAdmin from '@client/components/AccountAdmin';
import Login from '@client/components/Login';
import CreateAccount from '@client/components/CreateAccount';
import Run from '@client/components/Run';

import Session from '@client/util/session';

Session.timeout();

function Routes() {
    return (
        <Router>
            <h1>
                <NavLink to="/">Teacher Moments</NavLink>
            </h1>
            <Switch>
                <GeneralRoutes />
            </Switch>
        </Router>
    );
}

const GeneralRoutes = () => {
    return (
        <React.Fragment>
            <Menu className="nav">
                <Menu.Item>
                    <NavLink to="/">Home</NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to="/official">Official</NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to="/community">Community</NavLink>
                </Menu.Item>
                {Session.isSessionActive() && (
                    <React.Fragment>
                        <Menu.Item>
                            <NavLink exact to="/create">
                                Create a Moment
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item>
                            <NavLink to="/facilitator">Facilitator</NavLink>
                        </Menu.Item>
                        <Menu.Item>
                            <NavLink to="/admin">Admin</NavLink>
                        </Menu.Item>
                    </React.Fragment>
                )}
                <Menu.Item position="right">
                    {Session.isSessionActive() ? (
                        <NavLink to="/logout">Log out</NavLink>
                    ) : (
                        <NavLink to="/login">Log in</NavLink>
                    )}
                </Menu.Item>
            </Menu>

            <Route exact path="/" component={ScenariosList} />
            <Route exact path="/official" component={ScenariosList} />
            <Route exact path="/community" component={ScenariosList} />
            <Route path="/run/:scenarioId" component={Run} />
            <Route exact path="/create" component={Editor} />
            <Route path="/editor/:id" component={Editor} />
            <Route exact path="/facilitator" component={Facilitator} />
            <Route exact path="/admin" component={AccountAdmin} />
            <Route exact path="/logout" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route path="/login/new" component={CreateAccount} />
        </React.Fragment>
    );
};

export default Routes;
