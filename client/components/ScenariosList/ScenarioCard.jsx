import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Card, Icon } from 'semantic-ui-react';
import Session from '@utils/Session';
import { getScenarios } from '@client/actions/scenario';
import ConfirmAuth from '@client/components/ConfirmAuth';
import DeletedCard from './DeletedCard';
import './ScenariosList.css';

class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    const { scenario } = this.props;

    this.state = {
      scenario
    };

    this.onClick = this.onClick.bind(this);
  }

  async onClick(event, { name }) {
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
    const { onClick } = this;
    const { isLoggedIn, user } = this.props;
    const { scenario } = this.state;
    const { categories = [], id, description, deleted_at, title } = scenario;
    const officialCheckmark = categories.includes('official') ? (
      <Icon name="check" />
    ) : null;

    const isAuthorized =
      scenario.author_id === user.id || user.roles.includes('super_admin');

    const { activeSlideIndex, activeTab } = Session.get(`editor/${id}`, {
      activeTab: 'slides',
      activeSlideIndex: 0
    });
    const nonZeroIndex = activeSlideIndex + 1;

    return deleted_at ? (
      <ConfirmAuth isAuthorized={isAuthorized}>
        <DeletedCard
          id={id}
          title={title}
          description={description}
          onClick={onClick}
        />
      </ConfirmAuth>
    ) : (
      <Card className="scenario__entry" key={id}>
        <Card.Content>
          <Card.Header>
            {title} {officialCheckmark}
          </Card.Header>
          <Card.Description className="scenario__entry--description">
            {description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Button
            basic
            fluid
            as={Link}
            to={{ pathname: `/run/${id}` }}
            className="scenario__entry--button"
          >
            Run
          </Button>
        </Card.Content>
        {isLoggedIn && (
          <Card.Content extra>
            <Button.Group className="scenario__entry--edit-buttons">
              <ConfirmAuth isAuthorized={isAuthorized}>
                <Button
                  basic
                  className="scenario__entry--button"
                  as={Link}
                  to={{
                    pathname: `/editor/${id}/${activeTab}/${nonZeroIndex}`
                  }}
                >
                  Edit
                </Button>
              </ConfirmAuth>
              <ConfirmAuth requiredPermission="create_scenario">
                <Button
                  basic
                  className="scenario__entry--button"
                  as={Link}
                  to={{ pathname: `/editor/copy/${id}` }}
                >
                  Copy
                </Button>
              </ConfirmAuth>
            </Button.Group>
          </Card.Content>
        )}
      </Card>
    );
  }
}

ScenarioCard.propTypes = {
  getScenarios: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
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

const mapDispatchToProps = {
  getScenarios
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioCard);
