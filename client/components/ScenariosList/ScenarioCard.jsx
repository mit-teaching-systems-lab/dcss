import './ScenariosList.css';

import { Card, Icon, Text } from '@components/UI';
import { useDispatch, useSelector } from 'react-redux';

import DeletedCard from './DeletedCard';
import Events from '@utils/Events';
import Gate from '@client/components/Gate';
import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import PropTypes from 'prop-types';
import React from 'react';
import ScenarioCardActions from './ScenarioCardActions';
import { restoreScenario } from '@actions/scenario';

const ScenarioCard = props => {
  const { onClick, showActions = true, scenario } = props;
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const { categories = [], id, description, deleted_at, title } = scenario;
  // eslint-disable-next-line no-unused-vars
  const officialCheckmark = categories.includes('official') ? (
    <span className="scmt__float-left">
      <Icon className="primary" name="check" />
      Official
    </span>
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

  const statusItems = {
    1: { type: 'Draft', icon: 'edit' },
    2: { type: 'Public', icon: 'eye' },
    3: { type: 'Private', icon: 'eye slash' }
  };
  const status = statusItems[scenario.status];

  const clickables = {
    onClick,
    onKeyUp(...args) {
      Events.onKeyUp(...args, onClick);
    }
  };

  const isMultiParticipantScenario = scenario.personas.length > 1;

  const cardHeaderIconClassName = isMultiParticipantScenario ? 'users' : 'user';

  const cardHeaderAriaLabel = isMultiParticipantScenario
    ? `${title} is a multi-participant scenario.`
    : `${title} is a solo scenario.`;

  const onRestoreClick = () => dispatch(restoreScenario(scenario));

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
        <Card.Meta className="sc__meta-top">
          {officialCheckmark}
          <Icon className="primary" name={status.icon} />
          {status.type}
        </Card.Meta>
        <Card.Header
          tabIndex="0"
          className="sc sc__cursor-pointer"
          aria-label={cardHeaderAriaLabel}
          title={cardHeaderAriaLabel}
          id={ariaLabelledby}
          {...clickables}
        >
          <Icon className="primary" name={cardHeaderIconClassName} />
          {title}
        </Card.Header>
        <Card.Meta>{scenarioUpdatedOrCreatedTime}</Card.Meta>
        <Card.Description>
          <Text.Truncate lines={3} id={ariaDescribedby}>
            {description}
          </Text.Truncate>
        </Card.Description>
        <Card.Meta className="sc__footer">{props.children}</Card.Meta>
      </Card.Content>
      {showActions ? (
        <Card.Content extra tabIndex="0">
          <ScenarioCardActions scenario={scenario} />
        </Card.Content>
      ) : null}
    </Card>
  );
};

ScenarioCard.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  location: PropTypes.object,
  onClick: PropTypes.func,
  scenario: PropTypes.object,
  showActions: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default ScenarioCard;
