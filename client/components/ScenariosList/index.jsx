import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
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
  Popup
} from '@components/UI';
import _ from 'lodash';
import copy from 'copy-text-to-clipboard';
import changeCase from 'change-case';
import Moment from '@utils/Moment';
import { getScenarios } from '@actions/scenario';
import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import ScenarioCard from './ScenarioCard';
import ScenarioCardActions from './ScenarioCardActions';
import './ScenariosList.css';

const CARDS_PER_PAGE = 8;

/* eslint-disable */
const SCENARIO_STATUS_DRAFT = 1;
const SCENARIO_STATUS_PUBLIC = 2;
const SCENARIO_STATUS_PRIVATE = 3;
/* eslint-enable */

const filter = (scenarios, isLoggedIn) => {
  if (!scenarios.length) {
    return [];
  }

  return scenarios.reduce((accum, scenario) => {
    const { status, user_is_author: isAuthor } = scenario;

    // This scenario status is "draft", to see it:
    //  - user must be logged in
    //  - user must be the author
    if (status === SCENARIO_STATUS_DRAFT && (!isLoggedIn || !isAuthor)) {
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
};

class ScenariosList extends Component {
  constructor(props) {
    super(props);

    const { category } = this.props;
    const value = decodeURIComponent(window.location.search.replace('?q=', ''));
    this.state = {
      open: false,
      activePage: 1,
      category,
      isReady: false,
      selected: null,
      heading: '',
      scenarios: [],
      viewHeading: '',
      viewScenarios: [],
      value
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.onScenarioCardClick = this.onScenarioCardClick.bind(this);
    this.onScenarioModalClose = this.onScenarioModalClose.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.reduceScenarios = this.reduceScenarios.bind(this);
    this.moveDeletedScenarios = this.moveDeletedScenarios.bind(this);
  }

  async componentDidMount() {
    await this.getScenarios();
    await this.reduceScenarios();
    if (this.state.value) {
      this.onSearchChange(
        {},
        {
          value: this.state.value
        }
      );
    }
  }

  moveDeletedScenarios(scenarios = []) {
    return [
      ...scenarios.filter(({ deleted_at }) => !deleted_at),
      ...scenarios.filter(({ deleted_at }) => deleted_at)
    ];
  }

  async getScenarios() {
    await this.props.getScenarios();
  }

  async reduceScenarios() {
    const { category } = this.state;
    let scenarios = [];
    let heading = '';
    let authorUsername = '';

    switch (category) {
      case 'all': {
        scenarios.push(...this.props.scenarios);
        heading = 'All Scenarios';
        break;
      }
      case 'author': {
        authorUsername = this.props.match.params.username;
        heading = `Scenarios by ${authorUsername}`;
        scenarios.push(
          ...this.props.scenarios.filter(({ author: { username } }) => {
            return username === authorUsername;
          })
        );

        if (scenarios.length === 0) {
          heading = `There are no scenarios by ${authorUsername}`;
        }

        break;
      }
      case 'official':
      case 'community': {
        scenarios = this.props.scenarios.filter(({ categories }) => {
          return !category || categories.includes(category);
        });
        heading = `${changeCase.titleCase(category)} Scenarios`;
        break;
      }
    }

    scenarios = this.moveDeletedScenarios(scenarios);

    this.setState({
      isReady: true,
      activePage: 1,
      heading,
      scenarios,
      viewScenarios: scenarios.slice(0),
      viewHeading: heading
    });
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
    const { scenarios, viewHeading, viewScenarios } = this.state;
    const { value } = props;
    let replacementHeading = '';

    if (value === '') {
      this.setState({
        activePage: 1,
        scenarios: viewScenarios,
        heading: viewHeading
      });

      return;
    }

    const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
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
      results.push(...viewScenarios);
      replacementHeading = `${viewHeading}, nothing matches '${value}'`;
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
    const { activePage, isReady, heading, open, selected, value } = this.state;
    const {
      onPageChange,
      onScenarioCardClick,
      onScenarioModalClose,
      onSearchChange
    } = this;

    const { origin, pathname } = window.location;

    let url = `${origin}${pathname}`;

    if (value) {
      url += `?q=${encodeURIComponent(value)}`;
    }

    const scenarios = filter(this.state.scenarios, isLoggedIn);
    const scenariosPages = Math.ceil(scenarios.length / CARDS_PER_PAGE);
    const scenariosIndex = (activePage - 1) * CARDS_PER_PAGE;
    const scenariosSlice = scenarios.slice(
      scenariosIndex,
      scenariosIndex + CARDS_PER_PAGE
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

    const left = [
      <ConfirmAuth
        key="menu-item-scenario-create"
        requiredPermission="create_scenario"
      >
        <Menu.Item
          name="Create a scenario"
          as={NavLink}
          exact
          to="/editor/new"
          className="sc__hidden-on-mobile sl__menu-item--padding"
        >
          <Icon.Group className="em__icon-group-margin">
            <Icon name="newspaper outline" />
            <Icon corner="top right" name="add" color="green" />
          </Icon.Group>
          Create a Scenario
        </Menu.Item>
      </ConfirmAuth>
    ];

    const onCopyClick = () => {
      copy(url);
      notify({
        message: `Copied: ${url}`
      });
    };

    const scenarioLinkCopyMenuItem = (
      <Menu.Item className="sc__hidden-on-mobile" onClick={onCopyClick}>
        {heading} ({scenariosSlice.length})
        <Icon name="clipboard outline" />
      </Menu.Item>
    );

    const scenarioSearchMenuItem = (
      <Menu.Item className="sl__menu-item--padding">
        <Input
          icon="search"
          placeholder="Search..."
          defaultValue={value || ''}
          onChange={onSearchChange}
        />
      </Menu.Item>
    );
    const right = [
      <Menu.Menu key="menu-item-scenario-search" position="right">
        <Popup content="Copy link to this search" trigger={scenarioLinkCopyMenuItem} />
        <Popup content="Search scenarios" trigger={scenarioSearchMenuItem} />
      </Menu.Menu>
    ];

    return (
      <Fragment>
        <EditorMenu type="scenarios" items={{ left, right }} />
        {!isReady ? (
          <Loading card={{ cols: 4, rows: 2 }} />
        ) : (
          <Container fluid>
            <Grid>
              <Grid.Row>
                <Grid.Column stretched>
                  <Card.Group doubling itemsPerRow={4} stackable>
                    {cards}
                  </Card.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column stretched>
                  {scenariosPages > 1 ? (
                    <Pagination
                      name="scenarios"
                      siblingRange={1}
                      boundaryRange={0}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      activePage={activePage}
                      onPageChange={onPageChange}
                      totalPages={scenariosPages}
                    />
                  ) : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        )}
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
  const createdAt = Moment(scenario).fromNow();
  const createdAtAlt = Moment(scenario.created_at).calendar();
  const subheader = `Created by ${scenario.author.username}, ${createdAt} on ${createdAtAlt}`;
  return (
    <Modal closeIcon centered={false} open={open} onClose={onClose}>
      <Header>{scenario.title}</Header>
      <Modal.Content>
        <Header>
          <Header.Subheader aria-label="">{subheader}</Header.Subheader>
        </Header>
        <Modal.Description className="sc__modal-description">
          {scenario.description}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <ScenarioCardActions scenario={scenario} />
      </Modal.Actions>
    </Modal>
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
  getScenarios: PropTypes.func,
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

const mapDispatchToProps = {
  getScenarios
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenariosList)
);
