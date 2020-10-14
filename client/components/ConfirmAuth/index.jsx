import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const ConfirmAuth = ({
  children,
  isAuthorized,
  permissions = [],
  requiredPermission,
  ...rest
}) => {
  let asksPermission = requiredPermission !== undefined;
  let asksIsAuthorized = isAuthorized !== undefined;
  let isAccessGranted = false;

  if (asksPermission) {
    isAccessGranted = permissions.includes(requiredPermission);
  }

  if (asksIsAuthorized) {
    isAccessGranted = isAuthorized;
  }

  if (asksPermission && asksIsAuthorized) {
    isAccessGranted = isAuthorized && permissions.includes(requiredPermission);
  }

  return (
    <Route
      {...rest}
      render={() => {
        return isAccessGranted ? children : null;
      }}
    />
  );
};

const mapStateToProps = state => {
  const { isLoggedIn, username, permissions } = state.login;
  return { isLoggedIn, username, permissions };
};

ConfirmAuth.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  isAuthorized: PropTypes.bool,
  permissions: PropTypes.node,
  requiredPermission: PropTypes.string
};

export default connect(mapStateToProps, null)(ConfirmAuth);
