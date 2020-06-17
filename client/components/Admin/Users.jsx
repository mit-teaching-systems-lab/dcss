import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Icon, Input, Menu, Pagination, Table } from 'semantic-ui-react';

import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import UserRows from './UserRows';
import { getUsers } from '@actions/users';

const ROWS_PER_PAGE = 10;

const rolesMap = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  researcher: 'Researcher',
  facilitator: 'Facilitator',
  participant: 'Participant'
};

Object.entries(rolesMap).forEach(([key, value]) => {
  rolesMap[key.toLowerCase()] = value;
  rolesMap[value] = key;
  rolesMap[value.toLowerCase()] = key;
});

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      activePage: 1,
      users: []
    };

    // This is used as a back up copy of
    // users when the list is filtered
    // by searching.
    this.users = [];
    this.onPageChange = this.onPageChange.bind(this);
    this.onUserSearchChange = this.onUserSearchChange.bind(this);
  }

  async componentDidMount() {
    const users = await this.props.getUsers();
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

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
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
    const { isReady, activePage, users } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    const usersPages = Math.ceil(users.length / ROWS_PER_PAGE);
    const usersIndex = (activePage - 1) * ROWS_PER_PAGE;
    const usersSlice = users.slice(usersIndex, usersIndex + ROWS_PER_PAGE);

    const diff = ROWS_PER_PAGE - usersSlice.length;
    const rows = UserRows(usersSlice, diff);

    return (
      <Fragment>
        <EditorMenu
          type="administration"
          items={{
            left: [
              <Menu.Item
                key="menu-item-account-administration"
                className="em__icon-padding"
              >
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="user" />
                  <Icon corner="top right" name="cogs" color="orange" />
                </Icon.Group>
                User Administration ({users.length} users)
              </Menu.Item>
            ],
            right: [
              <Menu.Menu key="menu-item-account-search" position="right">
                <Menu.Item
                  key="menu-item-search-accounts"
                  name="Search user accounts"
                  className="em__icon-padding"
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
        {users.length ? (
          <Table fixed celled style={{ minHeight: '550px' }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="users__col-large">
                  Username
                </Table.HeaderCell>
                <Table.HeaderCell className="users__col-large">
                  Email
                </Table.HeaderCell>
                <Table.HeaderCell className="users__col-small">
                  Super Admin
                </Table.HeaderCell>
                <Table.HeaderCell className="users__col-small">
                  Admin
                </Table.HeaderCell>
                <Table.HeaderCell className="users__col-small">
                  Researcher
                </Table.HeaderCell>
                <Table.HeaderCell className="users__col-small">
                  Facilitator
                </Table.HeaderCell>
                <Table.HeaderCell className="users__col-small">
                  Participant
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{rows}</Table.Body>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="7">
                  <Pagination
                    name="users"
                    siblingRange={1}
                    boundaryRange={0}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    activePage={activePage}
                    onPageChange={onPageChange}
                    totalPages={usersPages}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        ) : null}
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

const mapStateToProps = state => {
  const { user, users } = state;
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
