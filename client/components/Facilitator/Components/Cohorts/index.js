import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { selectIndexRequest, selectCohortIds } from '@client/reducers/cohort';
import { cohortRequestList, cohortCreate } from '@client/actions/cohort';
import CohortLink from './CohortLink';

export class CohortIndex extends React.Component {
    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
    }

    async onCreate() {
        // TODO: Catch error?
        //eslint-disable-next-line
        const { id } = await this.props.cohortCreate({
            name: `New Cohort ${new Date()}`
        });
        // TODO: redirect to /cohorts/:id ?
    }

    componentDidMount() {
        if (this.props.requestIndex) {
            this.props.requestIndex();
        }
    }

    render() {
        const { ids } = this.props;
        return (
            <div>
                <h2>My Cohorts:</h2>
                <List>
                    {ids.map(id => (
                        <List.Item key={id}>
                            <CohortLink id={id} />
                        </List.Item>
                    ))}
                </List>
                <button onClick={this.onCreate}>Create</button>
            </div>
        );
    }
}

CohortIndex.propTypes = {
    status: PropTypes.oneOf(['success', 'error', 'requesting', 'init']),
    ids: PropTypes.arrayOf(PropTypes.number),
    error: PropTypes.shape({
        message: PropTypes.string,
        stack: PropTypes.string,
        status: PropTypes.oneOf([PropTypes.string, PropTypes.number])
    }),
    requestIndex: PropTypes.func,
    cohortCreate: PropTypes.func
};

const mapStateToProps = state => ({
    status: selectIndexRequest(state).status,
    ids: selectCohortIds(state),
    error: selectIndexRequest(state).error
});

const mapDispatchToProps = dispatch => ({
    requestIndex: () => dispatch(cohortRequestList()),
    cohortCreate: params => dispatch(cohortCreate(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CohortIndex);
