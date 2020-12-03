import React from 'react';
import { connect } from 'react-redux';
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
import { getCohort } from '@actions/cohort';
import EditorMenu from '@components/EditorMenu';
import Gate from '@components/Gate';
import Loading from '@components/Loading';
import Username from '@components/User/Username';
import UsersTable from '@components/User/UsersTable';
import { COHORT_ROLE_GROUPS } from '@components/Admin/constants';
import './Cohort.css';

const { facilitator, researcher } = COHORT_ROLE_GROUPS;

import Layout from '@utils/Layout';
const ROWS_PER_PAGE = 10;

export class CohortParticipants extends React.Component {
  constructor(props) {
    super(props);

    this.sessionKey = `cohort-participants/${this.props.id}`;
    let persisted = Storage.get(this.sessionKey);

    if (!persisted) {
      persisted = { refresh: false };
      Storage.set(this.sessionKey, persisted);
    }

    const { refresh } = persisted;

    this.state = {
      activePage: 1,
      isReady: false,
      refresh,
      search: '',
      participants: []
    };

    this.refreshInterval = null;
    this.tableBody = React.createRef();
    this.sectionRef = React.createRef();
    this.onPageChange = this.onPageChange.bind(this);
    this.onParticipantSearchChange = this.onParticipantSearchChange.bind(this);
    this.onParticipantRefreshChange = this.onParticipantRefreshChange.bind(
      this
    );
  }

  async fetchCohort() {
    await this.props.getCohort(this.props.id);

    if (!this.state.isReady) {
      this.setState({
        isReady: true,
        participants: this.props.participants.slice()
      });
    }
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

  onParticipantSearchChange(event, { value }) {
    if (value === '') {
      this.setState({
        activePage: 1,
        search: value,
        participants: this.props.participants.slice()
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    let participants = this.props.participants.filter(participant => {
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

    this.setState({
      activePage: 1,
      search: value,
      participants
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
    const { authority, cohort, onClick, user } = this.props;
    const { activePage, isReady, participants, refresh } = this.state;
    const {
      onPageChange,
      onParticipantRefreshChange,
      onParticipantSearchChange
    } = this;
    /**
    // Previously:
    // Ensure that Facilitator access is applied even if the user just
    // became a facilitator and their session roles haven't updated.
    // This can h
    const isFacilitator =
      user.roles.includes('facilitator') || authority.isFacilitator;
    */
    const { isFacilitator } = authority;

    if (!isReady) {
      return <Loading />;
    }

    const refreshIcon = refresh ? 'play' : 'square';
    const refreshColor = refresh ? 'green' : 'red';
    const refreshLabel = refresh
      ? 'This list will refresh automatically'
      : 'This list will refresh when page is reloaded';

    const pages = Math.ceil(participants.length / ROWS_PER_PAGE);
    const index = (activePage - 1) * ROWS_PER_PAGE;
    const participantsSlice = participants.slice(index, index + ROWS_PER_PAGE);
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

    const rows = participantsSlice.reduce((accum, cohortUser) => {
      // username will never be empty, but email might be.
      const onClickAddTab = (event, data) => {
        onClick(event, {
          ...data,
          type: 'participant',
          source: cohortUser
        });
      };
      const key = Identity.key(cohortUser);
      const username = <Username {...cohortUser} />;
      const content = `View responses from ${Username.displayableName(
        cohortUser
      )}`;
      const trigger = (
        <Table.Cell.Clickable
          className="c__table-cell-first c__hidden-on-mobile"
          aria-label={content}
          key={`p-${key}`}
          content={<Icon name="file alternate outline" />}
          onClick={onClickAddTab}
        />
      );
      const popup = (
        <Gate
          key={`c-${key}`}
          isAuthorized={isFacilitator}
          requiredPermission="view_all_data"
        >
          <Popup inverted size="tiny" content={content} trigger={trigger} />
        </Gate>
      );

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
        aria-label={`Participants in this Cohort: ${this.props.cohort.users.length}`}
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
          aria-label={refreshLabel}
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
  id: PropTypes.any,
  onClick: PropTypes.func,
  getCohort: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, user } = state;
  const { users: participants } = cohort;
  return { cohort, participants, user };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortParticipants);
