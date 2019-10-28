import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import Dashboard from '@client/components/Facilitator/Components/Dashboard';
import Search from '@client/components/Facilitator/Components/Search';

class Facilitator extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);

        this.state = {
            activeTab: 'dashboard',
            tabs: {
                dashboard: this.getTab('dashboard'),
                runs: this.getTab('runs')
            }
        };
    }

    onClick(e, { name: activeTab }) {
        this.setState({ activeTab });
    }

    getTab(name) {
        switch (name) {
            case 'dashboard':
                return <Dashboard />;
            case 'runs':
                return <Search />;
            default:
                return null;
        }
    }

    render() {
        return (
            <div>
                <Menu attached="top" tabular>
                    <Menu.Item
                        content="Dashboard"
                        name="dashboard"
                        active={this.state.activeTab === 'dashboard'}
                        onClick={this.onClick}
                    />
                    <Menu.Item
                        content="Search"
                        name="runs"
                        active={this.state.activeTab === 'runs'}
                        onClick={this.onClick}
                    />
                </Menu>
                <div>{this.state.tabs[this.state.activeTab]}</div>
            </div>
        );
    }
}

Facilitator.propTypes = {};

export default Facilitator;
