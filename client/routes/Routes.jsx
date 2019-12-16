import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountAdmin from '@components/AccountAdmin';
import Cohorts from '@components/Facilitator/Components/Cohorts';
import Cohort from '@components/Facilitator/Components/Cohorts/Cohort';
import ConfirmAuth from '@components/ConfirmAuth';
import CreateAccount from '@components/CreateAccount';
import CreateAnonymousAccount from '@components/CreateAccount/CreateAnonymousAccount';
import Editor from '@components/Editor';
import LoginRoutePromptModal from '@components/Login/LoginRoutePromptModal';
import Login from '@components/Login';
import MyScenarios from '@components/MyScenarios';

import Researcher from '@components/Researcher';
import Run from '@components/Run';
import {
    CopyScenario,
    Logout,
    InterceptAnonymizableRoute,
    NewScenario,
    RedirectRouteForActiveSession,
    ScenariosListAll,
    ScenariosListAuthor,
    ScenariosListCommunity,
    ScenariosListOfficial
} from './RouteComponents';

const makeEditorProps = props => ({
    ...props,
    activeSlideIndex: Number(props.match.params.index || 0),
    scenarioId: props.match.params.id
});

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={ScenariosListAll} />
            <Route exact path="/scenarios/" component={ScenariosListAll} />
            <Route
                exact
                path="/scenarios/author/:username"
                component={ScenariosListAuthor}
            />
            <Route
                exact
                path="/scenarios/official"
                component={ScenariosListOfficial}
            />
            <Route
                exact
                path="/scenarios/community"
                component={ScenariosListCommunity}
            />
            <Route exact path="/my-scenario-data/" component={MyScenarios} />
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

            <ConfirmAuth path="/cohorts" requiredPermission="view_own_cohorts">
                <Route
                    render={props => <Cohorts {...props} activeTab="cohorts" />}
                />
            </ConfirmAuth>

            <InterceptAnonymizableRoute exact path="/cohort/:id">
                <Route
                    render={props => <Cohort {...props} activeTab="cohort" />}
                />
            </InterceptAnonymizableRoute>

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
                path="/editor/copy/:id"
                requiredPermission="create_scenario"
            >
                <Route component={CopyScenario} />
            </ConfirmAuth>

            <ConfirmAuth
                path="/editor/:id/scenario"
                requiredPermission="create_scenario"
            >
                <Route
                    render={props => {
                        return (
                            <Editor
                                {...makeEditorProps(props)}
                                activeTab="scenario"
                            />
                        );
                    }}
                />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/:id/slides/:activeSlideIndex"
                requiredPermission="create_scenario"
            >
                <Route
                    render={props => {
                        return (
                            <Editor
                                {...makeEditorProps(props)}
                                activeTab="slides"
                            />
                        );
                    }}
                />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/:id/slides"
                requiredPermission="create_scenario"
            >
                <Route
                    render={props => {
                        return (
                            <Editor
                                {...makeEditorProps(props)}
                                activeTab="slides"
                            />
                        );
                    }}
                />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/:id/preview/:activeSlideIndex"
                requiredPermission="create_scenario"
            >
                <Route
                    render={props => {
                        return (
                            <Editor
                                {...makeEditorProps(props)}
                                activeTab="preview"
                            />
                        );
                    }}
                />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/:id/preview"
                requiredPermission="create_scenario"
            >
                <Route
                    render={props => {
                        return (
                            <Editor
                                {...makeEditorProps(props)}
                                activeTab="preview"
                            />
                        );
                    }}
                />
            </ConfirmAuth>
            <ConfirmAuth
                path="/editor/:id"
                requiredPermission="create_scenario"
            >
                <Route
                    render={props => {
                        return (
                            <Editor
                                {...makeEditorProps(props)}
                                activeTab="scenario"
                            />
                        );
                    }}
                />
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
