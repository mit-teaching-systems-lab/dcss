import React from 'react';
import PropTypes from 'prop-types';
import * as QueryString from 'query-string';
import escapeRegExp from 'lodash.escaperegexp';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown } from '@components/UI';
import { setFilterScenariosInUse } from '@actions/filters';
import Identity from '@utils/Identity';

const qsOpts = {
  arrayFormat: 'bracket'
};

function makeQueryString(keyVals) {
  const { page, search } = QueryString.parse(window.location.search, qsOpts);
  const qs = {
    ...keyVals
  };

  if (page) {
    qs.page = page;
  }

  if (search) {
    qs.search = search;
  }

  return `?${QueryString.stringify(qs, qsOpts)}`;
}

function makeHistoryUrl(location, keyVals) {
  const searchString = makeQueryString(keyVals);
  return `${location.pathname}${searchString}`;
}

class CohortScenarioLabelsFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ''
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(event, { scenario }) {
    event.stopPropagation();

    const scenariosInUse = this.props.filters.scenariosInUse.slice(0);
    const scenariosInUseBefore = scenariosInUse.slice(0);

    if (scenariosInUse.includes(scenario.id)) {
      scenariosInUse.splice(scenariosInUse.indexOf(scenario.id), 1);
    } else {
      scenariosInUse.push(scenario.id);
    }

    if (this.props.onChange) {
      this.props.onChange(scenariosInUseBefore, scenariosInUse);
    }

    this.props.setFilterScenariosInUse(scenariosInUse);
    this.props.history.push(
      makeHistoryUrl(this.props.location, { s: scenariosInUse })
    );
  }

  render() {
    const { search } = this.state;
    const { onClick } = this;

    // Move selected scenarios to the top of the list

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
        direction="left"
        text="Filter by scenarios"
        closeOnChange={false}
        onSearchChange={(e, props) => {
          this.setState({
            search: props.searchQuery
          });
        }}
      >
        <Dropdown.Menu className="scenarios">
          {this.props.scenarios.reduce((accum, scenario) => {
            const key = Identity.key(scenario);
            const active = this.props.filters.scenariosInUse.includes(
              scenario.id
            );
            const content = (
              <div className="scenarios__item">
                <p>{scenario.title}</p>
              </div>
            );
            const itemProps = {
              scenario,
              active,
              content
            };

            if (active) {
              accum.push(
                <Dropdown.Item {...itemProps} key={key} onClick={onClick} />
              );
            } else {
              let shouldIncludeInDisplay = true;

              if (search && escapedRegExp.test(scenario.title)) {
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

CohortScenarioLabelsFilter.propTypes = {
  filters: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  scenarios: PropTypes.array,
  setFilterScenariosInUse: PropTypes.func,
  onChange: PropTypes.func
};

const mapStateToProps = state => {
  const { filters, scenariosById } = state;
  let scenarios = [];

  if (state.scenarios.length) {
    scenarios.push(
      ...state.scenarios.filter(
        ({ deleted_at, status }) => deleted_at === null && status !== 1
      )
    );
  }

  scenarios.sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });

  return { filters, scenarios, scenariosById };
};

const mapDispatchToProps = dispatch => ({
  setFilterScenariosInUse: params => dispatch(setFilterScenariosInUse(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CohortScenarioLabelsFilter)
);
