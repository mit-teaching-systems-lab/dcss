import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

export const CohortCard = ({ id, name, role }) => (
    <Card key={id}>
        <Card.Content>
            <Card.Header>
                <NavLink to={`/cohort/${id}`}>{name}</NavLink>
            </Card.Header>
            <Card.Meta>({role})</Card.Meta>
        </Card.Content>
    </Card>
);

CohortCard.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.string
};

const mapStateToProps = (state, props) => {
    const {
        cohort: { userCohorts: cohorts }
    } = state;
    const { id, name, role } = cohorts.find(cohort => cohort.id === props.id);
    return { id, name, role };
};

export default connect(mapStateToProps)(CohortCard);
