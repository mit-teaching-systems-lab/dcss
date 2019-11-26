import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

const ConfirmAuth = ({
    children,
    isAuthorized,
    permissions,
    requiredPermission,
    ...rest
}) => {
    const AuthConfirmed =
        isAuthorized || permissions.includes(requiredPermission);

    return (
        <Route
            {...rest}
            render={() => {
                return AuthConfirmed ? children : null;
            }}
        />
    );
};

function mapStateToProps(state) {
    const { isLoggedIn, username, permissions } = state.login;
    return { isLoggedIn, username, permissions };
}

ConfirmAuth.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired,
    isAuthorized: PropTypes.bool,
    permissions: PropTypes.node,
    requiredPermission: PropTypes.string
};

export default connect(
    mapStateToProps,
    null
)(ConfirmAuth);
