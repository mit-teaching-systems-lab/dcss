import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Button,
    // NOTE: The checkbox is temporarily disabled
    // Checkbox,
    Container,
    // Dimmer,
    Icon,
    // Loader,
    Popup,
    Table
} from 'semantic-ui-react';
import _ from 'lodash';
import {
    getCohort,
    getCohortParticipants,
    setCohort
} from '@client/actions/cohort';
import ConfirmAuth from '@client/components/ConfirmAuth';
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
                id,
                users: []
            }
        };

        this.refreshInterval = null;

        // This is used as a back up copy of
        // participants when the list is filtered
        // by searching.
        this.participants = [];
        this.tableBody = React.createRef();
        this.onCheckboxClick = this.onCheckboxClick.bind(this);
        this.onSearchParticipants = this.onSearchParticipants.bind(this);
    }

    async componentDidMount() {
        const {
            cohort: { id }
        } = this.state;

        const cohort = await this.props.getCohort(Number(id));

        this.setState({ cohort });

        this.refreshInterval = setInterval(async () => {
            const { cohort } = this.state;

            cohort.users = await this.props.getCohortParticipants(Number(id));

            this.setState({ cohort });
        }, 1000);
    }

    async componentWillUnmount() {
        clearInterval(this.refreshInterval);
    }

    onCheckboxClick() {}

    async onSearchParticipants(event, { value }) {
        const { participants } = this;
        const { cohort } = this.props;
        const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');

        const filtered = participants.filter(scenario => {
            if (escapedRegExp.test(scenario.username)) {
                return true;
            }

            if (escapedRegExp.test(scenario.email)) {
                return true;
            }
            return false;
        });

        await this.props.setCohort({
            ...cohort,
            users: filtered
        });
    }

    render() {
        const { onClick } = this.props;
        const { cohort } = this.state;
        // NOTE: The checkbox is temporarily disabled
        // const { onCheckboxClick } = this;

        return (
            <Container fluid className="cohort__table-container">
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
                                Participants ({this.props.cohort.users.length}){' '}
                                {'  '}
                                {/*
                                <Input
                                    className="cohort__table--search"
                                    onChange={onSearchParticipants}
                                />
                                */}
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body className="cohort__scrolling-tbody">
                        {cohort.users.length ? (
                            cohort.users.map((user, index) => {
                                const onClickAddTab = (event, data) => {
                                    onClick(event, {
                                        ...data,
                                        type: 'participant',
                                        source: user
                                    });
                                };

                                return (
                                    <Table.Row
                                        key={`participants-row-${index}`}
                                        className="cohort__table-thead-tbody-tr"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {/*
                                        <Table.Cell
                                            key={`participants-cell-checkbox-${index}`}
                                            className="cohort__table-cell-first"
                                        >
                                            <Popup
                                                content="Adding participants is not available in this version of Cohorts"
                                                trigger={
                                                    <Checkbox
                                                        disabled
                                                        key={`participants-checkbox-${index}`}
                                                        value={user.id}
                                                        onClick={
                                                            onCheckboxClick
                                                        }
                                                    />
                                                }
                                            />
                                        </Table.Cell>
                                        */}
                                        <Table.Cell>
                                            <Button.Group
                                                hidden
                                                basic
                                                size="small"
                                                className="cohort__button-group--transparent"
                                                style={{
                                                    marginRight: '0.5rem'
                                                }}
                                            >
                                                <ConfirmAuth requiredPermission="view_all_data">
                                                    <Popup
                                                        content="View cohort reponses from this participant"
                                                        trigger={
                                                            <Button
                                                                icon
                                                                content={
                                                                    <Icon name="file alternate outline" />
                                                                }
                                                                name={
                                                                    user.username
                                                                }
                                                                onClick={
                                                                    onClickAddTab
                                                                }
                                                            />
                                                        }
                                                    />
                                                </ConfirmAuth>
                                            </Button.Group>
                                            {user.username} ({user.role})
                                        </Table.Cell>
                                        <Table.Cell>{user.email}</Table.Cell>
                                    </Table.Row>
                                );
                            })
                        ) : (
                            <Table.Row
                                key={`row-empty-results`}
                                className="cohort__table-thead-tbody-tr"
                            >
                                <Table.Cell>
                                    No participants match your search
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>
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
    participants: PropTypes.array,
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
    onClick: PropTypes.func,
    getCohort: PropTypes.func,
    getCohortParticipants: PropTypes.func,
    setCohort: PropTypes.func,
    scenarios: PropTypes.array
};

const mapStateToProps = state => {
    const { currentCohort: cohort } = state.cohort;
    const { users: participants } = cohort;
    const { scenarios } = state.scenario;
    return { cohort, participants, scenarios };
};

const mapDispatchToProps = dispatch => ({
    getCohort: id => dispatch(getCohort(id)),
    getCohortParticipants: id => dispatch(getCohortParticipants(id)),
    setCohort: params => dispatch(setCohort(params))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CohortParticipants)
);
