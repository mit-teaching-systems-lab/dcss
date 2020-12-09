import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Grid,
  Header,
  Icon,
  Input,
  List,
  Menu,
  Pagination,
  Popup,
  Responsive,
  Title
} from '@components/UI';
import escapeRegExp from 'lodash.escaperegexp';
import copy from 'copy-text-to-clipboard';
import changeCase from 'change-case';
import Layout from '@utils/Layout';
import {
  deleteScenario,
  getScenariosCount,
  getScenariosSlice
} from '@actions/scenario';
import { getLabelsByOccurrence } from '@actions/tags';
import { setLabelsInUse } from '@actions/tags';
import Boundary from '@components/Boundary';
import Gate from '@components/Gate';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import ScenarioCard from './ScenarioCard';
import ScenarioDetailModal from './ScenarioDetailModal';
import ScenarioLabelsFilter from './ScenarioLabelsFilter';
import { Link } from 'react-router-dom';
import './ScenariosList.css';

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

  const notDeleted = reduced.filter(({ deleted_at }) => !deleted_at);
  const deleted = user.is_super
    ? reduced.filter(({ deleted_at }) => deleted_at)
    : [];

  return [...notDeleted, ...deleted];
};

const qsOpts = {
  arrayFormat: 'bracket'
};

function makeQueryString(search) {
  const qs = {};
  const { l } = QueryString.parse(window.location.search, qsOpts);

  if (search) {
    qs.search = search;
  }

  if (l && l.length) {
    qs.l = l;
  }

  return `?${QueryString.stringify(qs, qsOpts)}`;
}

