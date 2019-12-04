import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Menu, Segment } from 'semantic-ui-react';

import Cohorts from '@client/components/Facilitator/Components/Cohorts';
import Search from '@client/components/Facilitator/Components/Search';

import './Facilitator.css';

class Facilitator extends Component {
    constructor(props) {
        super(props);

        const { activeTab } = this.props;

        this.state = {
            activeTab,
            tabs: {
                cohorts: this.getTab('cohorts'),
                runs: this.getTab('runs')
            }
        };
        this.onClick = this.onClick.bind(this);
        this.getTab = this.getTab.bind(this);
    }

    onClick(e, { name: activeTab }) {
        this.setState({ activeTab });
    }

    getTab(name) {
        switch (name) {
            case 'cohorts':
                return <Cohorts />;
            case 'runs':
                return <Search />;
            default:
                return null;
        }
    }

    render() {
        const { activeTab } = this.state;
        const { onClick } = this;

        return (
            <div>
                <Menu attached="top" tabular>
                    <Menu.Item
                        content="Cohorts"
                        name="cohorts"
                        active={activeTab === 'cohorts'}
                        onClick={onClick}
                    />
                    <Menu.Item
                        content="Search"
                        name="runs"
                        active={activeTab === 'runs'}
                        onClick={onClick}
                    />
                </Menu>

                <Segment
                    attached="bottom"
                    className="facilitator__content-pane"
                >
                    {this.state.tabs[this.state.activeTab]}
                </Segment>
            </div>
        );
    }
}

Facilitator.propTypes = {
    activeTab: PropTypes.string,
    match: PropTypes.shape({
        path: PropTypes.string,
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired
};

export default withRouter(Facilitator);
