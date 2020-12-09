import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Icon } from '@components/UI';
import { getScenario } from '@actions/scenario';
import Gate from '@client/components/Gate';
import DeletedCard from './DeletedCard';
import Events from '@utils/Events';
import Identity from '@utils/Identity';
import TextTruncate from 'react-text-truncate';
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
      await (
        await fetch(`/api/scenarios/${originalScenario.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(originalScenario)
        })
      ).json();

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
      <Icon name="check" aria-label="Official" />
    ) : null;

    const isAuthorized =
      scenario.author_id === user.id || user.roles.includes('super_admin');

    const ariaLabelledby = Identity.id();
    const ariaDescribedby = Identity.id();

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
          <Card.Header
            tabIndex="0"
            className="sc sc__cursor-pointer"
            id={ariaLabelledby}
            {...clickables}
          >
            {officialCheckmark} {title}
          </Card.Header>
          <Card.Description id={ariaDescribedby}>
            <ScenarioLabels scenario={scenario} />
            <TextTruncate
              line={4}
              element="p"
              truncateText="…"
              text={description}
            />
          </Card.Description>
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
  connect(mapStateToProps, mapDispatchToProps)(ScenarioCard)
);
