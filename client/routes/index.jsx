import React from 'react';
import {
    Route,
    Switch,
    NavLink,
    BrowserRouter as Router
} from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import ScenariosList from '@client/components/ScenariosList';
import Scenario from '@client/components/Scenario';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import Login from '@client/components/Login';
import CreateAccount from '@client/components/CreateAccount';

import Session from '@client/util/session';

Session.timeout();

function Routes() {
    return (
        <Router>
            <h1>
                <NavLink to="/">Teacher Moments</NavLink>
            </h1>

            <Switch>
                <Route path="/moment/:scenarioId" component={Scenario} />
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
                {Session.isSessionActive() && (
                    <React.Fragment>
                        <Menu.Item>
                            <NavLink to="/editor/new">Create a Moment</NavLink>
                        </Menu.Item>
                        <Menu.Item>
                            <NavLink to="/facilitator">Facilitator</NavLink>
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
            <Route path="/moment/:scenarioId" component={Scenario} />
            <Route path="/editor/:id" component={Editor} />
            <Route exact path="/facilitator" component={Facilitator} />
            <Route exact path="/logout" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route path="/login/new" component={CreateAccount} />
        </React.Fragment>
    );
};

export default Routes;
