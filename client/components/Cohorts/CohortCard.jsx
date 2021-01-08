import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@components/UI';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from '@utils/Moment';
import { rolesToHumanReadableString } from '@utils/Roles';

export const CohortCard = ({ id, created_at, name, roles, users }) => {
  const yourRoles = rolesToHumanReadableString('cohort', roles);
  const fromNow = Moment(created_at).fromNow();
  const calendar = Moment(created_at).calendar();
  const owner = users.find(user => user.roles.includes('owner'));
  const createdBy = !yourRoles.includes('owner')
    ? (owner && owner.username) || null
    : null;

  return (
    <Card className="sc sc__margin-height" key={id}>
      <Card.Content className="sc">
        <Card.Header>
          <NavLink to={`/cohort/${id}`}>{name}</NavLink>
        </Card.Header>
        <Card.Meta title={`Created ${calendar}`}>
          Created {createdBy ? `by ${createdBy}` : ''} {fromNow}
        </Card.Meta>
        <Card.Description>{''}</Card.Description>
      </Card.Content>
      {roles ? <Card.Content extra>{yourRoles}</Card.Content> : null}
    </Card>
  );
};

CohortCard.propTypes = {
  id: PropTypes.number,
  created_at: PropTypes.string,
  name: PropTypes.string,
  roles: PropTypes.array,
  users: PropTypes.array
};

const mapStateToProps = (state, props) => {
  const { cohorts, cohortsById, user } = state;
  const cohort =
    cohortsById[props.id] || cohorts.find(cohort => cohort.id === props.id);
  let roles = props.roles;
  if (!roles) {
    const cohortUser = cohort.users.find(({ id }) => id === user.id);

    if (cohortUser) {
      roles = cohortUser.roles;
    }
  }
  return { ...cohort, roles };
};

export default connect(mapStateToProps)(CohortCard);
