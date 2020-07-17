import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Text } from '@components/UI';


const ICON_SUPER = { name: 'chess queen', title: 'Super' };
const ICON_ADMIN = { name: 'chess rook', title: 'Admin' };
const ICON_FACILITATOR = { name: 'chalkboard teacher', title: 'Facilitator' };
const ICON_RESEARCHER = { name: 'user graduate', title: 'Researcher' };

class Username extends Component {
  constructor(props) {
    super(props);
    const { personalname, username } = this.props;

    this.displayName = personalname || username;
    this.title = personalname
      ? `${personalname} (${username})`
      : username;
  }
  toString() {
    return this.displayName;
  }
  render() {

    // Get the site-wide user because this component can
    // be called with a Cohort User or Scenario User and
    // those will have different roles.
    const user = this.props.id === this.props.user.id
      ? this.props.user
      : this.props.usersById[this.props.id] || null;

    let iconProps = null;

    if (user) {
      if (user.roles.includes('researcher')) {
        iconProps = ICON_RESEARCHER;
      }
      if (user.roles.includes('facilitator')) {
        iconProps = ICON_FACILITATOR;
      }
      if (user.roles.includes('admin')) {
        iconProps = ICON_ADMIN;
      }
      if (user.roles.includes('super_admin')) {
        iconProps = ICON_SUPER;
      }
    }

    return (
      <Fragment>
        <Text title={this.title}>{this.displayName}</Text>
        {' '}
        {iconProps ? (
          <Icon
            size="small"
            {...iconProps}
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
  id: PropTypes.number,
  is_super: PropTypes.bool,
  personalname: PropTypes.string,
  username: PropTypes.string,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  console.log(state);
  const { user, usersById } = state;
  return { user, usersById };
};

export default connect(
  mapStateToProps,
  null
)(Username);
