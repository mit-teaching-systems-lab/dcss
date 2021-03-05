import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import escapeRegExp from 'lodash.escaperegexp';
import PropTypes from 'prop-types';
import {
  Icon,
  Input,
  List,
  Menu,
  Table
} from '@components/UI';

import Loading from '@components/Loading';
import Username from '@components/User/Username';
import UsersTable from '@components/User/UsersTable';
import { computeItemsRowsPerPage } from '@utils/Layout';
import { getUsers } from '@actions/users';
import { SITE_ROLE_GROUPS } from '@components/Admin/constants';
import History from '@utils/History';
import Identity from '@utils/Identity';

const { super_admin, admin, facilitator, researcher } = SITE_ROLE_GROUPS;

const rolesMap = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  facilitator: 'Facilitator',
  researcher: 'Researcher',
  participant: 'Participant'
};

const AccessListItem = props => {
  const { active, item, onClick } = props;

  return (
    <List.Item
      as="a"
      aria-label={item.personalname || item.username}
      active={active}
      id={item.id}
      onClick={onClick}
    >
      <List.Content>
        <List.Header>
          <Username user={item} />
        </List.Header>
        <List.Description>
          {item.roles.map(role => rolesMap[role]).join(', ')}
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

AccessListItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
  onClick: PropTypes.func
};

class Access extends Component {
  constructor(props) {
    super(props);

    const activePage = Number(this.props.activePage);

    this.state = {
      activePage,
      isReady: false,
      id: null,
      results: [],
      user: null
    };

    // This is used as a back up copy of
    // users when the list is filtered
    // by searching.
    this.users = [];
    this.onPageChange = this.onPageChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  async componentDidMount() {
    const id = this.props.id;
    let user = id ? this.props.usersById[id] : null;

    if (id && !user) {
      user = await this.props.getUsers(id);
    }

    if (!this.props.users.length) {
      await this.props.getUsers();
    }

    this.users = this.props.users.slice();

    this.setState({
      isReady: true,
      user,
      id
    });
  }

  onSelect(event, { id }) {
    this.setState({ id });
    this.props.history.push(
      History.composeUrl(this.props.location, {
        id
      })
    );
  }

  onPageChange(event, { activePage }) {
    this.props.history.push(`/admin/access?page=${activePage}`);
    this.setState({
      ...this.state,
      activePage
    });
  }

  onSearch(event, { value: search }) {
    if (search === '') {
      this.setState({
        activePage: 1,
        results: []
      });
      return;
    }

    if (search.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(search), 'i');
    const results = this.props.users.filter(user =>
      escapedRegExp.test(JSON.stringify(user))
    );

    this.setState({
      activePage: 1,
      results
    });
  }

  render() {
    const { onPageChange, onSearch, /*onSelect*/ } = this;
    const { user } = this.props;
    const { /*id,*/ isReady, activePage } = this.state;

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

    const usersSource = this.state.results.length
      ? this.state.results
      : this.props.users;

    const usersCount = usersSource.length;
    const pages = Math.ceil(usersCount / rowsPerPage);
    const index = (activePage - 1) * rowsPerPage;
    const users = usersSource.slice(index, index + rowsPerPage);
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
        <Menu borderless>
          <Menu.Item.Tabbable key="menu-item-account-administration">
            <Icon.Group className="em__icon-group-margin">
              <Icon name="user" />
              <Icon corner="top right" name="cogs" color="orange" />
            </Icon.Group>
            Users ({usersCount})
          </Menu.Item.Tabbable>
          <Menu.Menu key="menu-item-account-search" position="right">
            <Menu.Item.Tabbable
              key="menu-item-search-accounts"
              name="Search user accounts"
            >
              <Input
                transparent
                icon="search"
                placeholder="Search..."
                onChange={onSearch}
              />
            </Menu.Item.Tabbable>
          </Menu.Menu>
        </Menu>

        {/*
        TODO: finish implementing this UI
        <Grid>
          <Grid.Row divided>
            <Grid.Column width={4}>
              <List selection divided relaxed>
                {users
                  .map(item => (
                    <AccessListItem
                      onClick={onSelect}
                      active={item.id === id}
                      item={item}
                      key={Identity.key(item)}
                    />
                  ))
                  .filter(Boolean)}
              </List>
              <Pagination
                borderless
                name="logs"
                activePage={activePage}
                siblingRange={2}
                boundaryRange={0}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                onPageChange={onPageChange}
                totalPages={pages}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <List selection divided relaxed>
                {users
                  .map(item => (
                    <AccessListItem
                      onClick={onSelect}
                      active={item.id === id}
                      item={item}
                      key={Identity.key(item)}
                    />
                  ))
                  .filter(Boolean)}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        */}

        {!isReady ? <Loading /> : <UsersTable {...usersTableProps} />}
      </Fragment>
    );
  }
}

Access.propTypes = {
  activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  getUsers: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { user } = state;
  const usersSource = ownProps.users || state.users;
  const activePage = ownProps.activePage || 1;
  const users = usersSource.filter(user => !user.is_agent);
  const usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );
  return { activePage, user, users, usersById };
};

const mapDispatchToProps = dispatch => ({
  getUsers: () => dispatch(getUsers())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Access)
);
