import React from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Label } from '@components/UI';
import { setLabelsInUse } from '@actions/tags';
import Identity from '@utils/Identity';

const qsOpts = {
  arrayFormat: 'bracket'
};

function makeQueryString(labels) {
  const qs = {};
  const { search } = QueryString.parse(window.location.search, qsOpts);

  if (search) {
    qs.search = search;
  }

  if (labels && labels.length) {
    qs.labels = labels;
  }

  return `?${QueryString.stringify(qs, qsOpts)}`;
}

class ScenarioLabels extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event, { value }) {
    const labelsInUse = this.props.labelsInUse.slice(0);

    if (labelsInUse.includes(value)) {
      labelsInUse.splice(labelsInUse.indexOf(value), 1);
    } else {
      labelsInUse.push(value);
    }

    this.props.setLabelsInUse(labelsInUse);
    this.props.history.push(
      `${this.props.location.pathname}${makeQueryString(labelsInUse)}`
    );
  }

  render() {
    const { onClick } = this;
    const { labelsInUse, scenario } = this.props;
    const { deleted_at, labels } = scenario;

    return !deleted_at ? (
      <div className="sc__labels">
        {labels.map(value => {
          const key = Identity.key({ value, scenario });
          const labelProps = {
            as: 'button',
            size: 'small',
            tabIndex: 0,
            value
          };

          if (labelsInUse.includes(value)) {
            labelProps.color = 'blue';
          }

          return (
            <Label
              {...labelProps}
              key={key}
              onClick={onClick}
              aria-label={`Click for scenarios labelled ${value}`}
            >
              {value}
            </Label>
          );
        })}
      </div>
    ) : null;
  }
}

ScenarioLabels.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  labelsInUse: PropTypes.array,
  location: PropTypes.object,
  scenario: PropTypes.object,
  setLabelsInUse: PropTypes.func
};

const mapStateToProps = state => {
  const {
    tags: { labelsInUse }
  } = state;
  return { labelsInUse };
};

const mapDispatchToProps = dispatch => ({
  setLabelsInUse: params => dispatch(setLabelsInUse(params))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ScenarioLabels)
);
