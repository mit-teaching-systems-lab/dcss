import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Admin from '@components/Admin';
import Cohort from '@components/Cohorts/Cohort';
import Cohorts from '@components/Cohorts';
import ConfirmAuth from '@components/ConfirmAuth';
import CreateAccount from '@components/CreateAccount';
import CreateAnonymousAccount from '@components/CreateAccount/CreateAnonymousAccount';
import Downloads from '@components/Downloads';
import Editor from '@components/Editor';
import ForOhFor from '@components/ForOhFor';
import History from '@components/History';
import Login from '@components/Login';
import LoginRoutePromptModal from '@components/Login/LoginRoutePromptModal';
import ResetRoutePromptModal from '@components/Login/ResetRoutePromptModal';
import Run from '@components/Run';
import {
  CopyScenario,
  Logout,
  InterceptAnonymizableRoute,
  NewScenario,
  RedirectRouteForActiveSession,
  RedirectRouteForInactiveSession,
  ScenariosListAll,
  ScenariosListAuthor,
  ScenariosListCommunity,
  ScenariosListOfficial
} from './RouteComponents';
import UserSettings from '@components/User/UserSettings';

const makeEditorProps = (props = {}) => ({
  ...props,
  activeNonZeroSlideIndex: Number(props.match.params.index || 1),
  scenarioId: props.match.params.id
});

const Routes = ({ isLoggedIn, user }) => {
  const routeRenderAdmin = (props = {}) => (
    <Admin {...props} isLoggedIn={isLoggedIn} />
  );
  const routeRenderCohorts = (props = {}) => (
    <Cohorts {...props} activeTab="cohorts" />
  );
  const routeRenderCohort = (props = {}) => (
    <Cohort {...props} activeTab="cohort" />
  );
  const routeRenderCohortRuns = (props = {}) => (
    <Cohort {...props} activeTab="runs" />
  );
  const routeRenderDownloads = (props = {}) => <Downloads {...props} />;
  const routeRenderRun = (props = {}) => <Run {...props} />;
  const routeRenderUserSettings = (props = {}) => (
    <UserSettings {...props} user={user} open={true} />
  );

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

      <RedirectRouteForInactiveSession
        path="/history/scenario/:scenarioId/run/:runId"
        isLoggedIn={isLoggedIn}
      >
        <Route component={History} />
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/history/scenario/:scenarioId"
        isLoggedIn={isLoggedIn}
      >
        <Route component={History} />
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        exact
        path="/history"
        isLoggedIn={isLoggedIn}
      >
        <Route component={History} />
      </RedirectRouteForInactiveSession>

      <InterceptAnonymizableRoute
        path="/run/:scenarioId/slide/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        path="/run/:scenarioId"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        path="/cohort/:cohortId/run/:scenarioId/slide/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        path="/cohort/:cohortId/run/:scenarioId"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

      <RedirectRouteForInactiveSession path="/admin" isLoggedIn={isLoggedIn}>
        <ConfirmAuth path="/admin" requiredPermission="edit_permissions">
          <Route render={routeRenderAdmin} />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <ConfirmAuth path="/cohorts" requiredPermission="view_own_cohorts">
        <Route render={routeRenderCohorts} />
      </ConfirmAuth>

      <InterceptAnonymizableRoute
        exact
        path="/cohort/:id"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderCohort} />
      </InterceptAnonymizableRoute>

      <ConfirmAuth
        exact
        path="/cohort/:id/runs"
        requiredPermission="view_run_data"
      >
        <Route component={routeRenderCohortRuns} />
      </ConfirmAuth>
      <ConfirmAuth path="/editor/new" requiredPermission="create_scenario">
        <Route component={NewScenario} />
      </ConfirmAuth>
      <ConfirmAuth path="/editor/copy/:id" requiredPermission="create_scenario">
        <Route component={CopyScenario} />
      </ConfirmAuth>

      <RedirectRouteForInactiveSession
        path="/editor/:id/scenario/:activeNonZeroSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/editor/:id/scenario/:activeNonZeroSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/scenario"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/editor/:id/scenario"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/slides/:activeNonZeroSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/editor/:id/slides/:activeNonZeroSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="slides" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/slides"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/editor/:id/slides"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="slides" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/preview/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/editor/:id/preview/:activeRunSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="preview" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/preview"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/editor/:id/preview"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="preview" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth path="/editor/:id" requiredPermission="create_scenario">
          <Route
            render={(props = {}) => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads/:type/:id/:activePage"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/downloads/:type/:id/:activePage"
          requiredPermission="view_run_data"
        >
          <Route render={routeRenderDownloads} />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads/:type/:id"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/downloads/:type/:id"
          requiredPermission="view_run_data"
        >
          <Route render={routeRenderDownloads} />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads/:activePage"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth
          path="/downloads/:activePage"
          requiredPermission="view_run_data"
        >
          <Route render={routeRenderDownloads} />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads"
        isLoggedIn={isLoggedIn}
      >
        <ConfirmAuth path="/downloads" requiredPermission="view_run_data">
          <Route exact component={Downloads} />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        exact
        path="/settings"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderUserSettings} />
      </RedirectRouteForInactiveSession>

      <Route exact path="/logout" component={Logout} />
      <Route exact path="/login" component={Login} />

      <RedirectRouteForActiveSession
        exact
        path="/login/create-account"
        isLoggedIn={isLoggedIn}
      >
        <Route component={LoginRoutePromptModal} />
      </RedirectRouteForActiveSession>

      <RedirectRouteForActiveSession
        exact
        path="/login/reset"
        isLoggedIn={isLoggedIn}
      >
        <Route component={ResetRoutePromptModal} />
      </RedirectRouteForActiveSession>

      <RedirectRouteForActiveSession
        exact
        path="/login/new"
        isLoggedIn={isLoggedIn}
      >
        <Route component={CreateAccount} />
      </RedirectRouteForActiveSession>

      <Route exact path="/login/anonymous" component={CreateAnonymousAccount} />

      <Route component={ForOhFor} />
    </Switch>
  );
};

Routes.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.login;
  const { user } = state;
  return { user, isLoggedIn };
};

export default connect(mapStateToProps)(Routes);
