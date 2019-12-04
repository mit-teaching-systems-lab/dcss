import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Container,
    Dimmer,
    Icon,
    Image,
    Loader,
    Table
} from 'semantic-ui-react';
import Sortable from 'react-sortablejs';
import copy from 'copy-text-to-clipboard';
import { getCohort, setCohort } from '@client/actions/cohort';
import { getScenarios } from '@client/actions/scenario';
import './Cohort.css';

export class CohortScenarios extends React.Component {
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
        this.tableBody = React.createRef();
        this.onChangeOrder = this.onChangeOrder.bind(this);
        this.onCheckboxClick = this.onCheckboxClick.bind(this);
    }

    async componentDidMount() {
        const {
            cohort: { id }
        } = this.state;

        await this.props.getCohort(Number(id));
        await this.props.getScenarios();
    }

    async saveScenarios() {
        const { cohort } = this.props;
        const { scenarios } = cohort;
        const body = JSON.stringify({
            scenarios
        });

        await (await fetch(`/api/cohort/${cohort.id}/scenarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })).json();

        this.props.setCohort({
            ...cohort,
            scenarios
        });
    }

    onCheckboxClick(event, { checked, value }) {
        const { cohort } = this.props;
        if (checked) {
            cohort.scenarios.push(value);
            // Move to the top of the list!
            this.tableBody.current.node.firstElementChild.scrollIntoView();
        } else {
            cohort.scenarios.splice(cohort.scenarios.indexOf(value), 1);
        }

        // Force deduping
        const scenarios = [...new Set(cohort.scenarios)];

        this.props.setCohort({
            ...cohort,
            scenarios
        });

        this.saveScenarios();
    }

    async moveScenario(fromIndex, toIndex) {
        const { cohort } = this.props;
        const scenarios = cohort.scenarios.slice();
        const from = scenarios[fromIndex];
        const to = scenarios[toIndex];
        if (from && to) {
            scenarios[toIndex] = from;
            scenarios[fromIndex] = to;
        }

        this.props.setCohort({
            ...cohort,
            scenarios
        });

        await this.saveScenarios();
    }

    async onChangeOrder(...args) {
        await this.moveScenario(
            args[2].oldDraggableIndex,
            args[2].newDraggableIndex
        );
    }

    render() {
        const { cohort, scenarios = [] } = this.props;
        const { onChangeOrder, onCheckboxClick } = this;

        // This is the list of scenarios that are IN the
        // cohort. The order MUST be preserved.
        const cohortScenarios = cohort.scenarios.map(id =>
            scenarios.find(scenario => scenario.id === id)
        );

        // This is the list of scenarios that are available,
        // but NOT in the cohort. The order is by id, descending
        const reducedScenarios = scenarios.reduce((accum, scenario) => {
            if (!cohort.scenarios.includes(scenario.id)) {
                accum.push(scenario);
            }
            return accum;
        }, []);

        // This is the merged, order corrected list of scenarios.
        const orderCorrectedScenarios = [
            ...cohortScenarios,
            ...reducedScenarios
        ];

        return (
            <Container fluid className="cohort__table-container">
                {scenarios.length ? (
                    <Table
                        celled
                        striped
                        selectable
                        role="grid"
                        aria-labelledby="header"
                    >
                        <Table.Header className="cohort__table-thead-tbody-tr">
                            <Table.Row>
                                <Table.HeaderCell colSpan={4}>
                                    Scenarios
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Sortable
                            tag="tbody"
                            className="cohort__scrolling-tbody"
                            onChange={onChangeOrder}
                            ref={this.tableBody}
                        >
                            {orderCorrectedScenarios.map((scenario, index) => {
                                const checked = cohort.scenarios.includes(
                                    scenario.id
                                );
                                const url = `${location.origin}/cohort/${cohort.id}/run/${scenario.id}`;
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
                                                value={scenario.id}
                                                checked={checked}
                                                onClick={onCheckboxClick}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>
                                            {scenario.title}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {scenario.description}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {url}
                                            <Button
                                                icon
                                                className="cohort__button-transparent"
                                                content={
                                                    <Icon name="clipboard outline" />
                                                }
                                                onClick={() => copy(url)}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Sortable>
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

CohortScenarios.propTypes = {
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
    getScenarios: PropTypes.func,
    scenarios: PropTypes.array
};

const mapStateToProps = state => {
    const { currentCohort: cohort } = state.cohort;
    const { scenarios } = state;
    return { cohort, scenarios };
};

const mapDispatchToProps = dispatch => ({
    getCohort: id => dispatch(getCohort(id)),
    setCohort: params => dispatch(setCohort(params)),
    getScenarios: () => dispatch(getScenarios())
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CohortScenarios)
);
