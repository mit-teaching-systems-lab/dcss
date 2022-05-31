import { Button, Card } from '@components/UI';

import Identity from '@utils/Identity';
import Moment from '@utils/Moment';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { rolesToHumanReadableString } from '@utils/Roles';
import { setCohort } from '@actions/cohort';
import { withRouter } from 'react-router-dom';

export const CohortCard = props => {
  const { cohort, roles, user, raised } = props;
  const { id, created_at, deleted_at, updated_at, name, is_archived } = cohort;
  const yourRoles = rolesToHumanReadableString('cohort', roles);
  const updatedfromNow = Moment(updated_at || created_at).fromNow();
  const updatedCalendar = Moment(updated_at || created_at).calendar();

  let cardClassName = 'sc sc__margin-height';

  if (deleted_at) {
    cardClassName += ' deleted';
  }

  const pathToCohort = `/cohort/${Identity.toHash(id)}`;

  const onClick = async () => {
    await props.setCohort(id, {
      deleted_at: null
    });
    props.history.push(pathToCohort);
  };

  const cohortStatus = is_archived ? 'Archived' : 'Active';

  const restoreCohort =
    deleted_at && user.is_super ? (
      <Card.Content extra>
        <Button.Group>
          <Button onClick={onClick}>Restore</Button>
        </Button.Group>
      </Card.Content>
    ) : null;

  return (
    <Card className={cardClassName} key={id} raised={raised}>
      <Card.Content className="sc">
        <Card.Meta className="c-card__status">{cohortStatus}</Card.Meta>
        <Card.Header>
          <NavLink to={pathToCohort}>{name}</NavLink>
        </Card.Header>
        <Card.Meta title={`Created ${updatedCalendar}`}>
          Updated {updatedfromNow}
        </Card.Meta>
        <Card.Description>{props.children}</Card.Description>
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
  roles: PropTypes.array,
  setCohort: PropTypes.func,
  user: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  raised: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const { cohorts, cohortsById, filters, recentCohorts, user } = state;
  const cohort =
    cohortsById[ownProps.id] ||
    recentCohorts.find(({ id }) => id === ownProps.id) ||
    cohorts.find(({ id }) => id === ownProps.id);

  let roles = ownProps.roles;

  if (!roles) {
    const cohortUser = cohort.users.find(({ id }) => id === user.id);
    if (cohortUser) {
      roles = cohortUser.roles;
    }
  }

  return { cohort, filters, roles, user };
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
