import React from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import escapeRegExp from 'lodash.escaperegexp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, Text } from '@components/UI';
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
    qs.l = labels;
  }

  return `?${QueryString.stringify(qs, qsOpts)}`;
}

class ScenarioLabelsFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    };

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
    const { search } = this.state;
    const { onClick } = this;
    const labels = [];

    // Move selected labels to the top of the list
    if (this.props.tags.labelsInUse.length) {
      const labelsSlice = this.props.tags.labels.slice();
      const head = [];
      const tail = [];

      while (labelsSlice.length) {
        const label = labelsSlice.shift();
        if (this.props.tags.labelsInUse.includes(label.value)) {
          head.push(label);
        } else {
          tail.push(label);
        }
      }
      labels.push(...head, ...tail);
    } else {
      labels.push(...(this.props.tags.labels || []));
    }

    let escapedRegExp;

    if (search) {
      escapedRegExp = new RegExp(escapeRegExp(search), 'i');
    }

    return (
      <Dropdown
        button
        item
        search
        scrolling
        text="Filter by labels"
        closeOnChange={false}
        onSearchChange={(e, props) => {
          this.setState({
            search: props.searchQuery
          });
        }}
      >
        <Dropdown.Menu>
          {labels.reduce((accum, label) => {
            const key = Identity.key(label);
            const active = this.props.tags.labelsInUse.includes(label.value);
            const content = (
              <div>
                <p>{label.text} </p>
                <Text size="small" grey>
                  {label.count} {label.count > 1 ? 'scenarios' : 'scenario'}
                </Text>
              </div>
            );
            const itemProps = {
              'aria-label': `${label.count} scenarios labelled "${label.text}"`,
              ...label,
              active,
              content
            };

            if (active) {
              accum.push(
                <Dropdown.Item {...itemProps} key={key} onClick={onClick} />
              );
            } else {
              let shouldIncludeInDisplay = true;

              if (
                search &&
                !escapedRegExp.test(label.text) &&
                !escapedRegExp.test(label.value)
              ) {
                shouldIncludeInDisplay = false;
              }

              if (shouldIncludeInDisplay) {
                accum.push(
                  <Dropdown.Item {...itemProps} key={key} onClick={onClick} />
                );
              }
            }
            return accum;
          }, [])}
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
