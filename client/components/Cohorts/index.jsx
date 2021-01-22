import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import pluralize from 'pluralize';
import * as QueryString from 'query-string';
import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Input,
  List,
  Menu,
  Pagination,
  Segment,
  Title
} from '@components/UI';
import {
  getCohorts,
  getCohortsCount,
  getCohortsSlice,
  getCohort,
  createCohort
} from '@actions/cohort';
import { setFilterScenariosInUse } from '@actions/filters';
import { getScenariosByStatus } from '@actions/scenario';
import { getUser } from '@actions/user';
import Gate from '@components/Gate';
import Loading from '@components/Loading';
import Layout from '@utils/Layout';
import { notify } from '@components/Notification';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import CohortCard from './CohortCard';
import CohortScenarioLabelsFilter from './CohortScenarioLabelsFilter';
import CohortCreateWizard from './CohortCreateWizard';
import Identity from '@utils/Identity';
import '../ScenariosList/ScenariosList.css';

const qsOpts = {
  arrayFormat: 'bracket'
};

function parseQueryString(input) {
  return QueryString.parse(input || window.location.search, qsOpts);
}

function makeQueryString(keyVals) {
  return `?${QueryString.stringify(keyVals, qsOpts)}`;
}

function makeHistoryUrl(location, keyVals) {
  const searchString = makeQueryString(keyVals);
  return `${location.pathname}${searchString}`;
}

export class Cohorts extends React.Component {
  constructor(props) {
    super(props);

    const { page = 1, search = '', s: scenariosInUse = [] } = parseQueryString(
      window.location.search
    );

    const cohorts = this.props.cohorts;

    this.state = {
      isReady: false,
      createIsVisible: false,
      cohorts,
      page,
      search
    };

    this.props.setFilterScenariosInUse(scenariosInUse);

    this.cohorts = cohorts;
    this.onCreateCohortCancel = this.onCreateCohortCancel.bind(this);
    this.onCreateCohortOpenClick = this.onCreateCohortOpenClick.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onScenarioLabelsFilterChange = this.onScenarioLabelsFilterChange.bind(
      this
    );
  }