class ScenariosList extends Component {
  constructor(props) {
    super(props);

    const { category, scenarios } = this.props;
    const { search = '', l: labels = [] } = QueryString.parse(
      window.location.search,
      qsOpts
    );
    this.state = {
      activePage: 1,
      category,
      heading: '',
      isReady: false,
      open: false,
      scenarios,
      search,
      selected: null,
      viewHeading: ''
    };

    this.props.setLabelsInUse(labels);

    this.timeout = null;
    this.scenarios = scenarios;
    this.onPageChange = this.onPageChange.bind(this);
    this.onScenarioCardClick = this.onScenarioCardClick.bind(this);
    this.onScenarioModalClose = this.onScenarioModalClose.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  async componentDidMount() {
    const { search } = this.state;
    const count = await this.props.getScenariosCount();

    await this.props.getLabelsByOccurrence();

    if (count === this.props.scenarios.length) {
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
        this.scenarios.push(
          ...(await this.props.getScenariosSlice('DESC', offset, limit))
        );

        this.setState({
          isReady: true
        });

        if (search) {
          this.onSearchChange({}, { value: search });
        }

        offset += limit;
      } while (this.scenarios.length < count);
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

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  onSearchChange(event, props) {
    const scenarios = this.scenarios.slice(0);
    const { viewHeading } = this.state;
    const { value } = props;
    let replacementHeading = '';

    if (value === '') {
      this.setState({
        activePage: 1,
        heading: viewHeading,
        scenarios
      });

      this.props.history.push(
        `${this.props.location.pathname}${makeQueryString('')}`
      );

      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const results = scenarios.filter(record => {
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
    });

    replacementHeading = `${viewHeading}, matching '${value}'`;

    if (results.length === 0) {
      results.push(...scenarios);
      replacementHeading = `${viewHeading}, nothing matches '${value}'`;
    }

    if (Layout.isForMobile()) {
      replacementHeading = `'${value}'`;
    }

    const search = value;

    this.setState({
      activePage: 1,
      heading: replacementHeading,
      scenarios: results,
      search
    });

    this.props.history.push(
      `${this.props.location.pathname}${makeQueryString(search)}`
    );
  }

  render() {
    const { isLoggedIn } = this.props;
    const {
      activePage,
      category,
      isReady,
      heading,
      open,
      selected,
      search
    } = this.state;
    const {
      onPageChange,
      onScenarioCardClick,
      onScenarioModalClose,
      onSearchChange
    } = this;
    const { origin, pathname } = window.location;

    let sourceScenarios = filter(
      // If there's an active search, use the search filtered set
      // of scenarios from state. Otherwise, use the status filtered
      // set from this.scenarios (the untouched backup).
      search ? this.state.scenarios : this.scenarios.slice(0),
      this.props.user
    );

    let scenarios = [];
    let displayHeading = '';
    let authorUsername = '';

    switch (category) {
      case 'all': {
        scenarios.push(...sourceScenarios);
        displayHeading = 'Showing all scenarios';
        break;
      }
      case 'author': {
        authorUsername = this.props.match.params.username;
        displayHeading = `Showing scenarios by ${authorUsername}`;
        scenarios.push(
          ...sourceScenarios.filter(({ author: { username } }) => {
            return username === authorUsername;
          })
        );

        if (scenarios.length === 0) {
          displayHeading = `There are no scenarios by ${authorUsername}`;
        }

        break;
      }
      case 'official':
      case 'community': {
        scenarios = sourceScenarios.filter(({ categories }) => {
          return !category || categories.includes(category);
        });
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

    displayHeading = `${displayHeading} ${heading}`;

    const url = `${origin}${pathname}${makeQueryString(search)}`;
    const defaultRowCount = 2;
    const {
      itemsPerRow,
      itemsPerPage,
      rowsPerPage
    } = Layout.computeItemsRowsPerPage({
      itemsColWidth: Layout.isForMobile() ? 320 : 320,
      itemsRowHeight: Layout.isForMobile() ? 200 : 243,
      itemsPerRow: 3,
      defaultRowCount
    });

    const scenariosPages = Math.ceil(scenarios.length / itemsPerPage);
    const scenariosIndex = (activePage - 1) * itemsPerPage;
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
        />
      );
    });

    const onCopyClick = () => {
      copy(url);
      notify({
        message: `Copied: ${url}`
      });
    };

    const menuItemScenarioLinkCopyLeft = Layout.isForMobile() ? (
      <Menu.Item.Tabbable
        key="menu-item-scenario-link-copy-left"
        style={{ width: '45%' }}
        className="em__overflow-truncated"
        onClick={onCopyClick}
      >
        {displayHeading} ({scenarios.length})
      </Menu.Item.Tabbable>
    ) : null;

    const left = [
      <Gate
        key="menu-item-scenario-create"
        requiredPermission="create_scenario"
      >
        <Button
          primary
          as={Link}
          to="/editor/new"
          icon
          labelPosition="left"
          name="Create a scenario"
          href="/editor/new"
          className="sc__hidden-on-mobile"
        >
          <Icon name="add" />
          Create a Scenario
        </Button>
      </Gate>,

      menuItemScenarioLinkCopyLeft
    ];

    const scenariosHeading = `${displayHeading} (${scenarios.length})`;
    const menuItemScenarioLinkCopyRight = Layout.isNotForMobile() ? (
      <Menu.Item.Tabbable
        className="sc__hidden-on-mobile"
        onClick={onCopyClick}
      >
        {scenariosHeading}
        <Icon name="clipboard outline" />
      </Menu.Item.Tabbable>
    ) : null;

    const menuItemScenarioSearch = (
      <Menu.Item.Tabbable>
        <Input
          icon="search"
          placeholder="Search..."
          defaultValue={search || ''}
          onChange={onSearchChange}
        />
      </Menu.Item.Tabbable>
    );

    const menuItemScenarioLabels = (
      <Menu.Item.Tabbable>
        <ScenarioLabelsFilter />
      </Menu.Item.Tabbable>
    );

    const right = [
      <Menu.Menu
        className="sl__menu"
        key="menu-item-scenario-search"
        position="right"
      >
        <Popup
          inverted
          size="tiny"
          content="Copy the url to these scenarios"
          trigger={menuItemScenarioLinkCopyRight}
        />
        <Popup
          inverted
          size="tiny"
          content="Search scenarios"
          trigger={menuItemScenarioSearch}
        />
        <Popup
          inverted
          size="tiny"
          content="Filter scenarios by label"
          trigger={menuItemScenarioLabels}
        />
      </Menu.Menu>
    ];

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '18rem' } }
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
      activePage,
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
        <Grid stackable columns={2}>
          <Grid.Column width={4}>
            <Header as="h1" size="medium">
              Scenarios
            </Header>
            <p>
              Scenarios are authored collections of slides which guide a
              participant through a simulation.
            </p>
            <Button
              className="sc__hidden-on-mobile"
              primary
              as={Link}
              to="#"
              icon
              fluid
              labelPosition="left"
            >
              <Icon name="plus" />
              Create a scenario
            </Button>
            <List>
              <List.Item>
                <List.Header as="a">My scenarios</List.Header>
                <List.Description>Scenarios I’ve created</List.Description>
              </List.Item>
              <List.Item>
                <List.Header as="a">Official</List.Header>
                <List.Description>
                  Scenarios made by the Teaching Systems Lab
                </List.Description>
              </List.Item>
              <List.Item>
                <List.Header as="a">Community</List.Header>
                <List.Description>Scenarios made by others</List.Description>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column width={12}>
            <Title content={scenariosHeading} />
            <EditorMenu type="scenarios" items={{ right }} />
            <Container fluid>
              <Grid>
                <Boundary top />
                <Grid.Row>
                  <Grid.Column stretched>
                    <Responsive
                      onUpdate={() => {
                        if (this.timeout) {
                          clearTimeout(this.timeout);
                        }
                        this.timeout = setTimeout(
                          () => this.forceUpdate(),
                          100
                        );
                      }}
                    >
                      {!isReady ? <Loading {...loadingProps} /> : cardGroup}
                    </Responsive>
                  </Grid.Column>
                </Grid.Row>
                <Boundary bottom />
                <Grid.Row>
                  <Grid.Column stretched>
                    {scenariosPages > 1 ? (
                      <Pagination {...paginationProps} />
                    ) : null}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
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
  getScenariosCount: () => dispatch(getScenariosCount()),
  getScenariosSlice: (...params) => dispatch(getScenariosSlice(...params)),
  getLabelsByOccurrence: () => dispatch(getLabelsByOccurrence()),
  setLabelsInUse: params => dispatch(setLabelsInUse(params))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ScenariosList)
);
