import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ScenarioEditor from '@components/ScenarioEditor';
import Slides from './Slides';

import './editor.css';

const SCENARIO_TAB_INDEX = 0;
const SLIDE_TAB_INDEX = 1;

class Editor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isNewScenario: this.props.match.params.id === 'new',
            activeIndex: SCENARIO_TAB_INDEX
        };
        this.onTabChange = this.onTabChange.bind(this);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
    }

    onTabChange(e, { activeIndex }) {
        this.setState({ activeIndex });
    }

    getSubmitCallback() {
        const scenarioId = this.props.match.params.id;
        let endpoint, method;

        if (this.state.isNewScenario) {
            endpoint = '/api/scenarios';
            method = 'PUT';
        } else {
            endpoint = `/api/scenarios/${scenarioId}`;
            method = 'POST';
        }

        return scenarioData => {
            return fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scenarioData)
            });
        };
    }

    getPostSubmitCallback() {
        if (this.state.isNewScenario) {
            return scenarioData => {
                this.props.history.push(`/editor/${scenarioData.id}`);
                this.setState({ activeIndex: SLIDE_TAB_INDEX });
            };
        }

        return null;
    }

    render() {
        const scenarioId = this.props.match.params.id;

        this.panes = [
            {
                menuItem: 'Moment',
                render: () => (
                    <ScenarioEditor
                        scenarioId={scenarioId}
                        submitCB={this.getSubmitCallback()}
                        postSubmitCB={this.getPostSubmitCallback()}
                    />
                )
            },
            scenarioId !== 'new' && {
                menuItem: 'Slides',
                render: () => (
                    <Slides scenarioId={scenarioId} className="active" />
                )
            }
        ];

        return (
            <Tab
                panes={this.panes}
                onTabChange={this.onTabChange}
                activeIndex={this.state.activeIndex}
            />
        );
    }
}

Editor.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired
};

export default Editor;
