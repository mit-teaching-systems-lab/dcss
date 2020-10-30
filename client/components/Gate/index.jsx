import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const Gate = ({
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

  const protectedChild = children || null;

  return (
    <Route
      {...rest}
      render={() => {
        return isAccessGranted ? protectedChild : null;
      }}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const { isLoggedIn, permissions } = state.session;
  return {
    children: ownProps.children || null,
    isLoggedIn,
    permissions
  };
};

Gate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  isAuthorized: PropTypes.bool,
  permissions: PropTypes.node,
  requiredPermission: PropTypes.string
};

export default connect(
  mapStateToProps,
  null
)(Gate);
