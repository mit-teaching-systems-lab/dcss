import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Scenario from '@components/Scenario';

class Run extends Component {
    constructor(props) {
        super(props);

        this.state = {
            runId: undefined,
            scenarioId:
                this.props.scenarioId || this.props.match.params.scenarioId
        };
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

    render() {
        return (
            (this.state.runId && (
                <Scenario
                    scenarioId={this.state.scenarioId}
                    runId={this.state.runId}
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
