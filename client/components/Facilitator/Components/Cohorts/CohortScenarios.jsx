import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import {
    Button,
    Checkbox,
    Container,
    Icon,
    Input,
    Menu,
    Popup,
    Table
} from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import _ from 'lodash';

import EditorMenu from '@components/EditorMenu';
import Sortable from '@components/Sortable';
import ClickableTableCell from '@components/ClickableTableCell';
import ConfirmAuth from '@components/ConfirmAuth';

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
        this.onScenarioChangeOrder = this.onScenarioChangeOrder.bind(this);
        this.onScenarioCheckboxClick = this.onScenarioCheckboxClick.bind(this);
        this.onScenarioSearchChange = this.onScenarioSearchChange.bind(this);
        this.scrollIntoView = this.scrollIntoView.bind(this);
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

    scrollIntoView() {
        this.tableBody.current.node.firstElementChild.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }

    onScenarioCheckboxClick(event, { checked, value }) {
        const { cohort } = this.props;
        if (checked) {
            cohort.scenarios.push(value);
            // Move to the top of the list!
            this.scrollIntoView();
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

    onScenarioChangeOrder(fromIndex, toIndex) {
        this.moveScenario(fromIndex, toIndex);
    }

    onScenarioSearchChange(event, { value }) {
        const { scenarios } = this;

        this.props.setScenarios([]);

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

        this.props.setScenarios(filtered);
    }

    render() {
        const { cohort, onClick, scenarios = [] } = this.props;
        const {
            onScenarioChangeOrder,
            onScenarioCheckboxClick,
            onScenarioSearchChange
        } = this;
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
                <EditorMenu
                    type="cohort scenarios"
                    items={{
                        left: [
                            <Menu.Item
                                key="menu-item-cohort-scenarios"
                                className="editormenu__padding"
                                name="Scenarios in this Cohort"
                                onClick={this.scrollIntoView}
                            >
                                <Icon.Group className="editormenu__icon-group">
                                    <Icon name="newspaper outline" />
                                </Icon.Group>
                                Cohort Scenarios ({cohortScenarios.length})
                            </Menu.Item>
                        ],
                        right: [
                            <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
                                <Menu.Menu position="right">
                                    <Menu.Item
                                        key="menu-item-search-accounts"
                                        name="Search cohort scenarios"
                                        className="editormenu__padding"
                                    >
                                        <Input
                                            icon="search"
                                            placeholder="Search..."
                                            onChange={onScenarioSearchChange}
                                        />
                                    </Menu.Item>
                                </Menu.Menu>
                            </ConfirmAuth>
                        ]
                    }}
                />
                <Table
                    fixed
                    striped
                    selectable
                    role="grid"
                    aria-labelledby="header"
                    className="cohort__table--constraints"
                    unstackable
                >
                    <Table.Header className="cohort__table-thead-tbody-tr">
                        <Table.Row>
                            <Table.HeaderCell className="cohort__table-cell-first">
                                <Icon.Group className="editormenu__icon-group">
                                    <Icon name="newspaper outline" />
                                    <Icon
                                        corner="top right"
                                        name="add"
                                        color="green"
                                    />
                                </Icon.Group>
                            </Table.HeaderCell>
                            <Table.HeaderCell className="cohort__table-cell-options">
                                Options
                            </Table.HeaderCell>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                            <Table.HeaderCell className="cohort__table-cell-content">
                                Author
                            </Table.HeaderCell>
                            <Table.HeaderCell className="cohort__table-cell-content">
                                Description
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {scenarios.length ? (
                        <Sortable
                            tag="tbody"
                            className="cohort__scrolling-tbody"
                            onChange={onScenarioChangeOrder}
                            tableRef={this.tableBody}
                            options={{
                                direction: 'vertical',
                                swapThreshold: 0.5,
                                animation: 150
                            }}
                        >
                            {orderCorrectedScenarios.map((scenario, index) => {
                                if (!scenario) {
                                    return null;
                                }
                                const checked = cohort.scenarios.includes(
                                    scenario.id
                                );
                                const disabled = true;
                                const props = !checked ? { disabled } : {};
                                const pathname = `/cohort/${cohort.id}/run/${scenario.id}`;
                                const url = `${location.origin}${pathname}`;

                                const requiredPermission = checked
                                    ? 'view_scenarios_in_cohort'
                                    : 'edit_scenarios_in_cohort';

                                const onClickAddTab = (event, data) => {
                                    onClick(event, {
                                        ...data,
                                        type: 'scenario',
                                        source: scenario
                                    });
                                };

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
                                            <ConfirmAuth requiredPermission="edit_own_cohorts">
                                                <Table.Cell
                                                    key={`cell-checkbox-${index}`}
                                                    className="cohort__table-cell-first"
                                                >
                                                    <Checkbox
                                                        key={`checkbox-${index}`}
                                                        value={scenario.id}
                                                        checked={checked}
                                                        onClick={
                                                            onScenarioCheckboxClick
                                                        }
                                                    />
                                                </Table.Cell>
                                            </ConfirmAuth>
                                            <ConfirmAuth requiredPermission="edit_scenarios_in_cohort">
                                                <Table.Cell className="cohort__table-cell-options">
                                                    <Button.Group
                                                        hidden
                                                        basic
                                                        size="small"
                                                        className="cohort__button-group--transparent"
                                                    >
                                                        <Popup
                                                            content="Copy cohort scenario link to clipboard"
                                                            trigger={
                                                                <Button
                                                                    icon
                                                                    content={
                                                                        <Icon name="clipboard outline" />
                                                                    }
                                                                    onClick={() =>
                                                                        copy(
                                                                            url
                                                                        )
                                                                    }
                                                                    {...props}
                                                                />
                                                            }
                                                        />
                                                        <Popup
                                                            content="Run this cohort scenario as a participant"
                                                            trigger={
                                                                <Button
                                                                    icon
                                                                    content={
                                                                        <Icon name="play" />
                                                                    }
                                                                    onClick={() => {
                                                                        location.href = url;
                                                                    }}
                                                                    {...props}
                                                                />
                                                            }
                                                        />

                                                        <ConfirmAuth requiredPermission="view_all_data">
                                                            <Popup
                                                                content="View cohort reponses to prompts in this scenario"
                                                                trigger={
                                                                    <Button
                                                                        icon
                                                                        content={
                                                                            <Icon name="file alternate outline" />
                                                                        }
                                                                        name={
                                                                            scenario.title
                                                                        }
                                                                        onClick={
                                                                            onClickAddTab
                                                                        }
                                                                        {...props}
                                                                    />
                                                                }
                                                            />
                                                        </ConfirmAuth>
                                                        <Popup
                                                            content="Move scenario up"
                                                            trigger={
                                                                <Button
                                                                    icon="caret up"
                                                                    aria-label="Move scenario up"
                                                                    disabled={
                                                                        index ===
                                                                        0
                                                                    }
                                                                    onClick={() => {
                                                                        onScenarioChangeOrder(
                                                                            index,
                                                                            index -
                                                                                1
                                                                        );
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                        <Popup
                                                            content="Move scenario down"
                                                            trigger={
                                                                <Button
                                                                    icon="caret down"
                                                                    aria-label="Move scenario down"
                                                                    disabled={
                                                                        index ===
                                                                        cohortScenarios.length -
                                                                            1
                                                                    }
                                                                    onClick={() => {
                                                                        onScenarioChangeOrder(
                                                                            index,
                                                                            index +
                                                                                1
                                                                        );
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    </Button.Group>
                                                </Table.Cell>
                                            </ConfirmAuth>
                                            <ClickableTableCell
                                                href={pathname}
                                                display={scenario.title}
                                            />
                                            <Table.Cell className="cohort__table-cell-content">
                                                {scenario.author.username}
                                            </Table.Cell>
                                            <Table.Cell className="cohort__table-cell-content">
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
    onClick: PropTypes.func,
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
