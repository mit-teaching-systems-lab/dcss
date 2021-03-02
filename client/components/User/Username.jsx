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
const displayableNameCache = {};

const makeDisplayables = ({ id, personalname, roles, username }) => {
  const displayableName = personalname || username;
  const title = personalname ? `${personalname} (${username})` : username;
  let icon = null;

  if (roles && roles.length) {
    if (roles.includes('researcher')) {
      icon = ICON_RESEARCHER;
    }
    if (roles.includes('facilitator')) {
      icon = ICON_FACILITATOR;
    }
    if (roles.includes('admin')) {
      icon = ICON_ADMIN;
    }
    if (roles.includes('super_admin')) {
      icon = ICON_SUPER;
    }
  }

  return {
    displayableName,
    icon,
    id,
    roles,
    title
  };
};

class Username extends Component {
  constructor(props) {
    super(props);
    this.displayableName = '';
    this.title = '';
    this.icon = null;
  }
  toString() {
    return this.displayableName;
  }
  render() {
    const { possessive } = this.props;
    const { displayableName, id, icon, roles, title } = makeDisplayables(
      this.props.user
    );
    const key = Identity.key({ id, roles });

    if (!displayableNameCache[id]) {
      displayableNameCache[id] = displayableName;
    }

    this.displayableName = displayableNameCache[id];
    this.title = title;
    this.icon = icon ? icon : null;

    return (
      <Fragment>
        <Text key={key} title={title}>
          {displayableName}
        </Text>
        {possessive ? "'s" : ''}{' '}
        {this.icon ? (
          <Icon
            size="small"
            {...this.icon}
            style={{
              marginRight: '0',
              marginBottom: '0.3em',
              marginLeft: '0.25em',
              opacity: '0.25'
            }}
          />
        ) : null}
      </Fragment>
    );
  }
}

Username.propTypes = {
  possessive: PropTypes.bool,
  user: PropTypes.object
};

Username.defaultProps = {
  possessive: false
};

const mapStateToProps = (state, ownProps) => {
  const intendedUser = ownProps.user || state.user;
  // Get the site-wide user because this component can
  // be called with a Cohort User or Scenario User.
  const siteUser = state.usersById[intendedUser.id] || { roles: [] };
  // Merge the roles (there can be no unintended collision here)
  const roles = (intendedUser.roles || []).concat(siteUser.roles);
  const user = {
    ...siteUser,
    ...intendedUser,
    roles
  };
  return {
    user
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

WrappedComponent.getDisplayables = user => {
  return makeDisplayables(user);
};

export default WrappedComponent;
