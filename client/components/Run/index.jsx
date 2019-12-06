import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import Scenario from '@components/Scenario';
import { getCohort } from '@client/actions/cohort';
import { getUser } from '@client/actions/user';
import { getResponse, setResponses } from '@client/actions/response';
import { getRun, setRun } from '@client/actions/run';

class Run extends Component {
    constructor(props) {
        super(props);

        const {
            cohortId,
            match: { params },
            scenarioId
        } = this.props;

        this.state = {
            cohortId: Number(cohortId || params.cohortId),
            scenarioId: Number(scenarioId || params.scenarioId)
        };

        this.onChange = this.onChange.bind(this);
        this.responses = new Map();

        this.onResponseChange = this.onResponseChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentDidMount() {
        await this.props.getRun(this.state.scenarioId);
    }

    onResponseChange(event, data) {
        const {
            created_at,
            ended_at = new Date().toISOString(),
            isSkip = false,
            name,
            type,
            value
        } = data;
        const record = {
            created_at,
            ended_at,
            isSkip,
            type,
            value
        };
        const isRecordable =
            !this.responses.has(name) || (this.responses.has(name) && !isSkip);

        if (isRecordable) {
            this.responses.set(name, record);
        }
    }

    async onChange(event, data) {
        await this.props.setRun(this.props.run.id, data);
    }

    async onSubmit() {
        if (this.props.run) {
            await this.props.setResponses(this.props.run.id, [
                ...this.responses
            ]);
            this.responses.clear();
        }
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
    cohortId: PropTypes.number,
    getUser: PropTypes.func,
    getResponse: PropTypes.func,
    setResponses: PropTypes.func,
    scenarioId: PropTypes.number,
    run: PropTypes.object,
    getRun: PropTypes.func,
    setRun: PropTypes.func,
    match: PropTypes.shape({
        params: PropTypes.shape({
            cohortId: PropTypes.node,
            scenarioId: PropTypes.node
        }).isRequired
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    })
};

function mapStateToProps(state) {
    const { responses, run } = state;
    return { responses, run };
}

const mapDispatchToProps = dispatch => ({
    getCohort: params => dispatch(getCohort(params)),
    getUser: params => dispatch(getUser(params)),
    getResponse: params => dispatch(getResponse(params)),
    setResponses: (...params) => dispatch(setResponses(...params)),
    getRun: (...args) => dispatch(getRun(...args)),
    setRun: (...args) => dispatch(setRun(...args))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Run)
);
