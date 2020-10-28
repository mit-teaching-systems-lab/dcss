import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  // NOTE: The checkbox is temporarily disabled
  // Checkbox,
  Container,
  // Dimmer,
  Icon,
  Input,
  Menu,
  Popup,
  Ref,
  Table
} from '@components/UI';
import escapeRegExp from 'lodash.escaperegexp';
import Identity from '@utils/Identity';
import Storage from '@utils/Storage';
import { getCohort, setCohort } from '@actions/cohort';
import EditorMenu from '@components/EditorMenu';
import Username from '@components/User/Username';
import UsersTable from '@components/Admin/UsersTable';
import ConfirmAuth from '@components/ConfirmAuth';
import Loading from '@components/Loading';
import scrollIntoView from '@utils/scrollIntoView';
import { COHORT_ROLE_GROUPS } from '../Admin/constants';
import './Cohort.css';

const { facilitator, researcher } = COHORT_ROLE_GROUPS;

import Layout from '@utils/Layout';
const ROWS_PER_PAGE = 10;

export class CohortParticipants extends React.Component {
  constructor(props) {
    super(props);

    let {
      params: { id }
    } = this.props.match;

    if (!id && this.props.id) {
      id = this.props.id;
    }

    this.sessionKey = `cohort-participants/${id}`;
    let persisted = Storage.get(this.sessionKey);

    if (!persisted) {
      persisted = { refresh: false };
      Storage.set(this.sessionKey, persisted);
    }

    const { refresh } = persisted;

    this.state = {
      isReady: false,
      activePage: 1,
      refresh,
      search: '',
      cohort: {
        id,
        users: []
      }
    };

    this.refreshInterval = null;

    // This is used as a back up copy of
    // participants when the list is filtered
    // by searching.
    this.participants = [];
    this.tableBody = React.createRef();
    this.sectionRef = React.createRef();
    this.onPageChange = this.onPageChange.bind(this);
    this.onParticipantSearchChange = this.onParticipantSearchChange.bind(this);
    this.onParticipantRefreshChange = this.onParticipantRefreshChange.bind(
      this
    );
  }

  async fetchCohort() {
    const {
      cohort: { id }
    } = this.state;

    const cohort = await this.props.getCohort(Number(id));

    this.participants = cohort.users.slice();
    this.setState({
      isReady: true,
      cohort
    });
  }

  participantRefresh() {
    this.refreshInterval = setInterval(async () => {
      if (!this.state.search) {
        await this.fetchCohort();
      }
    }, 1000);
  }

  async componentDidMount() {
    await this.fetchCohort();

    if (this.state.refresh) {
      this.participantRefresh();
    }
  }

  async componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  scrollIntoView() {
    scrollIntoView(this.tableBody.current.node.firstElementChild);
  }

