import './ScenariosList.css';

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
  Responsive,
  Segment,
  Title
} from '@components/UI';
import { NavLink, withRouter } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import {
  deleteScenario,
  getScenariosCount,
  getScenariosSlice
} from '@actions/scenario';
import { getLabelsByOccurrence, setLabelsInUse } from '@actions/tags';

import Boundary from '@components/Boundary';
import Gate from '@components/Gate';
import History from '@utils/History';
import Layout from '@utils/Layout';
import Loading from '@components/Loading';
import PropTypes from 'prop-types';
import QueryString from '@utils/QueryString';
import ScenarioCard from './ScenarioCard';
import ScenarioDetailModal from './ScenarioDetailModal';
import ScenarioLabels from './ScenarioLabels';
import ScenarioLabelsFilter from './ScenarioLabelsFilter';
import changeCase from 'change-case';
import { connect } from 'react-redux';
import copy from 'copy-text-to-clipboard';
import escapeRegExp from 'lodash.escaperegexp';
import { notify } from '@components/Notification';
import { unloadCohort } from '@actions/cohort';

/* eslint-disable */
const SCENARIO_STATUS_DRAFT = 1;
const SCENARIO_STATUS_PUBLIC = 2;
const SCENARIO_STATUS_PRIVATE = 3;
/* eslint-enable */

const filter = (scenarios, user) => {
  if (!scenarios || !scenarios.length) {
    return [];
  }
  const isLoggedIn = !!(user || user.id);
  const reduced = scenarios.reduce((accum, scenario) => {
    const { status, users } = scenario;

    // If "users" is undefined, this scenario may have been deleted.
    if (!users) {
      return accum;
    }

    const scenarioUser = users.find(({ id }) => user.id === id);
    const isAuthor = scenarioUser && scenarioUser.is_author;
    const isReviewer = scenarioUser && scenarioUser.is_reviewer;
    const isAuthorOrReviewer = isAuthor || isReviewer;

    // Show super admin everything
    if (user.is_super) {
      accum.push(scenario);
      return accum;
    }
    // This scenario status is "draft", to see it:
    //  - user must be logged in
    //  - user must be an author
    //  - user must be a reviewer

    if (
      status === SCENARIO_STATUS_DRAFT &&
      (!isLoggedIn || !isAuthorOrReviewer)
    ) {
      return accum;
    }
    // This scenario status is "private", to see it:
    //  - user must be logged in
    if (status === SCENARIO_STATUS_PRIVATE && !isLoggedIn) {
      return accum;
    }
    accum.push(scenario);

    return accum;
  }, []);

  const { notDeleted, deleted } = reduced.reduce(
    (accum, scenario) => {
      if (scenario.deleted_at && user.is_super) {
        accum.deleted.push(scenario);
      } else {
        accum.notDeleted.push(scenario);
      }
      return accum;
    },
    { notDeleted: [], deleted: [] }
  );

  return [...notDeleted, ...deleted];
};

