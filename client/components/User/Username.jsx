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

const fragmentCache = {};
const displayableNameCache = {};

class Username extends Component {
  constructor(props) {
    super(props);
    const { id, personalname, username } = this.props;

    if (!displayableNameCache[id]) {
      displayableNameCache[id] = personalname || username;
    }

    this.displayableName = displayableNameCache[id];
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
    return this.displayableName;
  }
  render() {
    const { id, roles } = this.props;
    const key = Identity.key({ id, roles });

    if (fragmentCache[key]) {
      return fragmentCache[key];
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

    fragmentCache[key] = (
      <Fragment>
        <Text key={key} title={this.title}>{this.displayableName}</Text> {icon}
      </Fragment>
    );

    return fragmentCache[key];
  }
}

Username.propTypes = {
  id: PropTypes.number,
  is_anonymous: PropTypes.bool,
  is_super: PropTypes.bool,
  is_owner: PropTypes.bool,
  personalname: PropTypes.string,
  roles: PropTypes.array,
  username: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  const { user, usersById } = state;

  // Get the site-wide user because this component can
  // be called with a Cohort User or Scenario User and
  // those will have different roles.
  const siteUser =
    ownProps.id === user.id ? user : usersById[ownProps.id] || { roles: [] };

  const mergedUser = Object.assign({}, ownProps, siteUser);
  const roles = (ownProps.roles || []).concat(siteUser.roles);
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

WrappedComponent.displayableName = user => {
  return displayableNameCache[user.id];
};

export default WrappedComponent;
