import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountAdmin from '@client/components/AccountAdmin';
import Cohort from '@client/components/Facilitator/Components/Cohorts/Cohort';
import ConfirmAuth from '@client/components/ConfirmAuth';
import CreateAccount from '@client/components/CreateAccount';
import LoginRoutePromptModal from '@client/components/Login/LoginRoutePromptModal';
import CreateAnonymousAccount from '@client/components/CreateAccount/CreateAnonymousAccount';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import Login from '@client/components/Login';
import { Logout } from './RouteComponents';
import { NewScenario } from './RouteComponents';
import Researcher from '@client/components/Researcher';
import Run from '@client/components/Run';
import {
    InterceptAnonymizableRoute,
    RedirectRouteForActiveSession,
    ScenariosListAll,
    ScenariosListAuthor,
    ScenariosListCommunity,
    ScenariosListContinue,
    ScenariosListOfficial
} from './RouteComponents';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={ScenariosListAll} />
            <Route
                exact
                path="/author/:username"
                component={ScenariosListAuthor}
            />
            <Route exact path="/continue" component={ScenariosListContinue} />
            <Route exact path="/official" component={ScenariosListOfficial} />
            <Route exact path="/community" component={ScenariosListCommunity} />
            <InterceptAnonymizableRoute path="/run/:scenarioId/slide/:activeSlideIndex">
                <Route component={Run} />
            </InterceptAnonymizableRoute>
            <InterceptAnonymizableRoute path="/run/:scenarioId">
                <Route component={Run} />
            </InterceptAnonymizableRoute>

            <InterceptAnonymizableRoute path="/cohort/:cohortId/run/:scenarioId/slide/:activeSlideIndex">
                <Route render={props => <Run {...props} />} />
            </InterceptAnonymizableRoute>

            <InterceptAnonymizableRoute path="/cohort/:cohortId/run/:scenarioId">
                <Route render={props => <Run {...props} />} />
            </InterceptAnonymizableRoute>

            <ConfirmAuth
                exact
                path="/account-administration"
                requiredPermission="edit_permissions"
            >
                <Route component={AccountAdmin} />
            </ConfirmAuth>
            <ConfirmAuth
                exact
                path="/cohorts"
                requiredPermission="view_all_cohorts"
            >
                <Route
                    component={props => (
                        <Facilitator {...props} activeTab="cohorts" />
                    )}
                />
            </ConfirmAuth>
            <InterceptAnonymizableRoute exact path="/cohort/:id">
                <Route
                    render={props => <Cohort {...props} activeTab="cohort" />}
                />
            </InterceptAnonymizableRoute>

            <ConfirmAuth
                path="/cohort"
                requiredPermission="view_invited_cohorts"
            >
                <Route
                    render={props => <Cohort {...props} activeTab="cohort" />}
                />
            </ConfirmAuth>

            <ConfirmAuth
                exact
                path="/cohort/:id/runs"
                requiredPermission="view_run_data"
            >
                <Route
                    component={props => <Cohort {...props} activeTab="runs" />}
                />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/new"
                requiredPermission="create_scenario"
            >
                <Route component={NewScenario} />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/:id"
                requiredPermission="create_scenario"
            >
                <Route component={Editor} />
            </ConfirmAuth>
            <ConfirmAuth path="/research" requiredPermission="view_run_data">
                <Route component={Researcher} />
            </ConfirmAuth>
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/login" component={Login} />

            <RedirectRouteForActiveSession exact path="/login/create-account">
                <Route component={LoginRoutePromptModal} />
            </RedirectRouteForActiveSession>
            <RedirectRouteForActiveSession exact path="/login/new">
                <Route component={CreateAccount} />
            </RedirectRouteForActiveSession>
            <Route
                exact
                path="/login/anonymous"
                component={CreateAnonymousAccount}
            />
        </Switch>
    );
};

export default Routes;