  async componentDidMount() {
    await this.props.getUser();
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      const { search } = this.state;
      const count = await this.props.getCohortsCount();

      if (count <= this.props.cohorts.length) {
        this.cohorts = this.props.cohorts;

        this.setState({
          isReady: true
        });

        if (search) {
          this.onSearchChange({}, { value: search });
        }
      } else {
        const limit = 20;
        let offset = 0;
        do {
          await this.props.getCohortsSlice('DESC', offset, limit);

          this.cohorts = this.props.cohorts;
          this.setState({
            isReady: true
          });

          if (search) {
            this.onSearchChange({}, { value: search });
          }

          offset += limit;
        } while (offset < count);
      }
    }
  }

  onCreateCohortCancel() {
    this.setState({ createIsVisible: false });
  }

  onCreateCohortOpenClick() {
    this.setState({ createIsVisible: true });
  }

  onSearchChange(event, props) {
    const { cohorts: sourceCohorts, scenarios } = this.props;
    const { value: search } = props;
    const page = 1;

    if (search === '') {
      this.setState({
        cohorts: sourceCohorts,
        page,
        search
      });

      this.props.history.push(makeHistoryUrl(this.props.location, { page }));
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(search), 'i');
    const lookupScenario = id => {
      return (
        scenarios.find(scenario => scenario.id === id) || {
          title: '',
          description: ''
        }
      );
    };

    const searchScenario = id => {
      const scenario = lookupScenario(id);

      // categories [String]
      // labels [String]
      // personas [Object]
      // users [Object]

      if (
        escapedRegExp.test(scenario.title) ||
        escapedRegExp.test(scenario.description)
      ) {
        return true;
      }

      return false;
    };

    const results = sourceCohorts.filter(record => {
      const { name, scenarios, users } = record;

      if (escapedRegExp.test(name)) {
        return true;
      }

      if (users.some(({ username }) => escapedRegExp.test(username))) {
        return true;
      }

      if (scenarios.some(id => searchScenario(id))) {
        return true;
      }
      return false;
    });

    if (results.length === 0) {
      results.push(...sourceCohorts);
    }

    this.setState({
      cohorts: results,
      page,
      search
    });

    this.props.history.push(
      makeHistoryUrl(this.props.location, { page, search })
    );
  }

  onPageChange(event, { activePage: page }) {
    const { search } = this.state;

    const searchParams = { page };

    if (search) {
      searchParams.search = search;
    }

    this.props.history.push(makeHistoryUrl(this.props.location, searchParams));

    this.setState({
      page
    });
  }

  onScenarioLabelsFilterChange() {
    this.setState({
      page: 1
    });
  }

  render() {
    const { user } = this.props;
    const { page, isReady, createIsVisible, search } = this.state;
    const {
      onCreateCohortCancel,
      onCreateCohortOpenClick,
      onPageChange,
      onScenarioLabelsFilterChange,
      onSearchChange
    } = this;

    // If there's an active search, use the search filtered set
    // of cohorts from state. Otherwise, use the status filtered
    // set from this.cohorts (the untouched backup).
    const sourceCohorts = search ? this.state.cohorts : this.cohorts.slice(0);
    const { notDeleted, deleted } = sourceCohorts.reduce(
      (accum, cohort) => {
        if (cohort.deleted_at && user.is_super) {
          accum.deleted.push(cohort);
        } else {
          accum.notDeleted.push(cohort);
        }
        return accum;
      },
      { notDeleted: [], deleted: [] }
    );

    let cohorts = [...notDeleted, ...deleted];

    // If there are any active label filters, apply them
    if (this.props.filters.scenariosInUse.length) {
      cohorts = cohorts.filter(cohort =>
        cohort.scenarios.some(id =>
          this.props.filters.scenariosInUse.includes(id)
        )
      );
    }

    let displayHeading = 'Showing all cohorts';

    if (search) {
      displayHeading = `${displayHeading}, matching '${search}'`;
    }

    const { permissions } = this.props;

    const createCohortButton = (
      <Gate
        key="menu-item-create-cohort-auth"
        requiredPermission="create_cohort"
      >
        <Button
          fluid
          icon
          primary
          className="sc__hidden-on-mobile"
          labelPosition="left"
          name="Create a cohort"
          size="big"
          onClick={onCreateCohortOpenClick}
        >
          <Icon name="add" />
          Create a Cohort
        </Button>
      </Gate>
    );

    const menuItemCountCohorts = (
      <p>
        You are a part of <span className="c__list-num">{cohorts.length}</span>{' '}
        {pluralize('cohort', cohorts.length)}.
      </p>
    );

    const menuItemCohortsSearch = cohorts.length ? (
      <Input
        className="grid__menu-search"
        label="Search cohorts"
        icon="search"
        size="big"
        defaultValue={search || ''}
        onChange={onSearchChange}
      />
    ) : null;

    const cohortSideNav = (
      <List relaxed size="big">
        <List.Item>
          <List.Header className="c__primary-sidenav" as="button">
            Active
          </List.Header>
          <List.Description>
            Cohorts that are currently running.
          </List.Description>
        </List.Item>
        <List.Item>
          <List.Header className="c__primary-sidenav" as="button">
            Archived
          </List.Header>
          <List.Description>Cohorts no longer running.</List.Description>
        </List.Item>
      </List>
    );

    const cohortAuthorActions = (
      <Fragment>
        {createCohortButton}
        {cohortSideNav}
      </Fragment>
    );

    const cohortPermissionActions = [
      permissions.includes('create_cohort')
        ? cohortAuthorActions
        : menuItemCountCohorts
    ];

    const defaultRowCount = 2;
    const {
      itemsPerRow,
      itemsPerPage,
      rowsPerPage
    } = Layout.computeItemsRowsPerPage({
      itemsColWidth: Layout.isForMobile() ? 320 : 320,
      itemsRowHeight: Layout.isForMobile() ? 200 : 300,
      itemsPerRow: 2,
      defaultRowCount
    });

    const cohortsPages = Math.ceil(cohorts.length / itemsPerPage);
    const cohortsIndex = (page - 1) * itemsPerPage;
    const cohortsSlice = cohorts.slice(
      cohortsIndex,
      cohortsIndex + itemsPerPage
    );

    let isSliceAvailable = cohortsSlice.length > 0;

    const cards = isSliceAvailable
      ? cohortsSlice.map(cohort => {
          return <CohortCard key={Identity.key(cohort)} id={cohort.id} />;
        })
      : null;

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '20rem' } }
    };

    const cardGroup = isSliceAvailable ? (
      <Card.Group.Stackable itemsPerRow={itemsPerRow}>
        {cards}
      </Card.Group.Stackable>
    ) : null;

    const onCopyClick = () => {
      const url = location.href;
      copy(url);
      notify({
        message: `Copied: ${url}`
      });
    };

    const cohortsLinkCopy = Layout.isNotForMobile() ? (
      <Button
        icon
        className="sc__hidden-on-mobile"
        labelPosition="left"
        size="small"
        onClick={onCopyClick}
      >
        <Icon name="clipboard outline" className="primary" />
        Copy the url to these cohorts
      </Button>
    ) : null;

    const menuItemCohortScenarioLabels = (
      <Menu.Item.Tabbable>
        <CohortScenarioLabelsFilter onChange={onScenarioLabelsFilterChange} />
      </Menu.Item.Tabbable>
    );

    const cohortSearchTools = [
      <Menu.Menu
        className="grid__menu"
        key="menu-item-cohort-search"
        position="right"
      >
        {menuItemCohortsSearch}
        <div className="sl__menu-tools">
          <div>
            <p>
              {displayHeading}
              <span className="sl__menu--search-no"> ({cohorts.length})</span>
            </p>
            {cohortsLinkCopy}
          </div>
          {menuItemCohortScenarioLabels}
        </div>
      </Menu.Menu>
    ];
    return (
      <Fragment>
        <Title content={displayHeading} />
        <Grid className="grid__container" stackable columns={2}>
          <Grid.Column className="grid__sidebar" width={4}>
            <div className="grid__header">
              <Header as="h1" attached="top">
                Cohorts
              </Header>
              <Segment attached size="large">
                Cohorts are specific groups of participants (or your class)
                assigned to a scenario or set of scenarios.
              </Segment>
            </div>
            {cohortPermissionActions}
          </Grid.Column>
          <Grid.Column className="grid__main" width={12}>
            {cohortSearchTools}
            <Grid>
              <Grid.Row>
                <Grid.Column stretched>
                  {!isReady || !isSliceAvailable ? (
                    <Loading {...loadingProps} />
                  ) : (
                    cardGroup
                  )}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="grid__bottom-row">
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
                      activePage={page}
                      onPageChange={onPageChange}
                      totalPages={cohortsPages}
                    />
                  ) : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>

        {createIsVisible ? (
          <CohortCreateWizard onCancel={onCreateCohortCancel} />
        ) : null}
      </Fragment>
    );
  }
}

