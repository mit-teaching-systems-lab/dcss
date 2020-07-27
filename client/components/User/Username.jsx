import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Icon, Text } from '@components/UI';

const ICON_SUPER = { className: 'chess queen', title: 'Super' };
const ICON_ADMIN = { className: 'chess rook', title: 'Admin' };
const ICON_FACILITATOR = {
  className: 'chalkboard teacher',
  title: 'Facilitator'
};
const ICON_RESEARCHER = { className: 'user graduate', title: 'Researcher' };

const cache = {};

class Username extends Component {
  constructor(props) {
    super(props);
    const { personalname, username } = this.props;

    this.displayName = personalname || username;
    this.title = personalname ? `${personalname} (${username})` : username;

    const { roles } = this.props;

    let iconProps = null;

    if (roles && roles.length) {
      if (roles.includes('researcher')) {
        iconProps = ICON_RESEARCHER;
      }
      if (roles.includes('facilitator')) {
        iconProps = ICON_FACILITATOR;
      }
      if (roles.includes('admin')) {
        iconProps = ICON_ADMIN;
      }
      if (roles.includes('super_admin')) {
        iconProps = ICON_SUPER;
      }
    }

    this.iconProps = iconProps;
  }
  toString() {
    return this.displayName;
  }
  render() {
    const { id, roles } = this.props;

    const key = Identity.key({ id, roles });
    const cached = cache[key];

    if (cached) {
      return cached;
    }

    const icon = this.iconProps ? (
      <Icon
        size="small"
        {...this.iconProps}
        style={{
          marginRight: '0',
          marginBottom: '0.3em',
          marginLeft: '0.25em',
          opacity: '0.25'
        }}
      />
    ) : null;

    cache[key] = (
      <Fragment>
        <Text title={this.title}>{this.displayName}</Text> {icon}
      </Fragment>
    );

    return cache[key];
  }
}

Username.propTypes = {
  id: PropTypes.number,
  is_super: PropTypes.bool,
  personalname: PropTypes.string,
  roles: PropTypes.array,
  username: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  const { user, usersById } = state;

  // Get the site-wide user because this component can
  // be called with a Cohort User or Scenario User and
  // those will have different roles.
  const stateUser =
    ownProps.id === user.id ? user : usersById[ownProps.id] || { roles: [] };

  const mergedUser = Object.assign({}, ownProps, stateUser);
  const roles = ownProps.roles.concat(stateUser.roles);

  return {
    ...mergedUser,
    roles
  };
};

const WrappedComponent = connect(
  mapStateToProps,
  null
)(Username);

WrappedComponent.from = user => {
  return new Username(user);
};

export default WrappedComponent;
