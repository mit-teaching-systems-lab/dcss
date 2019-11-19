import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectCohort } from '@client/reducers/cohort';

export const CohortLink = ({ id, name, role }) => (
    <NavLink to={`/cohort/${id}`}>
        {name} ({role})
    </NavLink>
);

CohortLink.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.string
};

const mapStateToProps = (state, { id }) => ({
    name: selectCohort(state, id).name,
    role: selectCohort(state, id).role
});

export default connect(mapStateToProps)(CohortLink);
