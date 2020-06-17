import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from '@utils/Moment';

export const CohortCard = ({ id, created_at, name, role }) => {
  const article = role === 'owner' ? 'the' : 'a';
  const yourRole = `You are ${article} ${role}`;
  const fromNow = Moment(created_at).fromNow();
  const calendar = Moment(created_at).calendar();

  return (
    <Card key={id}>
      <Card.Content>
        <Card.Header>
          <NavLink to={`/cohort/${id}`}>{name}</NavLink>
        </Card.Header>
        <Card.Meta title={`Created on ${calendar}`}>
          Created {fromNow}
        </Card.Meta>
      </Card.Content>
      <Card.Content extra>{yourRole}</Card.Content>
    </Card>
  );
};

CohortCard.propTypes = {
  id: PropTypes.number,
  created_at: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string
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
