import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, Icon } from 'semantic-ui-react';
import Storage from '@utils/Storage';
import ConfirmAuth from '@client/components/ConfirmAuth';
import DeletedCard from './DeletedCard';
import ScenarioCardActions from './ScenarioCardActions';
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

      const { scenario } = await (await fetch(
        `/api/scenarios/${originalScenario.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(originalScenario)
        }
      )).json();

      if (scenario.deleted_at === null) {
        this.setState({ scenario });
      }
    }
  }

  render() {
    const { onRestoreClick } = this;
    const { isLoggedIn, onClick, user } = this.props;
    const { scenario } = this.state;
    const { categories = [], id, description, deleted_at, title } = scenario;
    const officialCheckmark = categories.includes('official') ? (
      <Icon name="check" aria-label="Official" />
    ) : null;

    const isAuthorized =
      scenario.author_id === user.id || user.roles.includes('super_admin');

    return deleted_at ? (
      <ConfirmAuth isAuthorized={isAuthorized}>
        <DeletedCard
          id={id}
          title={title}
          description={description}
          onClick={onRestoreClick}
        />
      </ConfirmAuth>
    ) : (
      <Card className="sc sc__margin-height" key={id}>
        <Card.Content className="sc sc__cursor-pointer" onClick={onClick}>
          <Card.Header>
            {officialCheckmark} {title}
          </Card.Header>
          <Card.Description>{description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <ScenarioCardActions scenario={scenario} />
        </Card.Content>
      </Card>
    );
  }
}

ScenarioCard.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  scenario: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const {
    login: { isLoggedIn },
    user
  } = state;
  return { isLoggedIn, user };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioCard);
