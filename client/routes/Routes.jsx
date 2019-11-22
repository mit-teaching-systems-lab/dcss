import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ScenariosList from '@client/components/ScenariosList';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import AccountAdmin from '@client/components/AccountAdmin';
import Login from '@client/components/Login';
import CreateAccount from '@client/components/CreateAccount';
import Run from '@client/components/Run';

// Special case component for solving new scenario routing issue.
// Previously the route wouldn't update to the same Editor component.
const NewScenario = props => {
    return <Editor {...props} isNewScenario={true} />;
};

const Logout = props => {
    return <Login {...props} mode="logout" />;
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
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/login" component={Login} />
            <Route path="/login/new" component={CreateAccount} />
        </Switch>
    );
};

export default Routes;
