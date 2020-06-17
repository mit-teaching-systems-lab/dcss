import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Icon, Menu, Popup } from 'semantic-ui-react';
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

    const menuItemClose = (
      <Menu.Item name="close" onClick={onClick}>
        <Icon name="close" />
      </Menu.Item>
    );

    const menuItemRefresh = (
      <Menu.Item name="refresh" onClick={onClick}>
        <Icon name="refresh" />
      </Menu.Item>
    );

    const menuItemDownload = (
      <Menu.Item name="download" onClick={onClick}>
        <Icon name="download" />
      </Menu.Item>
    );

    return (
      <Menu borderless icon>
        <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
          <Popup content="Close this data table tab" trigger={menuItemClose} />
        </ConfirmAuth>
        <Popup content="Refresh this data" trigger={menuItemRefresh} />
        <Popup
          content="Download the data from this data table tab"
          trigger={menuItemDownload}
        />
      </Menu>
    );
  }
}

DataTableMenu.propTypes = {
  source: PropTypes.object,
  runs: PropTypes.array,
  users: PropTypes.array,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    role: PropTypes.string,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
  }),
  onClick: PropTypes.func,
  getCohort: PropTypes.func,
  getScenarios: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { permissions } = state.login;
  const { cohort, scenarios, user } = state;
  return { cohort, scenarios, user: { ...user, permissions } };
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
