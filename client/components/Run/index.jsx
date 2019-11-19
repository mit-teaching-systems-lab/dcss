import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import Scenario from '@components/Scenario';
import { setRun } from '@client/actions';

class Run extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scenarioId:
                this.props.scenarioId || this.props.match.params.scenarioId,
            responses: new Map()
        };

        this.onChange = this.onChange.bind(this);
        this.onResponseChange = this.onResponseChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.fetchRun();
    }

    async fetchRun() {
        const { run, status } = await (await fetch(
            `/api/runs/new-or-existing/scenario/${this.state.scenarioId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )).json();

        if (status === 200) {
            this.props.setRun({ run });
        }
    }

    async updateRun(updates) {
        const body = JSON.stringify(updates);
        const { run, status } = await (await fetch(
            `/api/runs/${this.props.run.id}/update`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body
            }
        )).json();

        if (status === 200) {
            this.props.setRun({ run });
        }
    }

    onResponseChange(event, { name, value, type }) {
        this.setState(prevState => {
            let responses = prevState.responses;
            if (!responses.has(name)) {
                responses.set(name, { type, value });
            } else {
                let response = responses.get(name);
                response.value = value;
            }
        });
    }

    async onChange(event, data) {
        await this.updateRun(data);
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
        const { onChange, onResponseChange, onSubmit } = this;

        return this.props.run ? (
            <Scenario
                scenarioId={this.state.scenarioId}
                onResponseChange={onResponseChange}
                onRunChange={onChange}
                onSubmit={onSubmit}
            />
        ) : (
            <Loader>Loading</Loader>
        );
    }
}

Run.propTypes = {
    scenarioId: PropTypes.number,
    run: PropTypes.object,
    setRun: PropTypes.func,
    match: PropTypes.shape({
        params: PropTypes.shape({
            scenarioId: PropTypes.node
        }).isRequired
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    })
};

function mapStateToProps(state) {
    const { run } = state.run;
    return { run };
}

const mapDispatchToProps = {
    setRun
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Run)
);
