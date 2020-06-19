import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import Admin from '@components/Admin';
import Cohorts from '@components/Cohorts';
import Cohort from '@components/Cohorts/Cohort';
import ConfirmAuth from '@components/ConfirmAuth';
import CreateAccount from '@components/CreateAccount';
import CreateAnonymousAccount from '@components/CreateAccount/CreateAnonymousAccount';
import Editor from '@components/Editor';
import ForOhFor from '@components/ForOhFor';
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
  RedirectRouteForInactiveSession,
  ScenariosListAll,
  ScenariosListAuthor,
  ScenariosListCommunity,
  ScenariosListOfficial
} from './RouteComponents';

const makeEditorProps = props => ({
  ...props,
  activeNonZeroSlideIndex: Number(props.match.params.index || 1),
  scenarioId: props.match.params.id
});

const Routes = ({ isLoggedIn }) => {
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
        isLoggedIn={isLoggedIn}
        exact
        path="/my-scenario-data"
      >
        <Route component={MyScenarios} />
      </RedirectRouteForInactiveSession>

      <InterceptAnonymizableRoute
        isLoggedIn={isLoggedIn}
        path="/run/:scenarioId/slide/:activeRunSlideIndex"
      >
        <Route render={props => <Run {...props} />} />
      </InterceptAnonymizableRoute>
      <InterceptAnonymizableRoute
        isLoggedIn={isLoggedIn}
        path="/run/:scenarioId"
      >
        <Route component={Run} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        isLoggedIn={isLoggedIn}
        path="/cohort/:cohortId/run/:scenarioId/slide/:activeRunSlideIndex"
      >
        <Route render={props => <Run {...props} />} />
      </InterceptAnonymizableRoute>

      <InterceptAnonymizableRoute
        isLoggedIn={isLoggedIn}
        path="/cohort/:cohortId/run/:scenarioId"
      >
        <Route render={props => <Run {...props} />} />
      </InterceptAnonymizableRoute>

      <RedirectRouteForInactiveSession isLoggedIn={isLoggedIn} path="/admin">
        <ConfirmAuth path="/admin" requiredPermission="edit_permissions">
          <Route
            render={props => <Admin {...props} isLoggedIn={isLoggedIn} />}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <ConfirmAuth path="/cohorts" requiredPermission="view_own_cohorts">
        <Route render={props => <Cohorts {...props} activeTab="cohorts" />} />
      </ConfirmAuth>

      <InterceptAnonymizableRoute
        isLoggedIn={isLoggedIn}
        exact
        path="/cohort/:id"
      >
        <Route render={props => <Cohort {...props} activeTab="cohort" />} />
      </InterceptAnonymizableRoute>

      <ConfirmAuth
        exact
        path="/cohort/:id/runs"
        requiredPermission="view_run_data"
      >
        <Route component={props => <Cohort {...props} activeTab="runs" />} />
      </ConfirmAuth>
      <ConfirmAuth path="/editor/new" requiredPermission="create_scenario">
        <Route component={NewScenario} />
      </ConfirmAuth>
      <ConfirmAuth path="/editor/copy/:id" requiredPermission="create_scenario">
        <Route component={CopyScenario} />
      </ConfirmAuth>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id/scenario/:activeNonZeroSlideIndex"
      >
        <ConfirmAuth
          path="/editor/:id/scenario/:activeNonZeroSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={props => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id/scenario"
      >
        <ConfirmAuth
          path="/editor/:id/scenario"
          requiredPermission="create_scenario"
        >
          <Route
            render={props => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id/slides/:activeNonZeroSlideIndex"
      >
        <ConfirmAuth
          path="/editor/:id/slides/:activeNonZeroSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={props => {
              return <Editor {...makeEditorProps(props)} activeTab="slides" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id/slides"
      >
        <ConfirmAuth
          path="/editor/:id/slides"
          requiredPermission="create_scenario"
        >
          <Route
            render={props => {
              return <Editor {...makeEditorProps(props)} activeTab="slides" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id/preview/:activeRunSlideIndex"
      >
        <ConfirmAuth
          path="/editor/:id/preview/:activeRunSlideIndex"
          requiredPermission="create_scenario"
        >
          <Route
            render={props => {
              return <Editor {...makeEditorProps(props)} activeTab="preview" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id/preview"
      >
        <ConfirmAuth
          path="/editor/:id/preview"
          requiredPermission="create_scenario"
        >
          <Route
            render={props => {
              return <Editor {...makeEditorProps(props)} activeTab="preview" />;
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession
        isLoggedIn={isLoggedIn}
        path="/editor/:id"
      >
        <ConfirmAuth path="/editor/:id" requiredPermission="create_scenario">
          <Route
            render={props => {
              return (
                <Editor {...makeEditorProps(props)} activeTab="scenario" />
              );
            }}
          />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <RedirectRouteForInactiveSession isLoggedIn={isLoggedIn} path="/research">
        <ConfirmAuth path="/research" requiredPermission="view_run_data">
          <Route component={Researcher} />
        </ConfirmAuth>
      </RedirectRouteForInactiveSession>

      <Route exact path="/logout" component={Logout} />
      <Route exact path="/login" component={Login} />

      <RedirectRouteForActiveSession
        isLoggedIn={isLoggedIn}
        exact
        path="/login/create-account"
      >
        <Route component={LoginRoutePromptModal} />
      </RedirectRouteForActiveSession>
      <RedirectRouteForActiveSession
        isLoggedIn={isLoggedIn}
        exact
        path="/login/new"
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
