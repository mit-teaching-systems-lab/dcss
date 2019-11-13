import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scenario from '@components/Scenario';

class Run extends Component {
    constructor(props) {
        super(props);

        this.state = {
            runId: undefined,
            scenarioId:
                this.props.scenarioId || this.props.match.params.scenarioId,
            responses: new Map()
        };

        this.onResponseChange = this.onResponseChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentDidMount() {
        const runData = await (await fetch(
            `/api/runs/create/scenario/${this.state.scenarioId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).json();
        if (runData.status === 200) {
            this.setState({ runId: runData.id });
        }
    }

    onResponseChange(event, { name, value, type }) {
        this.setState(prevState => {
            let responses = prevState.responses;
            if (!responses.has(name)) {
                responses.set(name, { type, value });
            } else {
                let response = responses.get(name);
                response['value'] = value;
            }
        });
    }

    async onSubmit() {
        const { runId } = this.state;
        for (let [name, { type, value }] of this.state.responses) {
            const url = `/api/runs/${runId}/response/${name}`;
            const body = {
                type,
                value
            };

            // TODO: feedback for when response is saved
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
        }

        // clear the responses for the next slide
        this.setState(prevState => {
            let responses = prevState.responses;
            responses.clear();
        });
    }

    render() {
        return (
            (this.state.runId && (
                <Scenario
                    scenarioId={this.state.scenarioId}
                    runId={this.state.runId}
                    onResponseChange={this.onResponseChange}
                    onSubmit={this.onSubmit}
                />
            )) ||
            'Loading...'
        );
    }
}

Run.propTypes = {
    scenarioId: PropTypes.number,
    match: PropTypes.shape({
        params: PropTypes.shape({
            scenarioId: PropTypes.node
        }).isRequired
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    })
};

export default Run;
