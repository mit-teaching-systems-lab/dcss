import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Parser } from 'json2csv';
import { connect } from 'react-redux';
import {
    Button,
    //This is disabled for Jamboree.
    // Dropdown,
    Icon,
    //This is disabled for Jamboree.
    // Menu,
    Pagination,
    Popup,
    Table
} from 'semantic-ui-react';
import { getAllCohorts } from '@client/actions/cohort';
import { getScenarios, getScenarioRunHistory } from '@client/actions/scenario';
import { getUser } from '@client/actions/user';
import { makeHeader } from '@client/util/data-table';
import CSV from '@client/util/csv';
import './Researcher.css';

const ROWS_PER_PAGE = 10;

function isAudioFile(input) {
    return /^audio\/\d.+\/AudioResponse/.test(input) && input.endsWith('.mp3');
}

class Researcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            activePage: 1,
            scenario: null,
            cohort: null
        };
        // This is disabled for Jamboree.
        // this.onCohortSelect = this.onCohortSelect.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onScenarioDataClick = this.onScenarioDataClick.bind(this);
    }

    async componentDidMount() {
        await this.props.getScenarios();
        await this.props.getAllCohorts();

        this.setState({ loading: false });
    }

    // This is disabled for Jamboree.
    // onCohortSelect(event, data) {
    //     console.log(data);
    //     // this.setState()
    // }

    onPageChange(event, { activePage }) {
        this.setState({
            activePage
        });
    }

    async onScenarioDataClick(event, data) {
        const { getScenarioRunHistory } = this.props;
        const { name } = data;

        this.setState(
            {
                [name]: data[name]
            },
            async () => {
                const { cohort = {}, scenario = {} } = this.state;
                const { id: scenarioId } = scenario || {};
                const { id: cohortId } = cohort || {};
                const { prompts, responses } = await getScenarioRunHistory({
                    scenarioId,
                    cohortId
                });
                const records = responses.flat();

                records.forEach(record => {
                    const { is_skip, response_id, transcript, value } = record;
                    const prompt = prompts.find(
                        prompt => prompt.responseId === response_id
                    );
                    record.header = makeHeader(prompt, prompts);
                    record.content = is_skip
                        ? '(skipped)'
                        : transcript || value;

                    if (isAudioFile(value)) {
                        record.content += ` (${location.origin}/api/media/${value})`;
                    }
                });

                const fields = [
                    'username',
                    'header',
                    'content',
                    'is_skip',
                    'run_id',
                    'created_at',
                    'ended_at',
                    'type',
                    'referrer_params'
                ];
                const parser = new Parser({ fields });
                const csv = parser.parse(records);

                CSV.download(scenario.title, csv);
            }
        );
    }

    render() {
        const { onPageChange, onScenarioDataClick } = this;
        const { activePage, loading } = this.state;
        // This is disabled for Jamboree.
        // const { cohorts } = this.props;
        const scenarios = this.props.scenarios.filter(
            scenario => scenario.deleted_at === null
        );

        const scenariosPages = Math.ceil(scenarios.length / ROWS_PER_PAGE);
        const scenariosIndex = (activePage - 1) * ROWS_PER_PAGE;
        const scenariosSlice = scenarios.slice(
            scenariosIndex,
            scenariosIndex + ROWS_PER_PAGE
        );

        if (loading) {
            return null;
        }

        return (
            <div>
                <Table role="grid" unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan="4">
                                Research: Download Scenario Run Data
                            </Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell collapsing></Table.HeaderCell>
                            <Table.HeaderCell>Title</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {scenariosSlice.map(scenario => {
                            const { id, title } = scenario;
                            const scenarioKey = `scenario-${id}`;
                            const pathname = `/run/${id}/slide/0`;

                            // This is disabled for Jamboree.
                            // const options = cohorts.map(
                            //     ({ id: key, name: text }) => ({
                            //         key,
                            //         text,
                            //         value: key
                            //     })
                            // );

                            return (
                                <Table.Row key={id}>
                                    <Table.Cell collapsing>
                                        {/* This is disabled for Jamboree.

                                        <Menu compact>
                                            <Dropdown
                                                item
                                                options={options}
                                                onChange={onCohortSelect}
                                                simple
                                                text="Limit to a Cohort"
                                            />
                                        </Menu>
                                    */}
                                        <ResearcherMenu
                                            key={scenarioKey}
                                            scenario={scenario}
                                            onClick={onScenarioDataClick}
                                        />
                                    </Table.Cell>
                                    <Table.Cell
                                        onClick={() => {
                                            location.href = pathname;
                                        }}
                                    >
                                        <NavLink to={pathname}>{title}</NavLink>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>

                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="4">
                                <Pagination
                                    name="scenarios"
                                    siblingRange={1}
                                    boundaryRange={0}
                                    ellipsisItem={null}
                                    firstItem={null}
                                    lastItem={null}
                                    activePage={activePage}
                                    onPageChange={onPageChange}
                                    totalPages={scenariosPages}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        );
    }
}

const ResearcherMenu = props => {
    const { onClick, scenario } = props;

    const onClickToDownloadData = (event, props) => {
        onClick(event, {
            ...props,
            scenario
        });
    };
    return (
        <Button.Group
            hidden
            basic
            size="tiny"
            className="buttongroup__button-group--transparent"
        >
            <Popup
                content="Download all data from this scenario"
                trigger={
                    <Button
                        icon
                        content={<Icon name="download" />}
                        name="scenario"
                        onClick={onClickToDownloadData}
                    />
                }
            />
        </Button.Group>
    );
};

ResearcherMenu.propTypes = {
    scenario: PropTypes.object,
    onClick: PropTypes.func
};

Researcher.propTypes = {
    cohorts: PropTypes.array,
    history: PropTypes.object,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    getAllCohorts: PropTypes.func,
    getScenarios: PropTypes.func,
    getScenarioRunHistory: PropTypes.func,
    getUser: PropTypes.func,
    onClick: PropTypes.func,
    user: PropTypes.object
};

const mapStateToProps = state => {
    const { allCohorts: cohorts } = state.cohort;
    const { history, runs, scenarios, user } = state;
    return { cohorts, history, runs, scenarios, user };
};

const mapDispatchToProps = dispatch => ({
    getAllCohorts: () => dispatch(getAllCohorts()),
    getScenarios: () => dispatch(getScenarios()),
    getScenarioRunHistory: params => dispatch(getScenarioRunHistory(params)),
    getUser: () => dispatch(getUser())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Researcher);
