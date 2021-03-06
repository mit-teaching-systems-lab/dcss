import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Label } from '@components/UI';
import { setLabelsInUse } from '@actions/tags';
import History from '@utils/History';
import Identity from '@utils/Identity';

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
      History.composeUrl(this.props.location, { l: labelsInUse })
    );
  }

  render() {
    const { onClick } = this;
    const { labelsInUse, scenario } = this.props;
    const { deleted_at, labels } = scenario;

    return !deleted_at ? (
      <Label.Group>
        {labels.map(value => {
          const key = Identity.key({ value, scenario });
          const labelProps = {
            as: 'button',
            size: 'small',
            tabIndex: 0,
            value
          };

          if (labelsInUse.includes(value)) {
            labelProps.className = 'primary';
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
      </Label.Group>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenarioLabels)
);
