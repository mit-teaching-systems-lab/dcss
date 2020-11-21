import React from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Card, Icon, Label } from '@components/UI';
import { getScenario } from '@actions/scenario';
import Gate from '@client/components/Gate';
import DeletedCard from './DeletedCard';
import Events from '@utils/Events';
import Identity from '@utils/Identity';
import ScenarioCardActions from './ScenarioCardActions';
import './ScenariosList.css';

const qsOpts = {
  arrayFormat: 'bracket'
};

function makeQueryString(labels) {
  const qs = {};
  const {
    search
  } = QueryString.parse(window.location.search, qsOpts);

  if (search) {
    qs.search = search;
  }

  if (labels && labels.length) {
    qs.labels = labels;
  }

  return `?${QueryString.stringify(qs, qsOpts)}`;
}


class ScenarioCard extends React.Component {
  constructor(props) {
    super(props);

    const { scenario } = this.props;

    this.state = {
      labelsInUse: [],
      scenario,
    };

    this.onLabelClick = this.onLabelClick.bind(this);
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

  onLabelClick(event, {value}) {
    let {
      labels
    } = QueryString.parse(window.location.search, qsOpts);

    if (!labels) {
      labels = [value];
    } else {
      if (labels.includes(value)) {
        labels.splice(labels.indexOf(value), 1);
      } else {
        labels.push(value);
      }
    }

    this.setState({
      labelsInUse: labels
    });

    this.props.history.push(
      `${this.props.location.pathname}${makeQueryString(labels)}`
    );
  }

  render() {
    const { onLabelClick, onRestoreClick } = this;
    const { onClick, user } = this.props;
    const { labelsInUse, scenario } = this.state;
    const { categories = [], labels = [], id, description, deleted_at, title } = scenario;
    const officialCheckmark = categories.includes('official') ? (
      <Icon name="check" aria-label="Official" />
    ) : null;

    const isAuthorized =
      scenario.author_id === user.id || user.roles.includes('super_admin');

    const ariaLabelledby = Identity.id();
    const ariaDescribedby = Identity.id();

    const clickables = {
      onClick,
      onKeyUp(...args) { Events.onKeyUp(...args, onClick); }
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
            <p>
            {labels.map(value => {
              const key = Identity.key({value, scenario});
              const active = labelsInUse.includes(value);
              const labelProps = {
                key,
                value
              };

              if (labelsInUse.includes(value)) {
                labelProps.color = 'green';
              }

              return (
                <Label
                  {...labelProps}
                  tabIndex="0"
                  as="button"
                  size="small"
                  onClick={onLabelClick}
                  aria-label={`Click for ${value} scenarios`}
                >
                  {value}
                </Label>
              );
            })}
            </p>
            {description}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScenarioCard));
