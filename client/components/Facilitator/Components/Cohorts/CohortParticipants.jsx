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
  Ref,
  Popup,
  Table
} from 'semantic-ui-react';
import _ from 'lodash';
import {
  getCohort,
  getCohortParticipants,
  setCohort
} from '@client/actions/cohort';
import EditorMenu from '@components/EditorMenu';
import ClickableTableCell from '@components/ClickableTableCell';
import ConfirmAuth from '@components/ConfirmAuth';
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

    this.state = {
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
  }

  async componentDidMount() {
    const {
      cohort: { id }
    } = this.state;

    const cohort = await this.props.getCohort(Number(id));

    this.setState({
      cohort
    });

    this.refreshInterval = setInterval(async () => {
      const { search, cohort } = this.state;
      if (!search) {
        cohort.users = await this.props.getCohortParticipants(Number(id));
        this.participants = cohort.users.slice();
        this.setState({ cohort });
      }
    }, 1000);
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

    const users = participants.filter(scenario => {
      if (escapedRegExp.test(scenario.username)) {
        return true;
      }

      if (escapedRegExp.test(scenario.email)) {
        return true;
      }
      return false;
    });

    this.setState({
      search: value,
      cohort: {
        ...cohort,
        users
      }
    });
  }

  render() {
    const { onClick } = this.props;
    const { cohort } = this.state;
    const { onParticipantSearchChange } = this;
    // NOTE: The checkbox is temporarily disabled
    // const { onParticipantCheckboxClick } = this;

    return (
      <Container fluid className="cohort__table-container">
        <EditorMenu
          type="cohort participants"
          items={{
            left: [
              <Menu.Item
                key="menu-item-cohort-scenarios"
                className="editormenu__padding"
                name="Scenarios in this Cohort"
                onClick={this.scrollIntoView}
              >
                <Icon.Group className="editormenu__icon-group">
                  <Icon name="group" />
                </Icon.Group>
                Cohort Participants ({this.props.cohort.users.length})
              </Menu.Item>
            ],
            right: [
              <ConfirmAuth
                key="menu-item-cohort-scenarios-search"
                requiredPermission="edit_scenarios_in_cohort"
              >
                <Menu.Menu position="right">
                  <Menu.Item
                    key="menu-item-search-accounts"
                    name="Search cohort participants"
                    className="editormenu__padding"
                  >
                    <Input
                      icon="search"
                      placeholder="Search..."
                      onChange={onParticipantSearchChange}
                    />
                  </Menu.Item>
                </Menu.Menu>
              </ConfirmAuth>
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
              <Table.HeaderCell className="cohort__table-cell-first">
                {' '}
              </Table.HeaderCell>
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

                      <ConfirmAuth requiredPermission="view_all_data">
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
                  <Table.Cell>No participants match your search</Table.Cell>
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
