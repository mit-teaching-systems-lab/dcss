import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Input,
  Modal,
  Ref,
  Text
} from '@components/UI';
import escapeRegExp from 'lodash.escaperegexp';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { rolesToHumanReadableString } from '@utils/Roles';
import scrollIntoView from '@utils/scrollIntoView';
import { getCohort, setCohortScenarios } from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';

import './Cohort.css';

export class CohortScenariosSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      results: [],
      scenarios: []
    };
    // This is used as a back up copy of
    // scenarios when the list is filtered
    // by searching.
    this.scenarios = [];
    this.selectedRef = null;
    this.onDeselectClick = this.onDeselectClick.bind(this);
    this.onSelectClick = this.onSelectClick.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.saveCohortScenarios = this.saveCohortScenarios.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  async componentDidMount() {
    if (!this.props.cohort) {
      await this.props.getCohort(this.props.id);
    }

    if (!this.props.scenarios.length) {
      await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
    }

    // See note above, re: scenarios list backup
    this.scenarios = this.props.scenarios.slice();

    // This set is the cohort's initial materialized scenarios
    const scenarios = this.props.cohort.scenarios.map(
      id => this.props.scenariosById[id]
    );

    this.setState({
      isReady: true,
      scenarios
    });
  }

  scrollIntoView() {
    scrollIntoView(this.selectedRef?.lastElementChild);
  }

  onDeselectClick(event, { scenario }) {
    const scenarios = this.state.scenarios.filter(({ id }) => {
      return id !== scenario.id;
    });

    this.setState({
      scenarios
    });
  }

  onSelectClick(event, { scenario }) {
    const { scenarios } = this.state;

    scenarios.push(scenario);

    this.setState({
      scenarios
    });
  }

  async saveCohortScenarios() {
    const { cohort } = this.props;
    const scenarios = this.state.scenarios.map(({ id }) => id);

    await this.props.setCohortScenarios({
      ...cohort,
      scenarios
    });
  }

  onCloseClick() {
    /* istanbul ignore else */
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onSearchChange(event, { value }) {
    const { scenarios } = this;

    if (value === '') {
      this.setState({
        results: []
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const results = scenarios.filter(scenario => {
      if (escapedRegExp.test(scenario.title)) {
        return true;
      }

      if (escapedRegExp.test(scenario.description)) {
        return true;
      }

      // TODO: search by scenario tags, labels, categories and authors
      // if (escapedRegExp.test(scenario.description)) {
      //   return true;
      // }

      return false;
    });

    this.setState({
      results
    });
  }

  render() {
    const {
      onCloseClick,
      onDeselectClick,
      /* onOrderChange, */
      onSelectClick,
      saveCohortScenarios,
      onSearchChange
    } = this;

    const { isReady, results, scenarios } = this.state;

    if (!isReady) {
      return null;
    }

    // This is the list of scenario IDs that are IN the
    // cohort. The order MUST be preserved.
    const cohortScenarios = scenarios.map(({ id }) => id);

    const sourceScenarios = results.length ? results : this.props.scenarios;

    // const cohortScenarios
    // This is the list of scenarios that are available,
    // but NOT in the cohort (via the internal accounting of
    // scenarios in this cohort). The order is by id, descending
    const reducedScenarios = sourceScenarios.reduce((accum, scenario) => {
      if (
        !cohortScenarios.includes(scenario.id) &&
        scenario.status === SCENARIO_IS_PUBLIC
      ) {
        accum.push(scenario);
      }
      return accum;
    }, []);

    // Use a slice here to prevent the cohortScenarios reference
    // from being the target of the pushed "reducedScenarios"
    // in the condition following this line.
    const orderCorrectedScenarios = scenarios.slice();

    orderCorrectedScenarios.push(...reducedScenarios);

    const { selected, unselected } = orderCorrectedScenarios.reduce(
      (accum, scenario) => {
        const inCohort = cohortScenarios.includes(scenario.id);
        const key = Identity.key(scenario);
        const updatedAgo = Moment(scenario.updated_at).fromNow();
        const userInScenario = scenario.users.find(
          user => this.props.user.id === user.id
        );
        const yourRoles = userInScenario
          ? rolesToHumanReadableString('scenario', userInScenario.roles)
          : null;

        const onClick = inCohort ? onDeselectClick : onSelectClick;

        const card = (
          <Card as="a" key={key} scenario={scenario} onClick={onClick}>
            <Card.Content className="c__wizard-scenario-card">
              <Card.Header>{scenario.title}</Card.Header>
              <Card.Meta>
                <p>
                  Last edited{' '}
                  <time className="sc__time" dateTime={scenario.updated_at}>
                    {updatedAgo}
                  </time>
                </p>
              </Card.Meta>
              <Card.Description>
                <Text.Truncate lines={2}>{scenario.description}</Text.Truncate>
              </Card.Description>
              {yourRoles ? (
                <Card.Meta extra className="c__wizard-scenario-card__meta">
                  {yourRoles}
                </Card.Meta>
              ) : null}
            </Card.Content>
          </Card>
        );

        if (inCohort) {
          accum.selected.push(card);
        } else {
          accum.unselected.push(card);
        }

        return accum;
      },
      { selected: [], unselected: [] }
    );

    const primary = {
      ...this.props?.buttons?.primary
    };

    const secondary = {
      ...this.props?.buttons?.secondary
    };

    const primaryButtonProps = {
      content: primary?.content || 'Save',
      primary: true,
      onClick: async () => {
        await saveCohortScenarios();
        if (primary?.onClick) {
          primary?.onClick(this.props.cohort);
        }
      }
    };

    const secondaryButtonProps = {
      content: secondary?.content || 'Close',
      onClick: () => {
        onCloseClick();
        if (secondary?.onClick) {
          secondary?.onClick();
        }
      }
    };

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          size="fullscreen"
          centered={false}
          onClose={secondaryButtonProps.onClick}
        >
          <Header
            icon="newspaper outline"
            content={this.props.header || 'Choose scenarios'}
          />
          <Modal.Content tabIndex="0" className="c__scenario-selector-content">
            {this.props.stepGroup ? this.props.stepGroup : null}

            <Header as="h2">
              Choose a single scenario or multiple scenarios for your cohort.
            </Header>
            <div>
              <Icon name="star" className="primary" />
              <Text size="medium">
                Remember to make your scenarios public so they appear in this
                list.
              </Text>
            </div>

            <Grid padded>
              <Grid.Row>
                <Grid.Column>
                  <Input
                    className="grid__menu-search"
                    label="Search scenarios"
                    icon="search"
                    size="big"
                    onChange={onSearchChange}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Card.Group className="c__scenario-cards">
                    {unselected}
                  </Card.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <div className="c__scenario-cards-selected">
              <Grid padded>
                <Grid.Row>
                  <Grid.Column>
                    <Header>
                      {selected.length} scenarios selected for &quot;
                      {this.props.cohort.name}&quot;
                    </Header>
                    <Ref
                      innerRef={node => {
                        this.selectedRef = node;
                        this.scrollIntoView();
                      }}
                    >
                      <Card.Group className="c__scenario-cards c__scenario-cards--selected">
                        {selected}
                      </Card.Group>
                    </Ref>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </div>
          </Modal.Actions>
          <Modal.Actions className="c-action-btns__scenario-selector">
            <Button.Group fluid>
              <Button {...primaryButtonProps} />
              <Button.Or />
              <Button {...secondaryButtonProps} />
            </Button.Group>
          </Modal.Actions>
          <div data-testid="cohort-scenarios-selector" />
        </Modal>
      </Modal.Accessible>
    );
  }
}

CohortScenariosSelector.propTypes = {
  buttons: PropTypes.object,
  header: PropTypes.any,
  id: PropTypes.any,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  getCohort: PropTypes.func,
  setCohortScenarios: PropTypes.func,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  scenarios: PropTypes.array,
  scenariosById: PropTypes.object,
  stepGroup: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { cohort, scenariosById, user } = state;
  const scenarios = state.scenarios.filter(
    ({ deleted_at, status }) => deleted_at === null && status !== 1
  );
  return { cohort, scenarios, scenariosById, user };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  setCohortScenarios: params => dispatch(setCohortScenarios(params)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CohortScenariosSelector);
