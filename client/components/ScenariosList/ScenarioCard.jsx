import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Icon, Text } from '@components/UI';
import { getScenario } from '@actions/scenario';
import Gate from '@client/components/Gate';
import DeletedCard from './DeletedCard';
import Events from '@utils/Events';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import ScenarioCardActions from './ScenarioCardActions';
import ScenarioLabels from './ScenarioLabels';
import './ScenariosList.css';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    const { scenario } = this.props;

    this.state = {
      scenario
    };

    this.onRestoreClick = this.onRestoreClick.bind(this);
  }

  async onRestoreClick(event, { name }) {
    if (name === 'restore') {
      const originalScenario = this.state.scenario;
      originalScenario.deleted_at = null;

      // TODO: move to async action
      await (await fetch(`/api/scenarios/${originalScenario.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(originalScenario)
      })).json();

      // Revive scenario by requesting restored record from server
      await this.props.getScenario(originalScenario.id);
    }
  }

  render() {
    const { onRestoreClick } = this;
    const { onClick, user } = this.props;
    const { scenario } = this.state;
    const { categories = [], id, description, deleted_at, title } = scenario;
    const officialCheckmark = categories.includes('official') ? (
      <Icon name="check" aria-label="Official" color="blue" />
    ) : null;

    const isAuthorized =
      scenario.author_id === user.id || user.roles.includes('super_admin');

    const ariaLabelledby = Identity.id();
    const ariaDescribedby = Identity.id();

    const updatedAgo = Moment(scenario.updated_at).fromNow();
    const createdAgo = Moment(scenario.created_at).fromNow();

    const scenarioUpdatedOrCreatedTime = scenario.updated_at ? (
      <p>
        Last edited{' '}
        <time className="sc__time" dateTime={scenario.updated_at}>
          {updatedAgo}
        </time>
      </p>
    ) : (
      <p>
        Created{' '}
        <time className="sc__time" dateTime={scenario.created_at}>
          {createdAgo}
        </time>
      </p>
    );

    const status = scenario.status;
    const statusItems = {
      1: { type: 'Draft', icon: 'edit' },
      2: { type: 'Public', icon: 'eye' },
      3: { type: 'Private', icon: 'eye slash' }
    };
    const showStatus = statusItems[status];

    const clickables = {
      onClick,
      onKeyUp(...args) {
        Events.onKeyUp(...args, onClick);
      }
    };

    return deleted_at ? (
      <Gate isAuthorized={isAuthorized}>
        <DeletedCard
          tabIndex="0"
          id={id}
          title={title}
          description={description}
          onClick={onRestoreClick}
          onKeyUp={(...args) => Events.onKeyUp(...args, onRestoreClick)}
        />
      </Gate>
    ) : (
      <Card
        className="sc sc__margin-height"
        key={id}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        <Card.Content>
          <Card.Meta className="sc__status">
            <Icon color="blue" name={showStatus.icon} /> {showStatus.type}
          </Card.Meta>
          <Card.Header
            tabIndex="0"
            className="sc sc__cursor-pointer"
            id={ariaLabelledby}
            {...clickables}
          >
            {officialCheckmark} {title}
          </Card.Header>
          <Card.Description>
            <Text.Truncate lines={3} id={ariaDescribedby}>
              {description}
            </Text.Truncate>
          </Card.Description>
          <Card.Meta className="sc__footer">
            {scenarioUpdatedOrCreatedTime}
            <ScenarioLabels scenario={scenario} />
          </Card.Meta>
        </Card.Content>
        <Card.Content extra tabIndex="0">
          <ScenarioCardActions scenario={scenario} />
        </Card.Content>
      </Card>
    );
  }
}

ScenarioCard.propTypes = {
  getScenario: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  onClick: PropTypes.func,
  scenario: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = dispatch => ({
  getScenario: id => dispatch(getScenario(id))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenarioCard)
);
