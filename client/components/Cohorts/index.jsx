import '../ScenariosList/ScenariosList.css';

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
import { NavLink, withRouter } from 'react-router-dom';
import React, { Fragment } from 'react';
import {
  getCohortsCount,
  getCohortsSlice,
  unloadCohort
} from '@actions/cohort';

import CohortCard from './CohortCard';
import CohortCreateWizard from './CohortCreateWizard';
import CohortScenarioLabelsFilter from './CohortScenarioLabelsFilter';
import Gate from '@components/Gate';
import History from '@utils/History';
import Identity from '@utils/Identity';
import Layout from '@utils/Layout';
import Loading from '@components/Loading';
import PropTypes from 'prop-types';
import QueryString from '@utils/QueryString';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { connect } from 'react-redux';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import { getScenariosByStatus } from '@actions/scenario';
import { getUser } from '@actions/user';
import { notify } from '@components/Notification';
import pluralize from 'pluralize';
import { setFilterScenariosInUse } from '@actions/filters';

export class Cohorts extends React.Component {
  constructor(props) {
    super(props);

    const { page = 1, search = '', s: scenariosInUse = [] } = QueryString.parse(
      window.location.search
    );

    this.state = {
      // Indicates when at least the first page of cohorts can be shown
      isReady: false,
      // Indicates when all cohorts have been loaded from the server
      isComplete: false,
      create: {
        isOpen: false
      },
      results: [],
      page,
      search
    };

    this.props.setFilterScenariosInUse(scenariosInUse);

    this.cohorts = this.props.cohorts;
    this.onCreateCohortCancel = this.onCreateCohortCancel.bind(this);
    this.onCreateCohortOpenClick = this.onCreateCohortOpenClick.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();
    await this.props.unloadCohort();
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      const { search } = this.state;
      const count = await this.props.getCohortsCount();

      if (count <= this.props.cohorts.length) {
        this.cohorts = this.props.cohorts;

        this.setState({
          isReady: true,
          isComplete: true
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

        this.setState({
          isComplete: true
        });
      }
    }
  }

  onCreateCohortCancel() {
    this.setState({ create: { isOpen: false } });
  }

  onCreateCohortOpenClick() {
    this.setState({ create: { isOpen: true } });
  }

  onSearchChange(event, props) {
    const { cohorts: sourceCohorts, scenarios } = this.props;
    const { value: search } = props;
    const results = [];
    const page = 1;

    if (search === '') {
      this.props.history.push(
        History.composeUrl(this.props.location, {
          page,
          search
        })
      );

      this.setState({
        results,
        page,
        search
      });
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

    results.push(
      ...sourceCohorts.filter(record => {
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
      })
    );

    this.setState({
      results,
      page,
      search
    });

    const historyEntry = History.composeUrl(this.props.location, {
      page,
      search
    });

    if (!window.location.href.endsWith(historyEntry)) {
      this.props.history.push(historyEntry);
    }
  }

  onPageChange(event, { activePage: page }) {
    const { search } = this.state;

    this.props.history.push(
      History.composeUrl(this.props.location, {
        page,
        search
      })
    );

    this.setState({
      page
    });
  }

  onFilterChange() {
    this.setState({
      page: 1
    });
  }

  render() {
    const { authority, user } = this.props;
    const { page, isComplete, isReady, create, search } = this.state;
    const {
      onCreateCohortCancel,
      onCreateCohortOpenClick,
      onPageChange,
      onFilterChange,
      onSearchChange
    } = this;

    // If there's an active search, use the search filtered set
    // of cohorts from state. Otherwise, use the status filtered
    // set from this.cohorts (the untouched backup).
    const sourceCohorts = search ? this.state.results : this.cohorts.slice(0);
    const { notDeleted, deleted } = sourceCohorts.reduce(
      (accum, cohort) => {
        if (this.props.archived !== cohort.is_archived) {
          return accum;
        }

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

    const cohortListSearch = (
      <Input
        className="grid__menu-search"
        label="Search cohorts"
        icon="search"
        size="big"
        defaultValue={search || ''}
        onChange={onSearchChange}
      />
    );

    const createCohortButton = (
      <Gate key="cohorts-create-cohort" requiredPermission="create_cohort">
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

    const cohortSidebarNav = Layout.isNotForMobile() ? (
      <Gate key="cohorts-sidebar-nav" requiredPermission="create_cohort">
        <List relaxed size="big">
          <List.Item key="/cohorts/active">
            <List.Header className="primary" to="/cohorts/active" as={NavLink}>
              Active
            </List.Header>
            <List.Description>
              Cohorts that are currently running.
            </List.Description>
          </List.Item>
          <List.Item key="/cohorts/archived">
            <List.Header
              className="primary"
              to="/cohorts/archived"
              as={NavLink}
            >
              Archived
            </List.Header>
            <List.Description>Cohorts no longer running.</List.Description>
          </List.Item>
        </List>
      </Gate>
    ) : null;

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

    const isSliceAvailable = cohortsSlice.length > 0;
    const cards = isSliceAvailable
      ? cohortsSlice.map(({ id }) => (
          <CohortCard key={Identity.key({ id })} id={id} />
      ))
      : null;

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '20rem' } }
    };

    const onCopyClick = () => {
      const url = location.href;
      copy(url);
      notify({
        message: url,
        title: 'Copied',
        icon: 'linkify'
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

    const cohortListFilterByScenarioName = (
      <Menu.Item.Tabbable>
        <CohortScenarioLabelsFilter onChange={onFilterChange} />
      </Menu.Item.Tabbable>
    );

    const cohortSearchTools = (
      <Menu.Menu
        className="grid__menu"
        key="menu-item-cohort-search"
        position="right"
      >
        {cohortListSearch}
        <div className="sl__menu-tools">
          <div>
            <p>
              {displayHeading}
              <span className="sl__menu--search-no"> ({cohorts.length})</span>
            </p>
            {cohortsLinkCopy}
          </div>
          {cohortListFilterByScenarioName}
        </div>
      </Menu.Menu>
    );

    const cohortListCount = (
      <p>
        You are a part of <span className="c__list-num">{cohorts.length}</span>{' '}
        {pluralize('cohort', cohorts.length)}.
      </p>
    );

    const isLoading = !isReady || !isSliceAvailable;
    let fallback =
      isLoading && !isComplete
        ? 'Looking for cohorts.'
        : 'Sorry, there are no cohorts here.';

    if (
      authority.isParticipant &&
      !authority.isFacilitator &&
      !cohorts.length
    ) {
      fallback = 'You are not in any cohorts';
    }

    const isParticipantList =
      authority.isParticipant && !authority.isFacilitator && cohorts.length;

    const cardGroup = (
      <Card.Group.Stackable fallback={fallback} itemsPerRow={itemsPerRow}>
        {cards}
      </Card.Group.Stackable>
    );

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
            {createCohortButton}
            {cohortSidebarNav}
          </Grid.Column>
          <Grid.Column className="grid__main" width={12}>
            {authority.isFacilitator ? cohortSearchTools : null}
            {isParticipantList ? cohortListCount : null}
            <Grid>
              <Grid.Row>
                <Grid.Column stretched>
                  {!isReady ? <Loading {...loadingProps} /> : cardGroup}
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

        {create.isOpen ? (
          <CohortCreateWizard onCancel={onCreateCohortCancel} />
        ) : null}
      </Fragment>
    );
  }
}

Cohorts.propTypes = {
  archived: PropTypes.bool,
  authority: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  cohorts: PropTypes.array,
  cohort: PropTypes.object,
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
  unloadCohort: PropTypes.func,
  user: PropTypes.object,
  setFilterScenariosInUse: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const archived = ownProps?.match?.params?.filter === 'archived';
  const { cohort, cohorts, filters, scenarios, user } = state;

  const authority = {
    isFacilitator: user.roles.includes('facilitator') || false,
    isResearcher: user.roles.includes('researcher') || false,
    isParticipant: user.roles.includes('participant') || false
  };

  // Super admins have unrestricted access to cohorts
  if (user.is_super) {
    authority.isOwner = true;
    authority.isFacilitator = true;
    authority.isResearcher = true;
    authority.isParticipant = true;
  }

  return { authority, archived, cohort, cohorts, filters, scenarios, user };
};

const mapDispatchToProps = dispatch => ({
  getCohortsCount: () => dispatch(getCohortsCount()),
  getCohortsSlice: (...params) => dispatch(getCohortsSlice(...params)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status)),
  getUser: () => dispatch(getUser()),
  setFilterScenariosInUse: params => dispatch(setFilterScenariosInUse(params)),
  unloadCohort: () => dispatch(unloadCohort())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohorts)
);
