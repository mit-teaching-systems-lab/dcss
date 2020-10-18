import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Card,
  Container,
  Grid,
  Header,
  Icon,
  Input,
  Menu,
  Modal,
  Pagination,
  Popup,
  Responsive,
  Title
} from '@components/UI';
import escapeRegExp from 'lodash.escaperegexp';
import copy from 'copy-text-to-clipboard';
import changeCase from 'change-case';
import Moment from '@utils/Moment';
import Layout from '@utils/Layout';
import {
  deleteScenario,
  getScenariosCount,
  getScenariosSlice
} from '@actions/scenario';
import Boundary from '@components/Boundary';
import ConfirmAuth from '@components/ConfirmAuth';
import Username from '@components/User/Username';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import ScenarioCard from './ScenarioCard';
import ScenarioCardActions from './ScenarioCardActions';
import Identity from '@utils/Identity';
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

class ScenariosList extends Component {
  constructor(props) {
    super(props);

    const { category } = this.props;
    const value = decodeURIComponent(window.location.search.replace('?q=', ''));
    const scenarios = this.props.scenarios;

    this.state = {
      activePage: 1,
      category,
      heading: '',
      isReady: false,
      open: false,
      scenarios,
      selected: null,
      value,
      viewHeading: '',
    };

    this.timeout = null;
    this.scenarios = scenarios;
    this.onPageChange = this.onPageChange.bind(this);
    this.onScenarioCardClick = this.onScenarioCardClick.bind(this);
    this.onScenarioModalClose = this.onScenarioModalClose.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  async componentDidMount() {
    const { value } = this.state;
    const count = await this.props.getScenariosCount();

    if (count === this.props.scenarios.length) {
      this.scenarios = this.props.scenarios;

      this.setState({
        isReady: true,
        scenarios: this.scenarios
      });

      if (value) {
        this.onSearchChange({}, { value });
      }
    } else {
      const limit = 20;
      let offset = 0;
      do {
        this.scenarios.push(...(await this.props.getScenariosSlice('DESC', offset, limit)));

        this.setState({
          isReady: true,
          scenarios: this.scenarios
        });

        if (value) {
          this.onSearchChange({}, { value });
        }

        offset += limit;
      } while (count > this.props.scenarios.length);
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

      this.props.history.push(`${this.props.location.pathname}`);

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

    this.setState({
      activePage: 1,
      heading: replacementHeading,
      scenarios: results,
      value
    });

    this.props.history.push(
      `${this.props.location.pathname}?q=${encodeURIComponent(value)}`
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
      value
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
      value ? this.state.scenarios : this.scenarios.slice(0),
      this.props.user
    );

    let scenarios = [];
    let displayHeading = '';
    let authorUsername = '';

    switch (category) {
      case 'all': {
        scenarios.push(...sourceScenarios);
        displayHeading = 'All Scenarios';
        break;
      }
      case 'author': {
        authorUsername = this.props.match.params.username;
        displayHeading = `Scenarios by ${authorUsername}`;
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

    displayHeading = `${displayHeading} ${heading}`;

    let url = `${origin}${pathname}`;

    if (value) {
      url += `?q=${encodeURIComponent(value)}`;
    }

    const defaultRowCount = 2;
    const {
      itemsPerRow,
      itemsPerPage,
      rowsPerPage
    } = Layout.computeItemsRowsPerPage({
      itemsColWidth: Layout.isForMobile() ? 320 : 320,
      itemsRowHeight: Layout.isForMobile() ? 200 : 243,
      itemsPerRow: 4,
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
      <ConfirmAuth
        key="menu-item-scenario-create"
        requiredPermission="create_scenario"
      >
        <Menu.Item.Tabbable
          name="Create a scenario"
          href="/editor/new"
          className="sc__hidden-on-mobile"
        >
          <Icon.Group className="em__icon-group-margin">
            <Icon name="newspaper outline" />
            <Icon corner="top right" name="add" color="green" />
          </Icon.Group>
          Create a Scenario
        </Menu.Item.Tabbable>
      </ConfirmAuth>,

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
          defaultValue={value || ''}
          onChange={onSearchChange}
        />
      </Menu.Item.Tabbable>
    );
    const right = [
      <Menu.Menu key="menu-item-scenario-search" position="right">
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
      </Menu.Menu>
    ];

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '20rem' } }
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
        <Title content={scenariosHeading} />
        <EditorMenu type="scenarios" items={{ left, right }} />
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
                    this.timeout = setTimeout(() => this.forceUpdate(), 100);
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

const ScenarioDetailModal = ({ onClose, open, scenario }) => {
  const createdAt = Moment(scenario.created_at).fromNow();
  const createdAtAlt = Moment(scenario.created_at).calendar();
  const username = <Username {...scenario.author} />;
  const subheader = (
    <span title={createdAtAlt}>
      Created by {username} ({createdAt})
    </span>
  );

  const ariaLabelledby = Identity.id();
  const ariaDescribedby = Identity.id();
  return (
    <Modal.Accessible open={open}>
      <Modal
        closeIcon
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        centered={false}
        open={open}
        onClose={onClose}
      >
        <Header id={ariaLabelledby}>{scenario.title}</Header>
        <Modal.Content>{subheader}</Modal.Content>
        <Modal.Content id={ariaDescribedby}>
          <Modal.Description className="sc__modal-description">
            {scenario.description}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <ScenarioCardActions scenario={scenario} />
        </Modal.Actions>
      </Modal>
    </Modal.Accessible>
  );
};

ScenarioDetailModal.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  scenario: PropTypes.object
};

ScenariosList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  category: PropTypes.string,
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
  user: PropTypes.object
};

const mapStateToProps = state => {
  const {
    login: { isLoggedIn },
    scenarios,
    user
  } = state;

  return { isLoggedIn, user, scenarios };
};

const mapDispatchToProps = dispatch => ({
  deleteScenario: id => dispatch(deleteScenario(id)),
  getScenariosCount: () => dispatch(getScenariosCount()),
  getScenariosSlice: (...params) => dispatch(getScenariosSlice(...params))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ScenariosList)
);
