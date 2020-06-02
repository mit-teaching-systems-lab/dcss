import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
} from 'semantic-ui-react';
import _ from 'lodash';
import Session from '@utils/Session';
import {
  getCohort,
  getCohortParticipants,
  setCohort
} from '@client/actions/cohort';
import EditorMenu from '@components/EditorMenu';
import ClickableTableCell from '@components/ClickableTableCell';
import ConfirmAuth from '@components/ConfirmAuth';
import Loading from '@components/Loading';
import scrollIntoView from '@components/util/scrollIntoView';
import './Cohort.css';

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
    let persisted = Session.get(this.sessionKey);

    if (!persisted) {
      persisted = { refresh: false };
      Session.set(this.sessionKey, persisted);
    }

    const { refresh } = persisted;

    this.state = {
      isReady: false,
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
    this.onParticipantCheckboxClick = this.onParticipantCheckboxClick.bind(
      this
    );
    this.onParticipantSearchChange = this.onParticipantSearchChange.bind(this);
    this.onParticipantRefreshChange = this.onParticipantRefreshChange.bind(
      this
    );
  }

  async componentDidMount() {
    const {
      cohort: { id },
      refresh
    } = this.state;

    const cohort = await this.props.getCohort(Number(id));

    this.participants = cohort.users.slice();
    this.setState({
      isReady: true,
      cohort
    });

    if (refresh) {
      this.participantRefresh();
    }
  }

  async componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  onParticipantCheckboxClick() {}

  scrollIntoView() {
    scrollIntoView(this.tableBody.current.node.firstElementChild);
  }

  onParticipantSearchChange(event, { value }) {
    const { participants } = this;
    const { cohort } = this.props;

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
    let users = participants.filter(participant => {
      if (escapedRegExp.test(participant.username)) {
        return true;
      }

      if (escapedRegExp.test(participant.email)) {
        return true;
      }
      return false;
    });

    if (!value) {
      users = this.participants;
    }

    this.setState({
      search: value,
      cohort: {
        ...cohort,
        users
      }
    });
  }

  participantRefresh() {
    this.refreshInterval = setInterval(async () => {
      const { search, cohort } = this.state;
      if (!search) {
        cohort.users = await this.props.getCohortParticipants(
          Number(cohort.id)
        );
        this.participants = cohort.users.slice();
        this.setState({ cohort });
      }
    }, 1000);
  }

  onParticipantRefreshChange() {
    let refresh = !this.state.refresh;
    this.setState({ refresh }, () => {
      if (!refresh) {
        clearInterval(this.refreshInterval);
      } else {
        this.participantRefresh();
      }
      Session.set(this.sessionKey, this.state);
    });
  }

  render() {
    const { isAuthorized, onClick } = this.props;
    const { cohort, isReady, refresh } = this.state;
    const {
      onParticipantRefreshChange,
      onParticipantSearchChange,
      scrollIntoView
    } = this;
    // NOTE: The checkbox is temporarily disabled
    // const { onParticipantCheckboxClick } = this;

    if (!isReady) {
      return <Loading />;
    }

    const refreshIcon = refresh ? 'play' : 'square';
    const refreshColor = refresh ? 'green' : 'red';
    const refreshLabel = refresh
      ? 'Automattically refreshing this list'
      : 'List will refresh when page is reloaded';
    return (
      <Container fluid className="cohort__table-container">
        <EditorMenu
          type="cohort participants"
          items={{
            left: [
              <Menu.Item
                key="menu-item-cohort-participants"
                className="em__icon-padding"
                name="Participants in this Cohort"
                onClick={scrollIntoView}
              >
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="group" />
                </Icon.Group>
                Cohort Participants ({this.props.cohort.users.length})
              </Menu.Item>,
              <Menu.Item
                key="menu-item-cohort-participants"
                className="em__icon-padding"
                name="Control participant list refresh"
                onClick={onParticipantRefreshChange}
              >
                <Icon.Group className="em__icon-group-margin">
                  <Icon name="refresh" />
                  <Icon
                    corner="top right"
                    name={refreshIcon}
                    color={refreshColor}
                  />
                </Icon.Group>
                {refreshLabel}
              </Menu.Item>
            ],
            right: [
              <Menu.Menu
                key="menu-menu-search-cohort-participants"
                position="right"
              >
                <Menu.Item
                  key="menu-item-search-cohort-participants"
                  name="Search cohort participants"
                  className="em__icon-padding"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onParticipantSearchChange}
                  />
                </Menu.Item>
              </Menu.Menu>
            ]
          }}
        />
        <Table
          fixed
          striped
          selectable
          role="grid"
          aria-labelledby="header"
          className="cohort__table--constraints"
          unstackable
        >
          <Table.Header className="cohort__table-thead-tbody-tr">
            <Table.Row>
              <ConfirmAuth
                isAuthorized={isAuthorized}
                requiredPermission="edit_scenarios_in_cohort"
              >
                <Table.HeaderCell className="cohort__table-cell-first">
                  {' '}
                </Table.HeaderCell>
              </ConfirmAuth>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell className="cohort__table-cell-content">
                Email
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Ref innerRef={node => (this.tableBody = node)}>
            <Table.Body className="cohort__scrolling-tbody">
              {cohort.users.length ? (
                cohort.users.map((user, index) => {
                  const onClickAddTab = (event, data) => {
                    onClick(event, {
                      ...data,
                      type: 'participant',
                      source: user
                    });
                  };

                  return (
                    <Table.Row
                      key={`participants-row-${index}`}
                      className="cohort__table-thead-tbody-tr"
                      style={{ cursor: 'pointer' }}
                    >
                      {/*
                      <Table.Cell
                          key={`participants-cell-checkbox-${index}`}
                          className="cohort__table-cell-first"
                      >
                          <Popup
                              content="Adding participants is not available in this version of Cohorts"
                              trigger={
                                  <Checkbox
                                      disabled
                                      key={`participants-checkbox-${index}`}
                                      value={user.id}
                                      onClick={
                                          onParticipantCheckboxClick
                                      }
                                  />
                              }
                          />
                      </Table.Cell>
                      */}

                      <ConfirmAuth
                        isAuthorized={isAuthorized}
                        requiredPermission="view_all_data"
                      >
                        <Popup
                          content="View cohort reponses from this participant"
                          trigger={
                            <ClickableTableCell
                              className="cohort__table-cell-first"
                              display={<Icon name="file alternate outline" />}
                              onClick={onClickAddTab}
                            />
                          }
                        />
                      </ConfirmAuth>
                      <Table.Cell>{user.username}</Table.Cell>
                      <Table.Cell>{user.role}</Table.Cell>
                      <Table.Cell className="cohort__table-cell-content">
                        {user.email}
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row
                  key={`row-empty-results`}
                  className="cohort__table-thead-tbody-tr"
                >
                  <Table.Cell>
                    <Loading />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Ref>
        </Table>
      </Container>
    );
  }
}

CohortParticipants.propTypes = {
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
  isAuthorized: PropTypes.bool,
  id: PropTypes.any,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onClick: PropTypes.func,
  getCohort: PropTypes.func,
  getCohortParticipants: PropTypes.func,
  setCohort: PropTypes.func,
  scenarios: PropTypes.array
};

const mapStateToProps = state => {
  const { currentCohort: cohort } = state.cohort;
  const { users: participants } = cohort;
  const { scenarios } = state.scenario;
  return { cohort, participants, scenarios };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getCohortParticipants: id => dispatch(getCohortParticipants(id)),
  setCohort: params => dispatch(setCohort(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortParticipants)
);
