import React from 'react';
import PropTypes from 'prop-types';
import changeCase from 'change-case';
import { Dropdown, Menu, Icon } from 'semantic-ui-react';

let cachedStatusOptions = null;

class ScenarioStatusMenuItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            statusOptions: null
        };

        this.fetchStatusOptions();
    }

    async fetchStatusOptions() {
        const statusOptions = await (cachedStatusOptions ||
            (await fetch('/api/status')).json());

        statusOptions.forEach(
            statusOption =>
                (statusOption.name = changeCase.titleCase(statusOption.name))
        );

        cachedStatusOptions = statusOptions; // eslint-disable-line require-atomic-updates

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

    render() {
        if (!this.state.statusOptions) {
            return null;
        }
        return (
            <Menu.Menu key="menu-item-scenario-status">
                <Dropdown
                    item
                    text={
                        <React.Fragment>
                            <Icon.Group style={{ marginRight: '0.5rem' }}>
                                <Icon name="pencil alternate" />
                                {this.getStatusDisplay({
                                    asIcon: true
                                })}
                            </Icon.Group>
                            {this.getStatusDisplay({
                                asIcon: false
                            })}
                        </React.Fragment>
                    }
                >
                    <Dropdown.Menu>
                        {this.state.statusOptions.map(
                            ({ id, name, description }) => (
                                <Dropdown.Item
                                    name="save-status"
                                    id={id}
                                    key={id}
                                    onClick={this.props.onClick}
                                >
                                    {name} ({description})
                                </Dropdown.Item>
                            )
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Menu>
        );
    }
}

ScenarioStatusMenuItem.propTypes = {
    // scenario: PropTypes.object,
    status: PropTypes.number,
    onClick: PropTypes.func.isRequired
};

export default ScenarioStatusMenuItem;
