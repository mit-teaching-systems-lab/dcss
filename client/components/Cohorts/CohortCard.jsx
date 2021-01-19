import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Moment from '@utils/Moment';
import { Button, Card } from '@components/UI';
import { setCohort } from '@actions/cohort';
import { rolesToHumanReadableString } from '@utils/Roles';

export const CohortCard = props => {
  const {
    cohort: { id, created_at, deleted_at, updated_at, name, users },
    roles,
    user
  } = props;
  const yourRoles = rolesToHumanReadableString('cohort', roles);
  const updatedfromNow = Moment(updated_at || created_at).fromNow();
  const updatedCalendar = Moment(updated_at || created_at).calendar();
  const owner = users.find(user => user.roles.includes('owner'));

  let cardClassName = 'sc sc__margin-height';

  if (deleted_at) {
    cardClassName += ' deleted';
  }

  const onClick = async () => {
    await props.setCohort(id, {
      deleted_at: null
    });
    props.history.push(`/cohort/${id}`);
  };

  const restoreCohort =
    deleted_at && user.is_super ? (
      <Card.Content extra>
        <Button.Group>
          <Button onClick={onClick}>Restore</Button>
        </Button.Group>
      </Card.Content>
    ) : null;

  return (
    <Card className={cardClassName} key={id}>
      <Card.Content className="sc">
        <Card.Header>
          <NavLink to={`/cohort/${id}`}>{name}</NavLink>
        </Card.Header>
        <Card.Meta title={`Created ${updatedCalendar}`}>
          Updated {updatedfromNow}
        </Card.Meta>
        <Card.Description>{''}</Card.Description>
      </Card.Content>
      {roles ? <Card.Content extra>{yourRoles}</Card.Content> : null}
      {restoreCohort}
    </Card>
  );
};

CohortCard.propTypes = {
  id: PropTypes.number,
  cohort: PropTypes.object,
  history: PropTypes.object,
  setCohort: PropTypes.func,
  roles: PropTypes.array,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { cohorts, cohortsById, user } = state;
  const cohort =
    cohortsById[ownProps.id] || cohorts.find(({ id }) => id === ownProps.id);

  let roles = ownProps.roles;

  if (!roles) {
    const cohortUser = cohort.users.find(({ id }) => id === user.id);
    if (cohortUser) {
      roles = cohortUser.roles;
    }
  }

  return { cohort, roles, user };
};

const mapDispatchToProps = dispatch => ({
  setCohort: (id, params) => dispatch(setCohort(id, params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortCard)
);
