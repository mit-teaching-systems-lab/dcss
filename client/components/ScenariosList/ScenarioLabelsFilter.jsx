import React from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown } from '@components/UI';
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

class ScenarioLabelsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event, { value }) {
    event.stopPropagation();

    const labelsInUse = this.props.tags.labelsInUse.slice(0);

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
    return (
      <Dropdown item text="Filter by labels" closeOnChange={false}>
        <Dropdown.Menu>
          {this.props.tags.labels.map(label => {
            const key = Identity.key(label);
            const active = this.props.tags.labelsInUse.includes(label.value);
            const itemProps = {
              ...label,
              active,
              'aria-label': label.text
            };
            return (
              <Dropdown.Item {...itemProps} key={key} onClick={onClick}>
                {label.text}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

ScenarioLabelsFilter.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  tags: PropTypes.shape({
    labels: PropTypes.array,
    labelsInUse: PropTypes.array
  }),
  location: PropTypes.object,
  setLabelsInUse: PropTypes.func
};

const mapStateToProps = state => {
  const { tags } = state;
  return { tags };
};

const mapDispatchToProps = dispatch => ({
  setLabelsInUse: params => dispatch(setLabelsInUse(params))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ScenarioLabelsFilter)
);
