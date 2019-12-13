import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AccountAdmin from '@client/components/AccountAdmin';
import Cohorts from '@client/components/Facilitator/Components/Cohorts';
import Cohort from '@client/components/Facilitator/Components/Cohorts/Cohort';
import ConfirmAuth from '@client/components/ConfirmAuth';
import CreateAccount from '@client/components/CreateAccount';
import LoginRoutePromptModal from '@client/components/Login/LoginRoutePromptModal';
import CreateAnonymousAccount from '@client/components/CreateAccount/CreateAnonymousAccount';
import Editor from '@client/components/Editor';
import Login from '@client/components/Login';
import Researcher from '@client/components/Researcher';
import Run from '@client/components/Run';
import {
    CopyScenario,
    Logout,
    InterceptAnonymizableRoute,
    NewScenario,
    RedirectRouteForActiveSession,
    ScenariosListAll,
    ScenariosListAuthor,
    ScenariosListCommunity,
    ScenariosListContinue,
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
                path="/scenarios/continue"
                component={ScenariosListContinue}
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
