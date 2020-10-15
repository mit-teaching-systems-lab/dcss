import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
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
  Modal,
  Pagination,
  Title
} from '@components/UI';
import {
  getAllCohorts,
  getCohorts,
  getCohort,
  setCohort,
  createCohort
} from '@actions/cohort';
import { computeItemsRowsPerPage } from '@utils/Layout';
import { getScenariosIncrementally } from '@actions/scenario';
import { getUser } from '@actions/user';
import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import CohortCard from './CohortCard';
import CohortEmpty from './CohortEmpty';
import Identity from '@utils/Identity';
import '../ScenariosList/ScenariosList.css';

export class Cohorts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: 1,
      isReady: false,
      createIsVisible: false,
      cohorts: [],
      scenarios: []
    };

    this.cohort = new CohortEmpty();

    this.onCreateCohortCancel = this.onCreateCohortCancel.bind(this);
    this.onOpenCreateCohortClick = this.onOpenCreateCohortClick.bind(this);
    this.onCohortSearchChange = this.onCohortSearchChange.bind(this);
    this.onCreateCohortSubmit = this.onCreateCohortSubmit.bind(this);
    this.onCreateCohortChange = this.onCreateCohortChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      if (this.props.user.is_super) {
        await this.props.getAllCohorts();
      } else {
        await this.props.getCohorts();
      }

      await this.props.getScenariosIncrementally();

      this.setState({
        activePage: 1,
        isReady: true,
        cohorts: this.props.cohorts,
        scenarios: this.props.scenarios
      });
    }
  }

  async onCreateCohortSubmit() {
    const { name } = this.cohort;

    const { id } = await this.props.createCohort({
      name
    });

    location.href = `/cohort/${id}`;
  }

  onCreateCohortCancel() {
    this.setState({ createIsVisible: false });
  }

  onCreateCohortChange(event, { name, value }) {
    this.cohort[name] = value;
  }

  onOpenCreateCohortClick() {
    this.setState({ createIsVisible: true });
  }

  onCohortSearchChange(event, props) {
    const { cohorts: sourceCohorts, scenarios } = this.props;
    const { value } = props;

    if (value === '') {
      this.setState({
        activePage: 1,
        cohorts: sourceCohorts
      });

      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
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
      activePage: 1,
      cohorts: results
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  render() {
    const { activePage, isReady, cohorts, createIsVisible } = this.state;
    const {
      onCreateCohortCancel,
      onCohortSearchChange,
      onCreateCohortChange,
      onCreateCohortSubmit,
      onOpenCreateCohortClick,
      onPageChange
    } = this;

    const { user } = this.props;

    const defaultRowCount = 2;
    const { itemsPerPage, rowsPerPage } = computeItemsRowsPerPage({
      defaultRowCount
    });

    const menuItemCreateCohorts = (
      <ConfirmAuth
        key="menu-item-create-cohort-auth"
        requiredPermission="create_cohort"
      >
        <Menu.Item.Tabbable
          key="menu-item-create-cohort"
          name="Create a cohort"
          onClick={onOpenCreateCohortClick}
        >
          <Icon.Group className="em__icon-group-margin">
            <Icon name="group" />
            <Icon corner="top right" name="add" color="green" />
          </Icon.Group>
          Create a Cohort
        </Menu.Item.Tabbable>
      </ConfirmAuth>
    );

    const menuItemCountCohorts = (
      <Menu.Item.Tabbable key="menu-item-count-cohort" name="Cohorts">
        <Icon.Group className="em__icon-group-margin">
          <Icon name="group" />
        </Icon.Group>
        Cohorts {cohorts.length ? `(${cohorts.length})` : null}
      </Menu.Item.Tabbable>
    );

    const menuItemSearchCohorts =
      cohorts.length > itemsPerPage ? (
        <Menu.Menu key="menu-right-search-cohorts" position="right">
          <Menu.Item.Tabbable name="Search cohorts">
            <Input
              icon="search"
              placeholder="Search..."
              onChange={onCohortSearchChange}
            />
          </Menu.Item.Tabbable>
        </Menu.Menu>
      ) : null;

    const left = [
      user.permissions.includes('create_cohort')
        ? menuItemCreateCohorts
        : menuItemCountCohorts
    ];

    const right = [menuItemSearchCohorts];

    const cohortsPages = Math.ceil(cohorts.length / itemsPerPage);
    const cohortsIndex = (activePage - 1) * itemsPerPage;
    const cohortsSlice = cohorts.slice(
      cohortsIndex,
      cohortsIndex + itemsPerPage
    );
    const cards = cohortsSlice.map(cohort => {
      return <CohortCard key={Identity.key(cohort)} id={cohort.id} />;
    });

    const itemsPerRow = 4;
    const ariaLabelledby = Identity.id();
    const ariaDescribedby = Identity.id();

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '20rem' } }
    };

    const cardGroup = (
      <Card.Group.Stackable
        fallback="No cohorts yet!"
        itemsPerRow={itemsPerRow}
      >
        {cards}
      </Card.Group.Stackable>
    );

    const pageTitle = `Cohorts (${cohorts.length})`;
    return (
      <React.Fragment>
        <Title content={pageTitle} />

        <EditorMenu
          type="cohorts"
          items={{
            left,
            right
          }}
        />
        <Container fluid>
          <Grid>
            <Grid.Row>
              <Grid.Column stretched>
                {!isReady ? <Loading {...loadingProps} /> : cardGroup}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column stretched>
                {cohortsPages > 1 ? (
                  <Pagination
                    borderless
                    name="cohorts"
                    siblingRange={1}
                    boundaryRange={0}
                    ellipsisItem={null}
                    firstItem={null}
                    lastItem={null}
                    activePage={activePage}
                    onPageChange={onPageChange}
                    totalPages={cohortsPages}
                  />
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        {createIsVisible ? (
          <Modal.Accessible open={createIsVisible}>
            <Modal
              size="small"
              role="dialog"
              aria-modal="true"
              aria-labelledby={ariaLabelledby}
              aria-describedby={ariaDescribedby}
              open={createIsVisible}
            >
              <Header
                icon="group"
                content="Create a cohort"
                id={ariaLabelledby}
              />
              <Modal.Content id={ariaDescribedby}>
                <Form onSubmit={onCreateCohortSubmit}>
                  <Input
                    fluid
                    focus
                    placeholder="Enter a name for your cohort"
                    name="name"
                    onSubmit={onCreateCohortSubmit}
                    onChange={onCreateCohortChange}
                  />
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button color="green" onClick={onCreateCohortSubmit}>
                    Create
                  </Button>
                  <Button.Or />
                  <Button color="grey" onClick={onCreateCohortCancel}>
                    Cancel
                  </Button>
                </Button.Group>
              </Modal.Actions>
            </Modal>
          </Modal.Accessible>
        ) : null}
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
  getAllCohorts: PropTypes.func,
  getCohorts: PropTypes.func,
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  getScenariosIncrementally: PropTypes.func,
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
  getAllCohorts: () => dispatch(getAllCohorts()),
  getCohorts: () => dispatch(getCohorts()),
  getCohort: id => dispatch(getCohort(id)),
  setCohort: params => dispatch(setCohort(params)),
  getScenariosIncrementally: () => dispatch(getScenariosIncrementally()),
  createCohort: params => dispatch(createCohort(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Cohorts)
);
