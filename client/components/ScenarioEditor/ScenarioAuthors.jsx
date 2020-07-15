import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import escapeRegExp from 'lodash.escaperegexp';
import hash from 'object-hash';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Input, Menu, Table } from '@components/UI';
import {
  getScenario,
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

    const authors = await getUsersByPermission('edit_scenario');
    const candidates = [
      ...scenario.users,
      ...this.props.users.reduce((accum, user) => {
        if (scenario.users.find(({ id }) => id === user.id)) {
          return accum;
        }
        user.isReviewerOnly = !authors.find(({ id }) => id === user.id);
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

  async onChange(event, { scenario, user, role }) {
    // eslint-disable-next-line no-console
    console.log('onChange', scenario, user, role);

    const username = new Username(user);

    if (role) {
      // notify
      // If a role is present (not null), add the role to
      // this user, for this scenario.
      const sRoleResult = await this.props.addScenarioUserRole(
        scenario.id,
        user.id,
        role
      );
      if (sRoleResult.addedCount) {
        notify({
          message: `${username} is now a ${role} in ${scenario.title}`
        });
      }
    } else {
      const sRoleResult = await this.props.endScenarioUserRole(
        scenario.id,
        user.id,
        role
      );
      if (sRoleResult.deletedCount) {
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
    const { scenario } = this.props;
    const { activePage, isReady, candidates } = this.state;
    const { onChange, onPageChange, onUsersSearchChange } = this;

    if (!isReady) {
      return null;
    }

    const pages = Math.ceil(candidates.length / ROWS_PER_PAGE);
    const index = (activePage - 1) * ROWS_PER_PAGE;
    const users = candidates.slice(index, index + ROWS_PER_PAGE);
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

    const rows = users.reduce((accum, candidateUser) => {
      const onRoleChange = (event, { name, value }) => {
        onChange(event, {
          user: candidateUser,
          scenario,
          [name]: value
        });
      };

      const scenarioUser = scenario.users.find(
        user => user.id === candidateUser.id
      );

      const scenarioUserIsOwner =
        scenarioUser && scenarioUser.roles.includes('owner');

      const owner = { key: 'owner', value: 'owner', text: 'Owner' };
      const author = { key: 'author', value: 'author', text: 'Author' };
      const reviewer = { key: 'reviewer', value: 'reviewer', text: 'Reviewer' };
      const options = [];

      if (candidateUser.isReviewerOnly) {
        options.push(reviewer);
      } else {
        options.push(author, reviewer);
      }

      options.push({ key: 'none', value: null, text: 'None' });

      const defaultValue = scenarioUser ? scenarioUser.roles[0] : null;

      if (scenarioUserIsOwner) {
        console.log(scenarioUser.roles);
      }

      const key = hash(candidateUser);

      accum[candidateUser.id] = [
        <Table.Cell key={`${key}-1`}>
          {<Username {...candidateUser} />}{' '}
          {candidateUser.roles.includes('owner') ? '(owner)' : null}
        </Table.Cell>,
        <Table.Cell key={`${key}-2`}>
          {candidateUser.email ? (
            <a href={`mailto:${candidateUser.email}`}>{candidateUser.email}</a>
          ) : null}
        </Table.Cell>,
        <Table.Cell key={`${key}-3`}>
          {!scenarioUserIsOwner ? (
            <Dropdown
              direction="left"
              name="role"
              placeholder="______________"
              defaultValue={defaultValue}
              options={options}
              onChange={onRoleChange}
              style={{ width: '100%', textAlign: 'right' }}
            />
          ) : null}
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
      <Menu.Item key="menu-item-authors-reviewers">
        <Icon.Group className="em__icon-group-margin">
          <Icon name="pencil" />
        </Icon.Group>
        Authors & Reviewers ({this.props.scenario.users.length})
      </Menu.Item>
    ];

    const right = [
      <Menu.Menu key="menu-menu-search-authors-reviewers" position="right">
        <Menu.Item
          key="menu-item-search-authors-reviewers"
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
      <EditorMenu type="scenario authors" items={{ left, right }} />
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
  getScenario: PropTypes.func.isRequired,
  setScenario: PropTypes.func.isRequired,
  user: PropTypes.object,
  users: PropTypes.array,
  getUsers: PropTypes.func.isRequired,
  getUsersByPermission: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { user, users } = state;
  return {
    user,
    users
  };
};

const mapDispatchToProps = dispatch => ({
  addScenarioUserRole: (...params) => dispatch(addScenarioUserRole(...params)),
  endScenarioUserRole: (...params) => dispatch(endScenarioUserRole(...params)),
  getScenario: id => dispatch(getScenario(id)),
  setScenario: params => dispatch(setScenario(params)),
  getUsers: () => dispatch(getUsers()),
  getUsersByPermission: permission => dispatch(getUsersByPermission(permission))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioAuthors);
