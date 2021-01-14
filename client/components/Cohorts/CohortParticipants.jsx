import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Header, Input, Modal, Table } from '@components/UI';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import Identity from '@utils/Identity';
import { getCohort } from '@actions/cohort';
import Username from '@components/User/Username';
import UsersTable from '@components/User/UsersTable';
import { COHORT_ROLE_GROUPS } from '@components/Admin/constants';
import './Cohort.css';

const { facilitator, researcher } = COHORT_ROLE_GROUPS;
const ROWS_PER_PAGE = 10;

export class CohortParticipants extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      isReady: false,
      search: '',
      participants: []
    };

    this.tableBody = React.createRef();
    this.onPageChange = this.onPageChange.bind(this);
    this.onParticipantSearchChange = this.onParticipantSearchChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getCohort(this.props.id);
    this.setState({
      isReady: true
    });
  }

  onParticipantSearchChange(event, { value }) {
    if (value === '') {
      this.setState({
        activePage: 1,
        search: '',
        participants: []
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    let participants = this.props.cohort.users.filter(participant => {
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

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  render() {
    const { cohort, onClose, rowsPerPage, user } = this.props;
    const { activePage, isReady } = this.state;
    const { onPageChange, onParticipantSearchChange } = this;

    if (!isReady) {
      return null;
    }

    const sourceParticipants = this.state.participants.length
      ? this.state.participants
      : this.props.cohort.users;

    const pages = Math.ceil(sourceParticipants.length / rowsPerPage);
    const index = (activePage - 1) * rowsPerPage;
    const participantsSlice = sourceParticipants.slice(
      index,
      index + rowsPerPage
    );
    const columns = {
      username: {
        className: 'users__col-large',
        content: 'Participant'
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
      const key = Identity.key(cohortUser);
      const username = <Username {...cohortUser} />;
      const usernameCell = cohortUser.roles.includes('owner') ? (
        <Table.Cell key={`u-${key}`}>{username} (owner)</Table.Cell>
      ) : (
        <Table.Cell key={`u-${key}`}>{username}</Table.Cell>
      );

      accum[cohortUser.id] = [usernameCell];

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

    const count = this.props.cohort.users.length;
    const headerContent = `Manage ${count} ${pluralize('participant', count)}`;
    const searcInputAriaLabel = 'Search participants';

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          size="fullscreen"
          centered={false}
          onClose={onClose}
        >
          <Header icon="group" content={headerContent} />
          <Modal.Content>
            <Input
              aria-label={searcInputAriaLabel}
              label={searcInputAriaLabel}
              className="grid__menu-search"
              icon="search"
              size="big"
              onChange={onParticipantSearchChange}
            />
            <UsersTable {...usersTableProps} />
          </Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              <Button primary aria-label="Close" onClick={onClose}>
                Close
              </Button>
            </Button.Group>
          </Modal.Actions>
          <div data-testid="cohort-participants" />
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortParticipants.propTypes = {
  cohort: PropTypes.object,
  id: PropTypes.any,
  onClose: PropTypes.func,
  getCohort: PropTypes.func,
  rowsPerPage: PropTypes.number,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { cohort, user } = state;
  const rowsPerPage = ownProps.rowsPerPage || ROWS_PER_PAGE;
  return { cohort, rowsPerPage, user };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortParticipants);