class ScenariosList extends Component {
  constructor(props) {
    super(props);

    const { page = 1, search = '', l: labelsInUse = [] } = QueryString.parse(
      window.location.search
    );

    this.state = {
      heading: '',
      isReady: false,
      open: false,
      page,
      results: [],
      search,
      selected: null,
      viewHeading: ''
    };

    this.props.setLabelsInUse(labelsInUse);

    this.timeout = null;
    this.scenarios = this.props.scenarios;
    this.onFilterChange = this.onFilterChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onScenarioCardClick = this.onScenarioCardClick.bind(this);
    this.onScenarioModalClose = this.onScenarioModalClose.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  async componentDidMount() {
    const { search } = this.state;
    const count = await this.props.getScenariosCount({ refresh: true });

    await this.props.unloadCohort();
    await this.props.getLabelsByOccurrence();

    if (count <= this.props.scenarios.length) {
      this.scenarios = this.props.scenarios;

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
        await this.props.getScenariosSlice('DESC', offset, limit);

        this.scenarios = this.props.scenarios;
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

  onScenarioCardClick(selected) {
    this.setState({
      open: true,
      selected
    });
  }

  onScenarioModalClose() {
    this.setState({
      open: false,
      selected: null
    });
  }

  onFilterChange() {
    this.setState({
      page: 1
    });
  }

  onSearchChange(event, props) {
    const scenarios = this.scenarios.slice(0);
    const { viewHeading } = this.state;
    const { value: search } = props;
    const page = 1;
    const results = [];
    let replacementHeading = '';

    if (search === '') {
      this.setState({
        heading: viewHeading,
        search,
        page
      });

      this.props.history.push(
        History.composeUrl(this.props.location, {
          page,
          search
        })
      );
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(search), 'i');
    results.push(
      ...scenarios.filter(record => {
        const {
          author: { username },
          categories,
          description,
          title
        } = record;
        if (escapedRegExp.test(title)) {
          return true;
        }

        if (escapedRegExp.test(description)) {
          return true;
        }

        if (escapedRegExp.test(username)) {
          return true;
        }

        if (categories.some(category => escapedRegExp.test(category))) {
          return true;
        }

        return false;
      })
    );

    replacementHeading = `${viewHeading}, matching '${search}'`;

    if (results.length === 0) {
      replacementHeading = `${viewHeading}, nothing matches '${search}'`;
    }

    if (Layout.isForMobile()) {
      replacementHeading = `'${search}'`;
    }

    this.setState({
      heading: replacementHeading,
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

    this.setState({
      page,
      search
    });

    this.props.history.push(
      History.composeUrl(this.props.location, {
        page,
        search
      })
    );
  }

  render() {
    const { category, isLoggedIn, user } = this.props;
    const { page, isReady, heading, open, selected, search } = this.state;
    const {
      onFilterChange,
      onPageChange,
      onScenarioCardClick,
      onScenarioModalClose,
      onSearchChange
    } = this;

    let sourceScenarios = filter(
      // If there's an active search, use the search filtered set
      // of scenarios from state. Otherwise, use the status filtered
      // set from this.scenarios (the untouched backup).
      search ? this.state.results : this.scenarios.slice(0),
      user
    );

    let scenarios = [];
    let displayHeading = '';
    let authorUsername = '';

    switch (category) {
      case 'all': {
        scenarios.push(...sourceScenarios);
        displayHeading = `Showing all scenarios`;
        break;
      }
      case 'author': {
        authorUsername = this.props.match.params.username;
        displayHeading = `Showing scenarios by ${authorUsername}`;
        scenarios.push(
          ...sourceScenarios.filter(
            ({ author: { username } }) => username === authorUsername
          )
        );

        if (scenarios.length === 0) {
          displayHeading = `There are no scenarios by ${authorUsername}`;
        }

        break;
      }
      case 'official':
      case 'community': {
        scenarios.push(
          ...sourceScenarios.filter(({ categories }) =>
            categories.includes(category)
          )
        );
        displayHeading = `${changeCase.titleCase(category)} Scenarios`;
        break;
      }
    }

    // If there are any active label filters, apply them
    if (this.props.tags.labelsInUse.length) {
      scenarios = scenarios.filter(scenario =>
        scenario.labels.some(label =>
          this.props.tags.labelsInUse.includes(label)
        )
      );
    }

    displayHeading = `${displayHeading}${heading}`;

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

    const scenariosPages = Math.ceil(scenarios.length / itemsPerPage);
    const scenariosIndex = (page - 1) * itemsPerPage;
    const scenariosSlice = scenarios.slice(
      scenariosIndex,
      scenariosIndex + itemsPerPage
    );
    const cards = scenariosSlice.map((scenario, index) => {
      return (
        <ScenarioCard
          key={`scenario-card-${scenario.id}-${index}`}
          scenario={scenario}
          isLoggedIn={isLoggedIn}
          onClick={() => onScenarioCardClick(scenario)}
        >
          <ScenarioLabels scenario={scenario} />
        </ScenarioCard>
      );
    });

    const onCopyClick = () => {
      const url = location.href;
      copy(url);
      notify({
        message: url,
        title: 'Copied',
        icon: 'linkify'
      });
    };

    const scenariosHeading = `${displayHeading}`;
    const menuItemScenarioLinkCopy = Layout.isNotForMobile() ? (
      <Button
        icon
        className="sc__hidden-on-mobile"
        labelPosition="left"
        size="small"
        onClick={onCopyClick}
      >
        <Icon name="clipboard outline" className="primary" />
        Copy the url to these scenarios
      </Button>
    ) : null;

    const menuItemScenarioSearch = (
      <Input
        label="Search scenarios"
        className="grid__menu-search"
        icon="search"
        size="big"
        defaultValue={search || ''}
        onChange={onSearchChange}
      />
    );

    const menuItemScenarioLabels = (
      <Menu.Item.Tabbable>
        <ScenarioLabelsFilter onChange={onFilterChange} />
      </Menu.Item.Tabbable>
    );

    const scenarioSearchTools = [
      <Menu.Menu
        className="grid__menu"
        key="menu-item-scenario-search"
        position="right"
      >
        {menuItemScenarioSearch}
        <div className="sl__menu-tools">
          <div>
            <p>
              {scenariosHeading}
              <span className="sl__menu--search-no"> ({scenarios.length})</span>
            </p>
            {menuItemScenarioLinkCopy}
          </div>
          {menuItemScenarioLabels}
        </div>
      </Menu.Menu>
    ];

    const DCSS_BRAND_LABEL =
      process.env.DCSS_BRAND_LABEL || 'Teaching Systems Lab';

    const createScenarioButton = (
      <Gate
        key="menu-item-scenario-create"
        requiredPermission="create_scenario"
      >
        <Button
          fluid
          icon
          primary
          className="sc__hidden-on-mobile"
          labelPosition="left"
          name="Create a scenario"
          size="big"
          href="/editor/new"
          as="a"
        >
          <Icon name="add" />
          Create a Scenario
        </Button>
      </Gate>
    );

    const scenarioSidebarList = Layout.isNotForMobile() ? (
      <List relaxed size="big">
        <List.Item>
          <List.Header className="primary" to="/scenarios/" as={NavLink}>
            All scenarios
          </List.Header>
          <List.Description>See all available scenarios.</List.Description>
        </List.Item>
        {isLoggedIn ? (
          <List.Item>
            <List.Header
              className="primary"
              to={`/scenarios/author/${user.username}/`}
              as={NavLink}
            >
              My scenarios
            </List.Header>
            <List.Description>
              Scenarios I where I am an owner, author, or reviewer.
            </List.Description>
          </List.Item>
        ) : null}
        <List.Item>
          <List.Header
            className="primary"
            to="/scenarios/official/"
            as={NavLink}
          >
            Official
          </List.Header>
          <List.Description>
            Scenarios made by {DCSS_BRAND_LABEL}.
          </List.Description>
        </List.Item>
        <List.Item>
          <List.Header
            className="primary"
            to="/scenarios/community/"
            as={NavLink}
          >
            Community
          </List.Header>
          <List.Description>
            Scenarios made by others in the community.
          </List.Description>
        </List.Item>
      </List>
    ) : null;

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '22em' } }
    };

    const totalPages = scenariosPages;
    const paginationProps = {
      borderless: true,
      name: 'scenarios',
      siblingRange: 1,
      boundaryRange: 0,
      ellipsisItem: null,
      firstItem: null,
      lastItem: null,
      activePage: page,
      onPageChange,
      totalPages
    };

    const cardGroup = (
      <Card.Group.Stackable
        fallback="Sorry, there are no scenarios here."
        itemsPerRow={itemsPerRow}
      >
        {cards}
      </Card.Group.Stackable>
    );

    this.timeout = null;

    return (
      <Fragment>
        <Title content={scenariosHeading} />
        <Grid className="grid__container" stackable columns={2}>
          <Grid.Column className="grid__sidebar" width={4}>
            <div className="grid__header">
              <Header as="h1" attached="top">
                Scenarios
              </Header>
              <Segment attached size="large">
                Scenarios are authored collections of slides which guide a
                participant through a simulation.
              </Segment>
            </div>
            {createScenarioButton}
            {scenarioSidebarList}
          </Grid.Column>
          <Grid.Column className="grid__main" width={12}>
            {scenarioSearchTools}
            <Grid>
              <Boundary top />
              <Grid.Row>
                <Grid.Column stretched>
                  <Responsive
                    onResize={() => {
                      if (this.timeout) {
                        clearTimeout(this.timeout);
                      }
                      this.timeout = setTimeout(() => this.forceUpdate(), 100);
                    }}
                  >
                    {!isReady ? <Loading {...loadingProps} /> : cardGroup}
                  </Responsive>
                </Grid.Column>
              </Grid.Row>
              <Boundary bottom />
              <Grid.Row className="grid__bottom-row">
                <Grid.Column stretched>
                  {scenariosPages > 1 ? (
                    <Pagination {...paginationProps} />
                  ) : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
        {selected ? (
          <ScenarioDetailModal
            open={open}
            onClose={onScenarioModalClose}
            scenario={selected}
          />
        ) : null}
      </Fragment>
    );
  }
}

ScenariosList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  category: PropTypes.string,
  getLabelsByOccurrence: PropTypes.func,
  getScenariosCount: PropTypes.func,
  getScenariosSlice: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  scenarios: PropTypes.array,
  setLabelsInUse: PropTypes.func,
  tags: PropTypes.object,
  unloadCohort: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const {
    scenarios,
    session: { isLoggedIn },
    tags,
    user
  } = state;

  return { isLoggedIn, scenarios, tags, user };
};

const mapDispatchToProps = dispatch => ({
  deleteScenario: id => dispatch(deleteScenario(id)),
  getScenariosCount: params => dispatch(getScenariosCount(params)),
  getScenariosSlice: (...params) => dispatch(getScenariosSlice(...params)),
  getLabelsByOccurrence: () => dispatch(getLabelsByOccurrence()),
  setLabelsInUse: params => dispatch(setLabelsInUse(params)),
  unloadCohort: () => dispatch(unloadCohort())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenariosList)
);
