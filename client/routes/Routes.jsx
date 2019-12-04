import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountAdmin from '@client/components/AccountAdmin';
import Cohort from '@client/components/Facilitator/Components/Cohorts/Cohort';
import ConfirmAuth from '@client/components/ConfirmAuth';
import CreateAccount from '@client/components/CreateAccount';
import CreateAnonymousAccount from '@client/components/CreateAccount/CreateAnonymousAccount';
import Editor from '@client/components/Editor';
import Facilitator from '@client/components/Facilitator';
import { InterceptAnonymizableRoute } from './RouteComponents';
import Login from '@client/components/Login';
import { Logout } from './RouteComponents';
import { NewScenario } from './RouteComponents';
import Researcher from '@client/components/Researcher';
import Run from '@client/components/Run';
import {
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
            <InterceptAnonymizableRoute path="/run/:scenarioId/:activeSlideIndex">
                <Route component={Run} />
            </InterceptAnonymizableRoute>
            <InterceptAnonymizableRoute path="/run/:scenarioId">
                <Route component={Run} />
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
                requiredPermission="view_run_data"
            >
                <Route
                    component={props => (
                        <Facilitator {...props} activeTab="cohorts" />
                    )}
                />
            </ConfirmAuth>
            <ConfirmAuth
                exact
                path="/facilitator/cohorts"
                requiredPermission="view_run_data"
            >
                <Route
                    component={props => (
                        <Facilitator {...props} activeTab="cohorts" />
                    )}
                />
            </ConfirmAuth>
            <ConfirmAuth
                exact
                path="/facilitator/search"
                requiredPermission="view_run_data"
            >
                <Route
                    component={props => (
                        <Facilitator {...props} activeTab="search" />
                    )}
                />
            </ConfirmAuth>
            <ConfirmAuth
                exact
                path="/cohort/:id"
                requiredPermission="view_run_data"
            >
                <Route
                    component={props => (
                        <Cohort {...props} activeTab="cohort" />
                    )}
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
            <ConfirmAuth path="/researcher" requiredPermission="view_run_data">
                <Route component={Researcher} />
            </ConfirmAuth>
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/login/new" component={CreateAccount} />
            <Route
                exact
                path="/login/anonymous"
                component={CreateAnonymousAccount}
            />
        </Switch>
    );
};

export default Routes;
