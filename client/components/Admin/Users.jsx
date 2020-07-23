import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import escapeRegExp from 'lodash.escaperegexp';
import PropTypes from 'prop-types';
import { Icon, Input, Menu } from '@components/UI';

import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import UsersTable from './UsersTable';
import { computeItemsRowsPerPage } from '@utils/Layout';
import { getUsers } from '@actions/users';
import { SITE_ROLE_GROUPS } from './constants';

const { super_admin, admin, facilitator, researcher } = SITE_ROLE_GROUPS;

class Users extends Component {
  constructor(props) {
    super(props);

    const { users } = this.props;

    this.state = {
      isReady: false,
      activePage: 1,
      users
    };

    // This is used as a back up copy of
    // users when the list is filtered
    // by searching.
    this.users = [];
    this.onPageChange = this.onPageChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
  }

  async componentDidMount() {
    let { users } = this.state;

    if (!users.length) {
      users = await this.props.getUsers();
    }

    this.users = users.slice();
    this.setState({
      isReady: true,
      users
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      ...this.state,
      activePage
    });
  }

  onUserSearchChange(event, { value }) {
    const users = this.users.slice();

    if (value === '') {
      this.setState({
        users
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const results = users.filter(({ username, email, roles }) => {
      if (escapedRegExp.test(username)) {
        return true;
      }
      if (escapedRegExp.test(email)) {
        return true;
      }

      if (escapedRegExp.test(roles.join(' '))) {
        return true;
      }

      return false;
    });

    if (results.length === 0) {
      results.push(...users);
    }

    this.setState({
      activePage: 1,
      users: results
    });
  }

  render() {
    const { onPageChange, onUserSearchChange } = this;
    const { user } = this.props;
    const { isReady, activePage } = this.state;

    const defaultRowCount = 10;
    // known total height of all ui that is not a table row
    const totalUnavailableHeight = 459;
    const itemsRowHeight = 44;
    const itemsPerRow = 1;

    const { rowsPerPage } = computeItemsRowsPerPage({
      defaultRowCount,
      totalUnavailableHeight,
      itemsPerRow,
      itemsRowHeight
    });

    const totalUserCount = this.state.users.length;
    const pages = Math.ceil(totalUserCount / rowsPerPage);
    const index = (activePage - 1) * rowsPerPage;
    const users = this.state.users.slice(index, index + rowsPerPage);
    const columns = {
      username: {
        className: 'users__col-large',
        content: 'Username'
      },
      email: {
        className: 'users__col-large',
        content: 'Email'
      }
    };

    const grantableRoles = {};

    if (user.roles.includes('super_admin')) {
      Object.assign(grantableRoles, super_admin);
    }

    if (user.roles.includes('admin')) {
      Object.assign(grantableRoles, admin);
    }

    if (user.roles.includes('facilitator')) {
      Object.assign(grantableRoles, facilitator);
    }

    if (user.roles.includes('researcher')) {
      Object.assign(grantableRoles, researcher);
    }

    Object.assign(columns, grantableRoles);

    const rows = users.reduce((accum, user) => {
      accum[user.id] = [user.username, user.email];
      return accum;
    }, {});

    const usersTableProps = {
      activePage,
      columns,
      grantableRoles,
      onPageChange,
      pages,
      rows
    };

    return (
      <Fragment>
        <EditorMenu
          type="administration"
          items={{
            left: [
              <Menu.Item key="menu-item-account-administration">
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="user" />
                  <Icon corner="top right" name="cogs" color="orange" />
                </Icon.Group>
                Users ({totalUserCount})
              </Menu.Item>
            ],
            right: [
              <Menu.Menu key="menu-item-account-search" position="right">
                <Menu.Item
                  key="menu-item-search-accounts"
                  name="Search user accounts"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onUserSearchChange}
                  />
                </Menu.Item>
              </Menu.Menu>
            ]
          }}
        />

        {!isReady ? <Loading /> : <UsersTable {...usersTableProps} />}
      </Fragment>
    );
  }
}

Users.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object,
  users: PropTypes.array,
  getUsers: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  let users = state.users;

  if (ownProps.users) {
    users = ownProps.users;
  }
  const { user } = state;
  return { user, users };
};

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Users)
);
