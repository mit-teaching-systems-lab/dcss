import React from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, Text } from '@components/UI';
import { setLabelsInUse } from '@actions/tags';
import Identity from '@utils/Identity';
import QueryString from '@utils/QueryString';

function makeHistoryEntry(location, keyVals) {
  return `${location.pathname}?${QueryString.mergedStringify(keyVals)}`;
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
    const labelsInUseBefore = labelsInUse.slice(0);

    if (labelsInUse.includes(value)) {
      labelsInUse.splice(labelsInUse.indexOf(value), 1);
    } else {
      labelsInUse.push(value);
    }

    if (this.props.onChange) {
      this.props.onChange(labelsInUseBefore, labelsInUse);
    }

    this.props.setLabelsInUse(labelsInUse);
    this.props.history.push(
      makeHistoryEntry(this.props.location, { l: labelsInUse })
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
        <Dropdown.Menu className="labels">
          {labels.reduce((accum, label) => {
            const key = Identity.key(label);
            const active = this.props.tags.labelsInUse.includes(label.value);
            const content = (
              <div className="labels__item">
                <p>{label.text} </p>
                <Text size="small" grey>
                  {label.count} {label.count > 1 ? 'scenarios' : 'scenario'}
                </Text>
              </div>
            );
            const { text, value } = label;

            const itemProps = {
              'aria-label': `${label.count} scenarios labelled "${label.text}"`,
              active,
              content,
              key,
              onClick,
              text,
              value
            };

            if (active) {
              accum.push(<Dropdown.Item {...itemProps} />);
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
                accum.push(<Dropdown.Item {...itemProps} />);
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
  setLabelsInUse: PropTypes.func,
  onChange: PropTypes.func
};

const mapStateToProps = state => {
  const { tags } = state;
  return { tags };
};

const mapDispatchToProps = dispatch => ({
  setLabelsInUse: params => dispatch(setLabelsInUse(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ScenarioLabelsFilter)
);
