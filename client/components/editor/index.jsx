import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ScenarioEditor from '@components/scenarioEditor';
import { SlideEditor } from '@components/slideEditor';

import './editor.css';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
    }

    getSubmitCallback() {
        const scenarioId = this.props.match.params.id;
        let endpoint, method;

        if (scenarioId === 'new') {
            endpoint = '/api/scenarios';
            method = 'PUT';
        } else {
            endpoint = `/api/scenarios/${scenarioId}`;
            method = 'POST';
        }

        return function(scenarioData) {
            return fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scenarioData)
            });
        };
    }

    render() {
        this.panes = [
            {
                menuItem: 'Moment',
                render: () => (
                    <ScenarioEditor
                        scenarioId={this.props.match.params.id}
                        submitCB={this.getSubmitCallback()}
                        history={this.props.history}
                    />
                )
            },
            { menuItem: 'Slides', render: SlideEditor }
        ];

        return <Tab panes={this.panes} />;
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
