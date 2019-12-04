import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Checkbox,
    Container,
    Dimmer,
    Image,
    Loader,
    Table
} from 'semantic-ui-react';
import { getCohort, setCohort } from '@client/actions/cohort';
import './Cohort.css';

export class CohortParticipants extends React.Component {
    constructor(props) {
        super(props);

        let {
            params: { id }
        } = this.props.match;

        if (!id && this.props.id) {
            id = this.props.id;
        }

        this.state = {
            cohort: {
                id
            }
        };

        this.onCheckboxClick = this.onCheckboxClick.bind(this);
    }

    async componentDidMount() {
        const {
            cohort: { id }
        } = this.state;

        await this.props.getCohort(Number(id));
    }

    onCheckboxClick() {}

    render() {
        const { cohort } = this.props;
        const { onCheckboxClick } = this;

        return (
            <Container fluid className="cohort__table-container">
                {cohort.users.length ? (
                    <Table
                        celled
                        striped
                        selectable
                        role="grid"
                        aria-labelledby="header"
                    >
                        <Table.Header className="cohort__table-thead-tbody-tr">
                            <Table.Row>
                                <Table.HeaderCell colSpan={3}>
                                    Participants
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body className="cohort__scrolling-tbody">
                            {cohort.users.map((user, index) => {
                                return (
                                    <Table.Row
                                        key={`row-${index}`}
                                        className="cohort__table-thead-tbody-tr"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Table.Cell
                                            key={`cell-checkbox-${index}`}
                                            className="cohort__table-cell-first"
                                        >
                                            <Checkbox
                                                key={`checkbox-${index}`}
                                                value={user.id}
                                                onClick={onCheckboxClick}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                ) : (
                    <React.Fragment>
                        <Dimmer active>
                            <Loader />
                        </Dimmer>
                        <Image src="/images/wireframe/short-paragraph.png" />
                    </React.Fragment>
                )}
            </Container>
        );
    }
}

CohortParticipants.propTypes = {
    cohort: PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
        role: PropTypes.string,
        runs: PropTypes.array,
        scenarios: PropTypes.array,
        users: PropTypes.array
    }),
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    id: PropTypes.any,
    match: PropTypes.shape({
        path: PropTypes.string,
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired,
    onChange: PropTypes.func,
    getCohort: PropTypes.func,
    setCohort: PropTypes.func,
    scenarios: PropTypes.array
};

const mapStateToProps = state => {
    const { currentCohort: cohort } = state.cohort;
    const { scenarios } = state.scenario;
    return { cohort, scenarios };
};

const mapDispatchToProps = dispatch => ({
    getCohort: id => dispatch(getCohort(id)),
    setCohort: params => dispatch(setCohort(params))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CohortParticipants)
);
