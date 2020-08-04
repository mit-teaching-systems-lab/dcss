import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Menu, Popup } from '@components/UI';
import { getCohort } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import ConfirmAuth from '@components/ConfirmAuth';
import './Cohort.css';

export class DataTableMenu extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(event, { name }) {
    const {
      source: { cohortId, scenarioId, participantId }
    } = this.props;

    const sourceKey = scenarioId
      ? `scenario-${scenarioId}`
      : `participant-${participantId}`;

    const key = `cohort-${cohortId}-${sourceKey}`;

    this.props.onClick(event, {
      name,
      key
    });
  }

  render() {
    const { onClick } = this;
    const { run } = this.props;

    const menuItemClose = (
      <Menu.Item.Tabbable name="close" onClick={onClick}>
        <Icon name="close" />
      </Menu.Item.Tabbable>
    );

    const menuItemRefresh = (
      <Menu.Item.Tabbable name="refresh" onClick={onClick}>
        <Icon name="refresh" />
      </Menu.Item.Tabbable>
    );

    const menuItemDownload = (
      <Menu.Item.Tabbable name="download" onClick={onClick}>
        <Icon name="download" />
      </Menu.Item.Tabbable>
    );

    const shouldShowRefresh = !run || (run && run.run_ended_at === null);

    return (
      <Menu borderless icon>
        <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
          <Popup
            inverted
            size="tiny"
            content="Close this data table tab"
            trigger={menuItemClose}
          />
        </ConfirmAuth>
        {shouldShowRefresh ? (
          <Popup
            inverted
            size="tiny"
            content="Refresh this data"
            trigger={menuItemRefresh}
          />
        ) : null}
        <Popup
          inverted
          size="tiny"
          content="Download a csv file containing these responses"
          trigger={menuItemDownload}
        />
      </Menu>
    );
  }
}

DataTableMenu.propTypes = {
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    role: PropTypes.string,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  getCohort: PropTypes.func,
  getScenarios: PropTypes.func,
  onClick: PropTypes.func,
  run: PropTypes.object,
  runsById: PropTypes.object,
  source: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const { permissions } = state.login;
  const { cohort, runsById, scenarios, user } = state;

  const run =
    ownProps.source && ownProps.source.runId
      ? runsById[ownProps.source.runId]
      : null;

  return { cohort, run, scenarios, user: { ...user, permissions } };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getScenarios: () => dispatch(getScenarios())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DataTableMenu)
);
