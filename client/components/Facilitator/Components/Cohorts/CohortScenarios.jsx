import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Container,
    // Dimmer,
    Icon,
    // Image,
    Input,
    // Loader,
    Popup,
    Table
} from 'semantic-ui-react';
import Sortable from 'react-sortablejs';
import copy from 'copy-text-to-clipboard';
import _ from 'lodash';
import ConfirmAuth from '@client/components/ConfirmAuth';

import { getCohort, setCohort } from '@client/actions/cohort';
import { getScenarios, setScenarios } from '@client/actions/scenario';
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
        // This is used as a back up copy of
        // scenarios when the list is filtered
        // by searching.
        this.scenarios = [];
        this.tableBody = React.createRef();
        this.onChangeOrder = this.onChangeOrder.bind(this);
        this.onCheckboxClick = this.onCheckboxClick.bind(this);
        this.onSearchScenarios = this.onSearchScenarios.bind(this);
    }

    async componentDidMount() {
        const {
            cohort: { id }
        } = this.state;

        await this.props.getCohort(Number(id));
        await this.props.getScenarios();

        // See note above, re: scenarios list backup
        this.scenarios = this.props.scenarios.slice();
    }

    async componentWillUnmount() {
        // Restore from the backup of all available scenarios
        await this.props.setScenarios(this.scenarios);
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

    async onSearchScenarios(event, { value }) {
        const { scenarios } = this;

        await this.props.setScenarios([]);

        const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');

        const filtered = scenarios.filter(scenario => {
            if (escapedRegExp.test(scenario.title)) {
                return true;
            }

            if (escapedRegExp.test(scenario.description)) {
                return true;
            }
            return false;
        });

        await this.props.setScenarios(filtered);
    }

    render() {
        const { cohort, scenarios = [] } = this.props;
        const { onChangeOrder, onCheckboxClick, onSearchScenarios } = this;

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
                <Table
                    celled
                    striped
                    selectable
                    role="grid"
                    aria-labelledby="header"
                    className="cohort__table--constraints"
                >
                    <Table.Header className="cohort__table-thead-tbody-tr">
                        <Table.Row>
                            <Table.HeaderCell colSpan={4}>
                                Scenarios{'  '}
                                <Input
                                    className="cohort__table--search"
                                    onChange={onSearchScenarios}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {scenarios.length ? (
                        <Sortable
                            tag="tbody"
                            className="cohort__scrolling-tbody"
                            onChange={onChangeOrder}
                            ref={this.tableBody}
                        >
                            {orderCorrectedScenarios.map((scenario, index) => {
                                if (!scenario) {
                                    return null;
                                }
                                const checked = cohort.scenarios.includes(
                                    scenario.id
                                );
                                const pathname = `/cohort/${cohort.id}/run/${scenario.id}`;
                                const url = `${location.origin}${pathname}`;

                                const requiredPermission = checked
                                    ? 'view_scenarios_in_cohort'
                                    : 'edit_scenarios_in_cohort';

                                return (
                                    <ConfirmAuth
                                        key={`confirm-${index}`}
                                        requiredPermission={requiredPermission}
                                    >
                                        <Table.Row
                                            key={`row-${index}`}
                                            className="cohort__table-thead-tbody-tr"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <ConfirmAuth requiredPermission="edit_all_cohorts">
                                                <Table.Cell
                                                    key={`cell-checkbox-${index}`}
                                                    className="cohort__table-cell-first"
                                                >
                                                    <Checkbox
                                                        key={`checkbox-${index}`}
                                                        value={scenario.id}
                                                        checked={checked}
                                                        onClick={
                                                            onCheckboxClick
                                                        }
                                                    />
                                                </Table.Cell>
                                            </ConfirmAuth>
                                            <Table.Cell>
                                                <NavLink to={pathname}>
                                                    {scenario.title}
                                                </NavLink>
                                                <Popup
                                                    content="Copy cohort link to clipboard"
                                                    trigger={
                                                        <Button
                                                            icon
                                                            className="cohort__button--transparent"
                                                            content={
                                                                <Icon name="clipboard outline" />
                                                            }
                                                            onClick={() =>
                                                                copy(url)
                                                            }
                                                        />
                                                    }
                                                />
                                            </Table.Cell>
                                            <Table.Cell className="cohort__table-cell--description">
                                                {scenario.description}
                                            </Table.Cell>
                                        </Table.Row>
                                    </ConfirmAuth>
                                );
                            })}
                        </Sortable>
                    ) : (
                        <Table.Body className="cohort__scrolling-tbody">
                            <Table.Row
                                key={`row-empty-results`}
                                className="cohort__table-thead-tbody-tr"
                            >
                                <Table.Cell>
                                    No scenarios match your search
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    )}
                </Table>
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
    setScenarios: PropTypes.func,
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
    getScenarios: () => dispatch(getScenarios()),
    setScenarios: scenarios => dispatch(setScenarios(scenarios))
});

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(CohortScenarios)
);
