import React from 'react';
import {
    Route,
    Switch,
    NavLink,
    BrowserRouter as Router
} from 'react-router-dom';
import { Dropdown, Menu } from 'semantic-ui-react';

import ScenariosList from '@client/components/ScenariosList';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import AccountAdmin from '@client/components/AccountAdmin';
import Login from '@client/components/Login';
import CreateAccount from '@client/components/CreateAccount';
import Run from '@client/components/Run';

import Session from '@client/util/session';

Session.timeout();

// Special case component for solving new scenario routing issue.
// Previously the route wouldn't update to the same Editor component.
const NewScenario = props => {
    return <Editor {...props} isNewScenario={true} />;
};

const Navigation = () => {
    return (
        <Menu className="nav">
            <Menu.Item>
                <NavLink to="/">Teacher Moments</NavLink>
            </Menu.Item>

            <Menu.Menu>
                <Dropdown simple item text="Curated">
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <NavLink to="/official">Official</NavLink>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <NavLink to="/community">Community</NavLink>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
            {Session.isSessionActive() && (
                <React.Fragment>
                    <Menu.Item>
                        <NavLink exact to="/editor/new">
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
    );
};
const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={ScenariosList} />
            <Route exact path="/official" component={ScenariosList} />
            <Route exact path="/community" component={ScenariosList} />
            <Route path="/run/:scenarioId/:activeSlideIndex" component={Run} />
            <Route path="/run/:scenarioId" component={Run} />
            <Route exact path="/editor/new" component={NewScenario} />
            <Route path="/editor/:id" component={Editor} />
            <Route exact path="/facilitator" component={Facilitator} />
            <Route exact path="/admin" component={AccountAdmin} />
            <Route exact path="/logout" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route path="/login/new" component={CreateAccount} />
        </Switch>
    );
};

function App() {
    return (
        <Router>
            <Navigation />
            <Routes />
        </Router>
    );
}
export default App;
