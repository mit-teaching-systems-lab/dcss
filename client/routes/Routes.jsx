import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Admin from '@components/Admin';
import Chat from '@components/Chat';
import Cohort from '@components/Cohorts/Cohort';
import Cohorts from '@components/Cohorts';
import Gate from '@components/Gate';
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
import UserInvites from '@components/User/UserInvites';
import QueryString from '@utils/QueryString';

const makeEditorProps = (props = {}) => ({
  ...props,
  activeNonZeroSlideIndex: Number(props.match.params.index || 1),
  scenarioId: props.match.params.id
});

const Routes = ({ isLoggedIn, user }) => {
  const routeRenderAdmin = (props = {}) => {
    const { page: activePage = 1, id = null } = QueryString.parse(
      props.location.search
    );
    const activeTab = props?.match?.params?.activeTab || 'access';
    const adminProps = {
      ...props,
      activePage,
      activeTab,
      id
    };
    return <Admin {...adminProps} isLoggedIn={isLoggedIn} />;
  };
  const routeRenderChat = (props = {}) => <Chat {...props} />;
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

  const routeRenderInvite = props => {
    // eslint-disable-next-line react/prop-types
    const { redirect } = props.location.state;
    // eslint-disable-next-line react/prop-types
    const { status, code } = props.match.params;
    return (
      <UserInvites
        status={status}
        code={code}
        open={false}
        redirect={redirect}
        user={user}
      />
    );
  };

  const routeRenderInvites = props => (
    <UserInvites {...props} open={true} user={user} />
  );

  return (
    <Switch>
      <Route exact path="/" component={ScenariosListAll} />

      <InterceptAnonymizableRoute path="/chat" isLoggedIn={isLoggedIn}>
        <Route render={routeRenderChat} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        path="/invite/:status/:code"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderInvite} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute path="/invites" isLoggedIn={isLoggedIn}>
        <Route render={routeRenderInvites} />
      </InterceptAnonymizableRoute>

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
        path="/run/:scenarioId/code/:code/slide/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        path="/run/:scenarioId/chat/:chatId/slide/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

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
        path="/cohort/:cohortId/run/:scenarioId/chat/:chatId/slide/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderRun} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        path="/cohort/:cohortId/run/:scenarioId/code/:code/slide/:activeRunSlideIndex"
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

      <RedirectRouteForInactiveSession
        path="/admin/:activeTab"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/admin/:activeTab" requiredPermission="edit_permissions">
          <Route render={routeRenderAdmin} />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession path="/admin" isLoggedIn={isLoggedIn}>
        <Gate path="/admin" requiredPermission="edit_permissions">
          <Route render={routeRenderAdmin} />
        </Gate>
      </RedirectRouteForInactiveSession>

      <Gate path="/cohorts/:filter" requiredPermission="view_own_cohorts">
        <Route render={routeRenderCohorts} />
      </Gate>

      <Gate path="/cohorts" requiredPermission="view_own_cohorts">
        <Route render={routeRenderCohorts} />
      </Gate>

      <InterceptAnonymizableRoute
        exact
        path="/cohort/:id"
        isLoggedIn={isLoggedIn}
      >
        <Route render={routeRenderCohort} />
      </InterceptAnonymizableRoute>

      <Gate exact path="/cohort/:id/runs" requiredPermission="view_run_data">
        <Route component={routeRenderCohortRuns} />
      </Gate>
      <Gate path="/editor/new" requiredPermission="create_scenario">
        <Route component={NewScenario} />
      </Gate>
      <Gate path="/editor/copy/:id" requiredPermission="create_scenario">
        <Route component={CopyScenario} />
      </Gate>

      <RedirectRouteForInactiveSession
        path="/editor/:id/scenario/:activeNonZeroSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Gate
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
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/scenario"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/editor/:id/scenario" requiredPermission="create_scenario">
          <Route
            render={(props = {}) => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/slides/:activeNonZeroSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Gate
          path="/editor/:id/slides/:activeNonZeroSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="slides" />;
            }}
          />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/slides"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/editor/:id/slides" requiredPermission="create_scenario">
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="slides" />;
            }}
          />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/preview/:activeRunSlideIndex"
        isLoggedIn={isLoggedIn}
      >
        <Gate
          path="/editor/:id/preview/:activeRunSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="preview" />;
            }}
          />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id/preview"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/editor/:id/preview" requiredPermission="create_scenario">
          <Route
            render={(props = {}) => {
              return <Editor {...makeEditorProps(props)} activeTab="preview" />;
            }}
          />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/editor/:id"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/editor/:id" requiredPermission="create_scenario">
          <Route
            render={(props = {}) => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads/:type/:id/:activePage"
        isLoggedIn={isLoggedIn}
      >
        <Gate
          path="/downloads/:type/:id/:activePage"
          requiredPermission="view_run_data"
        >
          <Route render={routeRenderDownloads} />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads/:type/:id"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/downloads/:type/:id" requiredPermission="view_run_data">
          <Route render={routeRenderDownloads} />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads/:activePage"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/downloads/:activePage" requiredPermission="view_run_data">
          <Route render={routeRenderDownloads} />
        </Gate>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        path="/downloads"
        isLoggedIn={isLoggedIn}
      >
        <Gate path="/downloads" requiredPermission="view_run_data">
          <Route exact component={Downloads} />
        </Gate>
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
  const { isLoggedIn } = state.session;
  const { user } = state;
  return { user, isLoggedIn };
};

export default connect(mapStateToProps)(Routes);
