import Dashboard from '@components/Dashboard';
import Editor from '@components/Editor';
import Login from '@components/Login';
import LoginRoutePromptModal from '@components/Login/LoginRoutePromptModal';
import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';
import ScenariosList from '@components/ScenariosList';
import Storage from '@utils/Storage';

/**
 * Special case components for solving routing issues. Component state
 * doesn't update when navigating to exact same component.
 */

export const UserDashboard = props => {
  return <Dashboard {...props} />;
};

export const NewScenario = (props = {}) => {
  return <Editor {...props} isNewScenario={true} />;
};

export const CopyScenario = (props = {}) => {
  return <Editor {...props} isCopyScenario={true} />;
};

export const ScenariosListAll = (props = {}) => {
  return <ScenariosList {...props} category="all" />;
};

export const ScenariosListAuthor = (props = {}) => {
  return <ScenariosList {...props} category="author" />;
};

export const ScenariosListCommunity = (props = {}) => {
  return <ScenariosList {...props} category="community" />;
};

export const ScenariosListOfficial = (props = {}) => {
  return <ScenariosList {...props} category="official" />;
};

export const Logout = (props = {}) => {
  return <Login {...props} mode="logout" />;
};

export const InterceptAnonymizableRoute = ({
  children,
  isLoggedIn,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props = {}) => {
        return isLoggedIn ? children : <LoginRoutePromptModal {...props} />;
      }}
    />
  );
};

InterceptAnonymizableRoute.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export const RedirectRouteForActiveSession = ({
  children,
  isLoggedIn,
  ...rest
}) => {
  const { pathname } = Storage.get('location') || { pathname: '/' };
  return (
    <Route
      {...rest}
      render={() => {
        if (!isLoggedIn) {
          return children;
        }
        location.href = pathname;
      }}
    />
  );
};

RedirectRouteForActiveSession.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export const RedirectRouteForInactiveSession = ({
  children,
  isLoggedIn,
  ...rest
}) => {
  const { pathname } = rest.location;
  Storage.set('location', { pathname });
  return (
    <Route
      {...rest}
      render={() => {
        if (isLoggedIn) {
          return children;
        }
        location.href = '/login/create-account';
      }}
    />
  );
};

RedirectRouteForInactiveSession.propTypes = {
  isLoggedIn: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
