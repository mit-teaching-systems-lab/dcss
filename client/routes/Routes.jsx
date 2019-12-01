import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import ScenariosList from '@client/components/ScenariosList';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import AccountAdmin from '@client/components/AccountAdmin';
import Login from '@client/components/Login';
import LoginRoutePromptModal from '@client/components/Login/LoginRoutePromptModal';
import CreateAccount from '@client/components/CreateAccount';
import CreateAnonymousAccount from '@client/components/CreateAccount/CreateAnonymousAccount';
import Run from '@client/components/Run';
import Researcher from '@client/components/Researcher';

import Session from '@client/util/session';

// Special case component for solving new scenario routing issue.
// Previously the route wouldn't update to the same Editor component.
const NewScenario = props => {
    return <Editor {...props} isNewScenario={true} />;
};

const Logout = props => {
    return <Login {...props} mode="logout" />;
};

const InterceptAnonymizableRoute = ({ children, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                return Session.isSessionActive() ? (
                    children
                ) : (
                    <LoginRoutePromptModal {...props} />
                );
            }}
        />
    );
};

InterceptAnonymizableRoute.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
};

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={ScenariosList} />
            <Route exact path="/official" component={ScenariosList} />
            <Route exact path="/community" component={ScenariosList} />
            <InterceptAnonymizableRoute path="/run/:scenarioId/:activeSlideIndex">
                <Route component={Run} />
            </InterceptAnonymizableRoute>
            <InterceptAnonymizableRoute path="/run/:scenarioId">
                <Route component={Run} />
            </InterceptAnonymizableRoute>
            <Route exact path="/editor/new" component={NewScenario} />
            <Route path="/editor/:id" component={Editor} />
            <Route exact path="/cohorts" component={Facilitator} />
            <Route
                exact
                path="/account-administration"
                component={AccountAdmin}
            />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/login/new" component={CreateAccount} />
            <Route
                exact
                path="/login/anonymous"
                component={CreateAnonymousAccount}
            />
            <Route exact path="/researcher" component={Researcher} />
        </Switch>
    );
};

export default Routes;
