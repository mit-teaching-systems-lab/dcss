import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import escapeRegExp from 'lodash.escaperegexp';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { Icon, Input, Menu, Table } from '@components/UI';

import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import UsersTable from '@components/User/UsersTable';
import { computeItemsRowsPerPage } from '@utils/Layout';
import { getUsers } from '@actions/users';
import { SITE_ROLE_GROUPS } from '@components/Admin/constants';

const { super_admin, admin, facilitator, researcher } = SITE_ROLE_GROUPS;

class Users extends Component {
  constructor(props) {
    super(props);

    const activePage = Number(this.props.activePage);

    this.state = {
      activePage,
      isReady: false,
      id: null,
      results: []
    };

    // This is used as a back up copy of
    // users when the list is filtered
    // by searching.
    this.users = [];
    this.onPageChange = this.onPageChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
  }

  async componentDidMount() {
    if (!this.props.users.length) {
      await this.props.getUsers();
    }

    this.users = this.props.users.slice();
    this.setState({
      isReady: true
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      ...this.state,
      activePage
    });
  }

  onUserSearchChange(event, { value }) {
    if (value === '') {
      this.setState({
        activePage: 1,
        results: []
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const results = this.props.users.filter(({ username, email, roles }) => {
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

    this.setState({
      activePage: 1,
      results
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

    const sourceUsers = this.state.results.length
      ? this.state.results
      : this.props.users;

    const totalUserCount = sourceUsers.length;
    const pages = Math.ceil(totalUserCount / rowsPerPage);
    const index = (activePage - 1) * rowsPerPage;
    const users = sourceUsers.slice(index, index + rowsPerPage);
    const columns = {
      username: {
        className: 'users__col-large',
        content: 'Username'
      },
      email: {
        className: 'users__col-large dl__hidden-on-mobile',
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
      accum[user.id] = [
        user.username,
        <Table.Cell className="dl__hidden-on-mobile" key={Identity.key(user)}>
          {user.email}
        </Table.Cell>
      ];
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
              <Menu.Item.Tabbable key="menu-item-account-administration">
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="user" />
                  <Icon corner="top right" name="cogs" color="orange" />
                </Icon.Group>
                Users ({totalUserCount})
              </Menu.Item.Tabbable>
            ],
            right: [
              <Menu.Menu key="menu-item-account-search" position="right">
                <Menu.Item.Tabbable
                  key="menu-item-search-accounts"
                  name="Search user accounts"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onUserSearchChange}
                  />
                </Menu.Item.Tabbable>
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
  activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getUsers: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  user: PropTypes.object,
  users: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const { user } = state;
  const users = ownProps.users || state.users;
  const activePage = ownProps.activePage || 1;
  return { activePage, user, users };
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
