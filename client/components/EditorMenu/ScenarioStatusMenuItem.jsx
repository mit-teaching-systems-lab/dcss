import React from 'react';
import PropTypes from 'prop-types';
import changeCase from 'change-case';
import { Dropdown, Menu, Icon } from '@components/UI';
import Identity from '@utils/Identity';

let cachedStatusOptions = [];

class ScenarioStatusMenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      statusOptions: cachedStatusOptions
    };

    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    if (this.state.statusOptions.length) {
      return;
    }

    const statusOptions = await (await fetch('/api/status')).json();

    statusOptions.forEach(
      statusOption =>
        (statusOption.name = changeCase.titleCase(statusOption.name))
    );

    cachedStatusOptions.push(...statusOptions); // eslint-disable-line require-atomic-updates

    this.setState({ statusOptions });
  }

  getStatusDisplay({ asIcon = false }) {
    const status = this.state.statusOptions.find(
      status => status.id === this.props.status
    );

    const color = {
      1: 'pink',
      2: 'green',
      3: 'orange'
    }[status.id];

    return asIcon ? (
      <Icon corner="top right" name="check" color={color} />
    ) : (
      `${status.name} (${status.description})`
    );
  }

  onChange(_, { name, value: id }) {
    this.props.onChange(
      {},
      {
        name,
        id
      }
    );
  }

  render() {
    if (!this.state.statusOptions.length) {
      return null;
    }

    const statusAsIcon = this.getStatusDisplay({ asIcon: true });
    const statusAsText = this.getStatusDisplay({ asIcon: false });
    const dropdownTrigger = (
      <React.Fragment>
        <Icon.Group className="em__icon-group-margin">
          <Icon name="pencil alternate" />
          {statusAsIcon}
        </Icon.Group>
        {statusAsText}
      </React.Fragment>
    );

    const options = this.state.statusOptions.map(
      ({ id, name, description }) => ({
        key: Identity.key({ id, name, description }),
        value: id,
        content: `${name} (${description})`
      })
    );

    return (
      <Menu.Menu>
        <Dropdown
          item
          name="save-status"
          trigger={dropdownTrigger}
          onChange={this.onChange}
          options={options}
          value={this.props.status}
        />
      </Menu.Menu>
    );
  }
}

ScenarioStatusMenuItem.propTypes = {
  status: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default ScenarioStatusMenuItem;