  onParticipantSearchChange(event, { value }) {
    const { participants } = this;
    const { cohort } = this.props;

    if (value === '') {
      this.setState({
        activePage: 1,
        search: value,
        cohort: {
          ...cohort,
          users: participants
        }
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    let users = participants.filter(participant => {
      // console.log(participant);
      if (escapedRegExp.test(participant.username)) {
        return true;
      }

      if (escapedRegExp.test(participant.email)) {
        return true;
      }

      if (escapedRegExp.test(participant.roles.join(','))) {
        return true;
      }

      return false;
    });

    if (!value) {
      users = this.participants;
    }

    this.setState({
      activePage: 1,
      search: value,
      cohort: {
        ...cohort,
        users
      }
    });
  }

  onParticipantRefreshChange() {
    let refresh = !this.state.refresh;
    this.setState({ refresh }, () => {
      if (!refresh) {
        clearInterval(this.refreshInterval);
      } else {
        this.participantRefresh();
      }
      Storage.set(this.sessionKey, this.state);
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  render() {
    const { authority, onClick, user, usersById } = this.props;
    const { activePage, cohort, isReady, refresh } = this.state;
    const {
      onPageChange,
      onParticipantRefreshChange,
      onParticipantSearchChange,
      scrollIntoView
    } = this;
    // Ensure that Facilitator access is applied even if the user just
    // became a facilitator and their session roles haven't updated.
    const isFacilitator =
      user.roles.includes('facilitator') || authority.isFacilitator;

    if (!isReady) {
      return <Loading />;
    }

    const refreshIcon = refresh ? 'play' : 'square';
    const refreshColor = refresh ? 'green' : 'red';
    const refreshLabel = refresh
      ? 'This list will refresh automatically'
      : 'This list will refresh when page is reloaded';

    const pages = Math.ceil(cohort.users.length / ROWS_PER_PAGE);
    const index = (activePage - 1) * ROWS_PER_PAGE;
    const users = cohort.users.slice(index, index + ROWS_PER_PAGE);
    const columns = {
      data: {
        className: 'c__table-cell-first c__hidden-on-mobile',
        content: ''
      },
      username: {
        className: 'users__col-large',
        content: 'User'
      },
      email: {
        className: 'users__col-large c__hidden-on-mobile',
        content: 'Email'
      }
    };

    const grantableRoles = {};

    if (user.roles.includes('facilitator') || user.is_super) {
      Object.assign(grantableRoles, facilitator);
    }

    if (user.roles.includes('researcher')) {
      Object.assign(grantableRoles, researcher);
    }

    Object.assign(columns, grantableRoles);

    const rows = users.reduce((accum, cohortUser) => {
      // username will never be empty, but email might be.
      const onClickAddTab = (event, data) => {
        onClick(event, {
          ...data,
          type: 'participant',
          source: cohortUser
        });
      };
      const key = Identity.key(cohortUser);

      const trigger = (
        <Table.Cell.Clickable
          className="c__table-cell-first c__hidden-on-mobile"
          key={`p-${key}`}
          content={<Icon name="file alternate outline" />}
          onClick={onClickAddTab}
        />
      );
      const popup = (
        <ConfirmAuth
          key={`c-${key}`}
          isAuthorized={isFacilitator}
          requiredPermission="view_all_data"
        >
          <Popup
            inverted
            size="tiny"
            content="View cohort reponses from this participant"
            trigger={trigger}
          />
        </ConfirmAuth>
      );

      const { is_super } = (usersById && usersById[cohortUser.id]) || {};
      const username = <Username {...cohortUser} is_super={is_super} />;

      const usernameCell = cohortUser.roles.includes('owner') ? (
        <Table.Cell key={`u-${key}`}>{username} (owner)</Table.Cell>
      ) : (
        <Table.Cell key={`u-${key}`}>{username}</Table.Cell>
      );

      accum[cohortUser.id] = [
        popup,
        usernameCell,
        <Table.Cell className="c__hidden-on-mobile" key={`e-${key}`}>
          {cohortUser.email}
        </Table.Cell>
      ];

      return accum;
    }, {});

    const usersTableProps = {
      activePage,
      cohort,
      columns,
      grantableRoles,
      onPageChange,
      pages,
      rows
    };

    const left = [
      <Menu.Item.Tabbable
        key="menu-item-cohort-participants"
        name="Participants in this Cohort"
        onClick={scrollIntoView}
      >
        <Icon.Group className="em__icon-group-margin">
          <Icon name="group" />
        </Icon.Group>
        Participants ({this.props.cohort.users.length})
      </Menu.Item.Tabbable>,
      Layout.isNotForMobile() ? (
        <Menu.Item.Tabbable
          key="menu-item-cohort-participants"
          name="Control participant list refresh"
          onClick={onParticipantRefreshChange}
        >
          <Icon.Group className="em__icon-group-margin">
            <Icon name="refresh" />
            <Icon corner="top right" name={refreshIcon} color={refreshColor} />
          </Icon.Group>
          {refreshLabel}
        </Menu.Item.Tabbable>
      ) : null
    ];

    const right = [
      <Menu.Menu key="menu-menu-search-cohort-participants" position="right">
        <Menu.Item.Tabbable
          key="menu-item-search-cohort-participants"
          name="Search cohort participants"
        >
          <Input
            icon="search"
            placeholder="Search..."
            onChange={onParticipantSearchChange}
          />
        </Menu.Item.Tabbable>
      </Menu.Menu>
    ];
    const editorMenu = (
      <Ref innerRef={node => (this.sectionRef = node)}>
        <EditorMenu type="cohort participants" items={{ left, right }} />
      </Ref>
    );
    return (
      <Container fluid className="c__table-container">
        {editorMenu}
        <UsersTable {...usersTableProps} />
      </Container>
    );
  }
}

CohortParticipants.propTypes = {
  authority: PropTypes.object,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    role: PropTypes.string,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  participants: PropTypes.array,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.any,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onClick: PropTypes.func,
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  scenarios: PropTypes.array,
  user: PropTypes.object,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, user, usersById } = state;
  const { users: participants } = cohort;
  const { scenarios } = state.scenario;
  return { cohort, participants, scenarios, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  setCohort: params => dispatch(setCohort(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortParticipants)
);
