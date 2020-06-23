import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Menu,
  Message,
  Modal
} from 'semantic-ui-react';
import {
  getCohorts,
  getCohort,
  setCohort,
  createCohort
} from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import CohortCard from './CohortCard';
import CohortEmpty from './CohortEmpty';

export class Cohorts extends React.Component {
  constructor(props) {
    super(props);

    const { params, path } = this.props.match;

    const id = path === '/cohort/:id' && params ? params.id : null;

    this.state = {
      isReady: false,
      createIsVisible: false,
      cohort: new CohortEmpty({ id }),
      cohorts: [],
      scenarios: []
    };

    this.onCreateCohortCancel = this.onCreateCohortCancel.bind(this);
    this.onCohortNameChange = this.onCohortNameChange.bind(this);
    this.onOpenCreateCohortClick = this.onOpenCreateCohortClick.bind(this);
    this.onCohortSearchChange = this.onCohortSearchChange.bind(this);
    this.onCreateCohortSubmit = this.onCreateCohortSubmit.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getCohorts();
      await this.props.getScenarios();
      await this.props.getUser();

      this.setState({
        isReady: true,
        cohorts: this.props.cohorts,
        scenarios: this.props.scenarios
      });
    }
  }

  async onCreateCohortSubmit() {
    const { name } = this.state.cohort;

    const { id } = await this.props.createCohort({
      name
    });

    location.href = `/cohort/${id}`;
  }

  onCreateCohortCancel() {
    this.setState({ createIsVisible: false });
  }

  onCohortNameChange(event, { name, value }) {
    this.setState({ cohort: { [name]: value } });
  }

  onOpenCreateCohortClick() {
    this.setState({ createIsVisible: true });
  }

  onCohortSearchChange(event, props) {
    const { cohorts: sourceCohorts, scenarios } = this.props;
    const { value } = props;

    if (value === '') {
      this.setState({
        cohorts: sourceCohorts
      });

      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
    const lookupCohort = id => scenarios.find(scenario => scenario.id === id);

    const results = sourceCohorts.filter(record => {
      const { name, scenarios, users } = record;

      if (escapedRegExp.test(name)) {
        return true;
      }

      if (users.some(({ username }) => escapedRegExp.test(username))) {
        return true;
      }

      if (
        scenarios.some(
          id =>
            escapedRegExp.test(lookupCohort(id).title) ||
            escapedRegExp.test(lookupCohort(id).description)
        )
      ) {
        return true;
      }
      return false;
    });

    if (results.length === 0) {
      results.push(...sourceCohorts);
    }

    this.setState({
      cohorts: results
    });
  }

  render() {
    const { isReady, cohort, cohorts, createIsVisible } = this.state;
    const {
      onCreateCohortCancel,
      onCohortNameChange,
      onOpenCreateCohortClick,
      onCohortSearchChange,
      onCreateCohortSubmit
    } = this;

    return (
      <React.Fragment>
        {cohorts && cohorts.length ? (
          <EditorMenu
            type="cohorts"
            items={{
              left: [
                <ConfirmAuth
                  key="menu-item-create-cohort-auth"
                  requiredPermission="create_cohort"
                >
                  <Menu.Item
                    key="menu-item-create-cohort"
                    name="Create a cohort"
                    onClick={onOpenCreateCohortClick}
                    className="em__icon-padding"
                  >
                    <Icon.Group className="em__icon-group-margin">
                      <Icon name="group" />
                      <Icon corner="top right" name="add" color="green" />
                    </Icon.Group>
                    Create a Cohort
                  </Menu.Item>
                </ConfirmAuth>
              ],
              right: [
                <Menu.Menu key="menu-right-search-cohorts" position="right">
                  <Menu.Item
                    key="menu-item-search-cohorts"
                    name="Search cohorts"
                    className="em__icon-padding"
                  >
                    <Input
                      icon="search"
                      placeholder="Search..."
                      onChange={onCohortSearchChange}
                    />
                  </Menu.Item>
                </Menu.Menu>
              ]
            }}
          />
        ) : null}
        <Container fluid>
          <Modal open={createIsVisible} size="small">
            <Header icon="group" content="Create a cohort" />
            <Modal.Content>
              <Form onSubmit={onCreateCohortSubmit}>
                <Input
                  fluid
                  focus
                  placeholder="Enter a name for your cohort"
                  name="name"
                  value={cohort.name}
                  onChange={onCohortNameChange}
                  onSubmit={onCreateCohortSubmit}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="grey" onClick={onCreateCohortCancel}>
                Cancel
              </Button>
              <Button color="green" onClick={onCreateCohortSubmit}>
                Create
              </Button>
            </Modal.Actions>
          </Modal>

          {isReady ? (
            <Grid>
              <Grid.Row>
                <Grid.Column stretched>
                  {cohorts && cohorts.length ? (
                    <Card.Group itemsPerRow={4} stackable>
                      {cohorts.map(({ id }) => (
                        <CohortCard key={id} id={id} />
                      ))}
                    </Card.Group>
                  ) : (
                    <Message
                      size="big"
                      color="yellow"
                      header="You have no cohorts"
                      content={
                        <ConfirmAuth requiredPermission="create_cohort">
                          <Button
                            name="Create a cohort"
                            onClick={onOpenCreateCohortClick}
                            className="em__icon-padding"
                            style={{ background: 'transparent' }}
                          >
                            <Icon.Group className="em__icon-group-margin">
                              <Icon name="group" />
                              <Icon
                                corner="top right"
                                name="add"
                                color="green"
                              />
                            </Icon.Group>
                            Create a Cohort
                          </Button>
                        </ConfirmAuth>
                      }
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ) : (
            <Loading card={{ cols: 4, rows: 2 }} />
          )}
        </Container>
      </React.Fragment>
    );
  }
}

Cohorts.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  cohorts: PropTypes.array,
  cohort: PropTypes.object,
  status: PropTypes.oneOf(['success', 'error', 'requesting', 'init']),
  ids: PropTypes.arrayOf(PropTypes.number),
  error: PropTypes.shape({
    message: PropTypes.string,
    stack: PropTypes.string,
    status: PropTypes.oneOf([PropTypes.string, PropTypes.number])
  }),
  createCohort: PropTypes.func,
  getCohorts: PropTypes.func,
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  getScenarios: PropTypes.func,
  scenarios: PropTypes.array,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  getUser: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { permissions } = state.login;
  const { cohort, cohorts, scenarios, user } = state;
  return { cohort, cohorts, scenarios, user: { ...user, permissions } };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getCohort: id => dispatch(getCohort(id)),
  setCohort: params => dispatch(setCohort(params)),
  getScenarios: () => dispatch(getScenarios()),
  createCohort: params => dispatch(createCohort(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohorts)
);
