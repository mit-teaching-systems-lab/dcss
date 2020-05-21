import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Icon, Input, Menu, Table } from 'semantic-ui-react';

import EditorMenu from '@components/EditorMenu';
import UserRows from './UserRows';
import { setUsers } from '@client/actions';

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

class AccountAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };

    this.onAccountSearchChange = this.onAccountSearchChange.bind(this);
  }

  async componentDidMount() {
    const {
      error,
      users
    } = await (await fetch('/api/roles')).json();

    if (error) {
      this.props.history.push('/logout');
    } else {
      this.props.setUsers({ users });
      this.setState({
        users: this.props.users
      });
    }
  }

  onAccountSearchChange(event, props) {
    const { users: sourceUsers } = this.props;
    const { value } = props;

    if (value === '') {
      this.setState({
        users: sourceUsers
      });

      return;
    }

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
    const results = sourceUsers.filter(({ username, email, roles }) => {
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
      results.push(...sourceUsers);
    }

    this.setState({
      users: results
    });
  }

  render() {
    const { onAccountSearchChange } = this;
    const { users } = this.state;
    const usersDisplay = UserRows(users);

    return (
      <Fragment>
        <EditorMenu
          type="administration"
          items={{
            left: [
              <Menu.Item
                key="menu-item-account-administration"
                className="editormenu__padding"
              >
                <Icon.Group className="editormenu__icon-group">
                  <Icon name="user" />
                  <Icon corner="top right" name="cogs" color="orange" />
                </Icon.Group>
                Account Administration
              </Menu.Item>
            ],
            right: [
              <Menu.Menu key="menu-item-account-search" position="right">
                <Menu.Item
                  key="menu-item-search-accounts"
                  name="Search user accounts"
                  className="editormenu__padding"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onAccountSearchChange}
                  />
                </Menu.Item>
              </Menu.Menu>
            ]
          }}
        />
        {users.length ? (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Super Admin</Table.HeaderCell>
                <Table.HeaderCell>Admin</Table.HeaderCell>
                <Table.HeaderCell>Researcher</Table.HeaderCell>
                <Table.HeaderCell>Facilitator</Table.HeaderCell>
                <Table.HeaderCell>Participant</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{usersDisplay}</Table.Body>
          </Table>
        ) : null}
      </Fragment>
    );
  }
}

AccountAdmin.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  setUsers: PropTypes.func.isRequired,
  users: PropTypes.array
};

function mapStateToProps(state) {
  const { users } = state.admin;
  return { users };
}

const mapDispatchToProps = {
  setUsers
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountAdmin));
