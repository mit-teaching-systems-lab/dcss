import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import escapeRegExp from 'lodash.escaperegexp';
import hash from 'object-hash';
import PropTypes from 'prop-types';
import { Dropdown, Input, Menu, Table, Text } from '@components/UI';
import {
  setScenario,
  addScenarioUserRole,
  endScenarioUserRole
} from '@actions/scenario';
import { getUsers, getUsersByPermission } from '@actions/users';

import EditorMenu from '@components/EditorMenu';
import UsersTable from '@components/Admin/UsersTable';
import Username from '@components/User/Username';
import { notify } from '@components/Notification';

const ROWS_PER_PAGE = 5;
// const OWNER = { key: 'owner', value: 'owner', text: 'Owner' };
const AUTHOR = { key: 'author', value: 'author', text: 'Author' };
const REVIEWER = { key: 'reviewer', value: 'reviewer', text: 'Reviewer' };
const NONE = { key: 'none', value: null, text: 'None' };

class ScenarioAuthors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      candidates: [],
      isReady: false,
      search: ''
    };

    this.authors = [];
    this.reviewers = [];

    this.onChange = this.onChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onUsersSearchChange = this.onUsersSearchChange.bind(this);
  }

  async componentDidMount() {
    const { getUsers, getUsersByPermission, scenario } = this.props;

    if (!this.props.users.length) {
      await getUsers();
    }

    const editors = await getUsersByPermission('edit_scenario');
    const candidates = [
      ...scenario.users,
      ...this.props.users.reduce((accum, user) => {
        // If this user is already in the scenario, don't add
        // them to this list.
        if (scenario.users.find(u => u.id === user.id)) {
          return accum;
        }
        // If the user is anonymous, don't add them to this list.
        if (user.is_anonymous) {
          return accum;
        }

        // If the user has a role that allows them to edit
        // Q: Should this be moved to server?
        user.isEditor = !!editors.find(({ id }) => id === user.id);

        accum.push(Object.assign({}, user, { roles: [] }));
        return accum;
      }, [])
    ];

    // Backups used to restore after search filtering
    this.candidates = candidates.slice();

    this.setState({
      isReady: true,
      candidates
    });
  }

  async onChange(event, props) {
    const { defaultValue, role, scenario, user } = props;
    const username = Username.from(user);

    // eslint-disable-next-line no-console
    console.log('onChange', scenario, user, role, defaultValue);

    if (role) {
      // notify
      // If a role is present (not null), add the role to
      // this user, for this scenario.
      const result = await this.props.addScenarioUserRole(
        scenario.id,
        user.id,
        role
      );
      if (result.addedCount) {
        notify({
          message: `${username} is now a ${role} in ${scenario.title}`
        });
      }
    } else {
      const role = defaultValue;
      const result = await this.props.endScenarioUserRole(
        scenario.id,
        user.id,
        role
      );
      if (result.endedCount) {
        notify({
          message: `${username} is no longer a ${role} in ${scenario.title}`
        });
      }
    }
  }

  onUsersSearchChange(event, { value }) {
    const candidates = this.candidates.slice();

    if (value === '') {
      this.setState({
        activePage: 1,
        search: value,
        candidates
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    let results = candidates.filter(candidate => {
      // console.log(candidate);
      if (escapedRegExp.test(candidate.username)) {
        return true;
      }

      if (escapedRegExp.test(candidate.email)) {
        return true;
      }

      if (escapedRegExp.test(candidate.personalname)) {
        return true;
      }

      if (escapedRegExp.test(candidate.roles.join(','))) {
        return true;
      }

      return false;
    });

    if (!value) {
      results = candidates;
    }

    this.setState({
      activePage: 1,
      search: value,
      candidates: results
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  render() {
    const { scenario, user, usersById } = this.props;
    const { activePage, isReady, candidates } = this.state;
    const { onChange, onPageChange, onUsersSearchChange } = this;

    if (!isReady) {
      return null;
    }

    const pages = Math.ceil(candidates.length / ROWS_PER_PAGE);
    const index = (activePage - 1) * ROWS_PER_PAGE;
    const candidatesSlice = candidates.slice(index, index + ROWS_PER_PAGE);
    const columns = {
      username: {
        className: 'users__col-xlarge',
        content: 'User'
      },
      email: {
        className: 'users__col-xlarge',
        content: 'Email'
      },
      role: {
        className: 'users__col-medium',
        content: 'Role'
      }
    };

    const grantableRoles = {};
    const currentScenarioUser = scenario.users.find(u => u.id === user.id);
    const rows = candidatesSlice.reduce((accum, candidateUser) => {
      const candidate = Object.assign(
        {},
        usersById[candidateUser.id],
        candidateUser
      );

      const onRoleChange = (event, props) => {
        const user = candidate;
        const { value: role, defaultValue } = props;
        onChange(event, {
          defaultValue,
          role,
          scenario,
          user
        });
      };

      const options = [];

      // If they already have roles, then they are already in this scenario.
      if (candidate.roles.length) {
        if (candidate.roles.includes('author')) {
          options.push(AUTHOR);
        }
      } else {
        // Potential new scenario collaborators...
        if (candidate.isEditor) {
          options.push(AUTHOR);
        }
      }
      options.push(REVIEWER, NONE);

      // The Dropdown must be disabled when:
      //
      //  1. The candidate is the owner (owner cannot change ownership yet)
      //  2. The viewing user is neither super, not owner
      //
      const disabled = !currentScenarioUser.is_owner || !user.is_super;
      const defaultValue = candidate.roles.length ? candidate.roles[0] : null;
      const key = hash(candidate);

      accum[candidate.id] = [
        <Table.Cell key={`${key}-1`}>
          <Username {...candidate} />
        </Table.Cell>,
        <Table.Cell key={`${key}-2`}>
          {candidate.email ? (
            <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
          ) : null}
        </Table.Cell>,
        <Table.Cell textAlign="right" key={`${key}-3`}>
          {!candidate.is_owner ? (
            <Dropdown
              direction="left"
              name="role"
              placeholder="______________"
              disabled={disabled}
              defaultValue={defaultValue}
              options={options}
              onChange={onRoleChange}
              style={{ width: '100%', textAlign: 'right' }}
            />
          ) : (
            <Text grey>Owner</Text>
          )}
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

    const left = [
      <Menu.Item key="menu-item-collaborators">
        Collaborators ({this.props.scenario.users.length})
      </Menu.Item>
    ];

    const right = [
      <Menu.Menu key="menu-menu-search-collaborators" position="right">
        <Menu.Item key="menu-item-available-collaborators">
          Available users ({candidates.length})
        </Menu.Item>
        <Menu.Item
          key="menu-item-search-collaborators"
          name="Search authors & reviewers"
          className="em__search-input-box-right"
        >
          <Input
            icon="search"
            placeholder="Search..."
            onChange={onUsersSearchChange}
          />
        </Menu.Item>
      </Menu.Menu>
    ];
    const editorMenu = (
      <EditorMenu text type="scenario authors" items={{ left, right }} />
    );

    return (
      <Fragment>
        {editorMenu}
        <UsersTable {...usersTableProps} />
      </Fragment>
    );
  }
}

ScenarioAuthors.propTypes = {
  addScenarioUserRole: PropTypes.func,
  endScenarioUserRole: PropTypes.func,
  scenario: PropTypes.object,
  setScenario: PropTypes.func.isRequired,
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object,
  getUsers: PropTypes.func.isRequired,
  getUsersByPermission: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { user, users, usersById } = state;
  return {
    user,
    users,
    usersById
  };
};

const mapDispatchToProps = dispatch => ({
  addScenarioUserRole: (...params) => dispatch(addScenarioUserRole(...params)),
  endScenarioUserRole: (...params) => dispatch(endScenarioUserRole(...params)),
  setScenario: params => dispatch(setScenario(params)),
  getUsers: () => dispatch(getUsers()),
  getUsersByPermission: permission => dispatch(getUsersByPermission(permission))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioAuthors);
