import React from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Label } from '@components/UI';
import { setFilterScenariosInUse } from '@actions/filters';
import Identity from '@utils/Identity';

const qsOpts = {
  arrayFormat: 'bracket'
};

function makeQueryString(scenarios) {
  const qs = {};
  const { search } = QueryString.parse(window.location.search, qsOpts);

  if (search) {
    qs.search = search;
  }

  if (scenarios && scenarios.length) {
    qs.s = scenarios;
  }

  return `?${QueryString.stringify(qs, qsOpts)}`;
}

class CohortScenarioLabels extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event, { scenario }) {
    const scenariosInUse = this.props.filters.scenariosInUse.slice(0);

    if (scenariosInUse.includes(scenario.id)) {
      scenariosInUse.splice(scenariosInUse.indexOf(scenario.id), 1);
    } else {
      scenariosInUse.push(scenario.id);
    }

    this.props.setFilterScenariosInUse(scenariosInUse);
    this.props.history.push(
      `${this.props.location.pathname}${makeQueryString(scenariosInUse)}`
    );
  }

  render() {
    const { onClick } = this;
    const { cohort, scenariosById, filters } = this.props;
    const { scenarios } = cohort;
    const labels = scenarios.reduce((accum, id) => {
      const scenario = scenariosById[id];

      if (!scenario) {
        return accum;
      }

      const key = Identity.key({ scenario, cohort });
      const value = scenario.id;
      const labelProps = {
        as: 'button',
        size: 'small',
        tabIndex: 0,
        value,
        scenario
      };

      if (filters.scenariosInUse.includes(value)) {
        labelProps.className = 'primary';
      }

      accum.push(
        <Label
          {...labelProps}
          key={key}
          onClick={onClick}
          aria-label={`Click for cohorts that include ${scenario.title}`}
        >
          {scenario.title}
        </Label>
      );

      return accum;
    }, []);

    return (
      <Label.Group>
        {labels.length ? (
          labels
        ) : (
          <Label size="small">This cohort contains no scenarios.</Label>
        )}
      </Label.Group>
    );
  }
}

CohortScenarioLabels.propTypes = {
  cohort: PropTypes.object,
  filters: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  scenariosById: PropTypes.object,
  setFilterScenariosInUse: PropTypes.func
};

const mapStateToProps = state => {
  const { filters, scenariosById } = state;
  return { filters, scenariosById };
};

const mapDispatchToProps = dispatch => ({
  setFilterScenariosInUse: params => dispatch(setFilterScenariosInUse(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortScenarioLabels)
);
