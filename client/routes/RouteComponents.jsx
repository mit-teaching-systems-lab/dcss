import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import Editor from '@components/Editor';
import Login from '@components/Login';
import LoginRoutePromptModal from '@components/Login/LoginRoutePromptModal';
import ScenariosList from '@components/ScenariosList';

/**
 * Special case components for solving routing issues. Component state
 * doesn't update when navigating to exact same component.
 */

export const NewScenario = props => {
  return <Editor {...props} isNewScenario={true} />;
};

export const CopyScenario = props => {
  return <Editor {...props} isCopyScenario={true} />;
};

export const ScenariosListAll = props => {
  return <ScenariosList {...props} category="all" />;
};

export const ScenariosListAuthor = props => {
  return <ScenariosList {...props} category="author" />;
};

export const ScenariosListCommunity = props => {
  return <ScenariosList {...props} category="community" />;
};

export const ScenariosListOfficial = props => {
  return <ScenariosList {...props} category="official" />;
};

export const Logout = props => {
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
      render={props => {
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
  return (
    <Route
      {...rest}
      render={() => {
        if (!isLoggedIn) {
          return children;
        }
        location.href = '/';
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
  return (
    <Route
      {...rest}
      render={() => {
        if (isLoggedIn) {
          return children;
        }
        location.href = '/login';
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
