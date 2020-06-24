import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from '@utils/Moment';

const rolesToHumanReadableString = roles => {
  const rolesSlice = roles.slice();
  const ownerIndex = rolesSlice.indexOf('owner');
  const isOwner = ownerIndex !== -1;
  let returnValue = '';

  if (isOwner) {
    returnValue = 'the owner';
  } else {
    // The user is not the owner...
    //
    if (rolesSlice.length === 1) {
      // The user is just a "participant"
      returnValue = `a ${rolesSlice[0]}`;
    } else {
      // This user is more than just a "participant", so
      // "participant" is implied, but not necessary to display.
      rolesSlice.splice(rolesSlice.indexOf('participant'), 1);
      returnValue = `a ${rolesSlice[0]} and ${rolesSlice[1]}`;
    }
  }

  return `You are ${returnValue}.`;
};

export const CohortCard = ({ id, created_at, name, roles }) => {
  const yourRoles = rolesToHumanReadableString(roles);
  const fromNow = Moment(created_at).fromNow();
  const calendar = Moment(created_at).calendar();

  return (
    <Card className="sc sc__margin-height" key={id}>
      <Card.Content className="sc sc__cursor-pointer">
        <Card.Header>
          <NavLink to={`/cohort/${id}`}>{name}</NavLink>
        </Card.Header>
        <Card.Meta title={`Created on ${calendar}`}>
          Created {fromNow}
        </Card.Meta>
        <Card.Description>{''}</Card.Description>
      </Card.Content>
      <Card.Content extra>{yourRoles}</Card.Content>
    </Card>
  );
};

CohortCard.propTypes = {
  id: PropTypes.number,
  created_at: PropTypes.string,
  name: PropTypes.string,
  roles: PropTypes.array
};

const mapStateToProps = (state, props) => {
  const { cohorts } = state;
  const cohort = cohorts.find(cohort => cohort.id === props.id);
  const scenarios = cohort.scenarios.map(id =>
    state.scenarios.find(scenario => scenario.id === id)
  );

  return { ...cohort, scenarios };
};

export default connect(mapStateToProps)(CohortCard);