Cohorts.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  cohorts: PropTypes.array,
  cohort: PropTypes.object,
  createCohort: PropTypes.func,
  getCohorts: PropTypes.func,
  getCohortsCount: PropTypes.func,
  getCohortsSlice: PropTypes.func,
  getCohort: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  filters: PropTypes.object,
  ids: PropTypes.arrayOf(PropTypes.number),
  location: PropTypes.object,
  scenarios: PropTypes.array,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  getUser: PropTypes.func,
  user: PropTypes.object,
  permissions: PropTypes.array,
  setFilterScenariosInUse: PropTypes.func
};

const mapStateToProps = state => {
  const { permissions } = state.session;
  const { cohort, cohorts, filters, scenarios, user } = state;
  return { cohort, cohorts, filters, permissions, scenarios, user };
};

const mapDispatchToProps = dispatch => ({
  createCohort: params => dispatch(createCohort(params)),
  getCohorts: () => dispatch(getCohorts()),
  getCohortsCount: () => dispatch(getCohortsCount()),
  getCohortsSlice: (...params) => dispatch(getCohortsSlice(...params)),
  getCohort: id => dispatch(getCohort(id)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status)),
  getUser: () => dispatch(getUser()),
  setFilterScenariosInUse: params => dispatch(setFilterScenariosInUse(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohorts)
);