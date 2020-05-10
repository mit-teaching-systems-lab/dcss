import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Card, Container, Grid, Icon, Input, Menu } from 'semantic-ui-react';
import _ from 'lodash';
import changeCase from 'change-case';
import { getScenarios } from '@client/actions/scenario';
import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import ScenarioEntries from './ScenarioEntries';
import 'semantic-ui-css/semantic.min.css';
import './ScenariosList.css';

class ScenariosList extends Component {
    constructor(props) {
        super(props);

        const { category } = this.props;

        this.state = {
            category,
            heading: '',
            scenarios: [],
            viewHeading: '',
            viewScenarios: []
        };

        this.onClickCreateScenario = this.onClickCreateScenario.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.reduceScenarios = this.reduceScenarios.bind(this);
        this.moveDeletedScenarios = this.moveDeletedScenarios.bind(this);
    }

    async componentDidMount() {
        await this.props.getScenarios();
        await this.reduceScenarios();
    }

    moveDeletedScenarios(scenarios = []) {
        return [
            ...scenarios.filter(({ deleted_at }) => !deleted_at),
            ...scenarios.filter(({ deleted_at }) => deleted_at)
        ];
    }

    async reduceScenarios() {
        const { category } = this.state;
        let scenarios = [];
        let heading = '';
        let authorUsername = '';

        switch (category) {
            case 'all':
                scenarios.push(...this.props.scenarios);
                heading = 'All Scenarios';
                break;
            case 'author':
                authorUsername = this.props.match.params.username;
                // Currently we're only showing author views for the current user
                if (this.props.username !== authorUsername) {
                    return;
                }

                heading = `Scenarios by ${authorUsername}`;
                scenarios.push(
                    ...this.props.scenarios.filter(({ user_is_author }) => {
                        return user_is_author;
                    })
                );
                break;
            case 'official':
            case 'community':
                scenarios = this.props.scenarios.filter(({ categories }) => {
                    return !category || categories.includes(category);
                });
                heading = `${changeCase.titleCase(category)} Scenarios`;
                break;
        }

        scenarios = this.moveDeletedScenarios(scenarios);

        this.setState({
            heading,
            scenarios,
            viewScenarios: scenarios.slice(0),
            viewHeading: heading
        });
    }

    onSearchChange(event, props) {
        const { scenarios, viewHeading, viewScenarios } = this.state;
        const { value } = props;
        let replacementHeading = '';

        if (value === '') {
            this.setState({
                scenarios: viewScenarios,
                heading: viewHeading
            });

            return;
        }

        const escapedRegExp = new RegExp(_.escapeRegExp(value), 'i');
        const results = scenarios.filter(record => {
            const {
                author: { username },
                categories,
                description,
                title
            } = record;
            if (escapedRegExp.test(title)) {
                return true;
            }

            if (escapedRegExp.test(description)) {
                return true;
            }

            if (escapedRegExp.test(username)) {
                return true;
            }

            if (categories.some(category => escapedRegExp.test(category))) {
                return true;
            }

            return false;
        });

        replacementHeading = `${viewHeading}, matching '${value}'`;

        if (results.length === 0) {
            results.push(...viewScenarios);
            replacementHeading = viewHeading;
        }

        this.setState({
            scenarios: results,
            heading: replacementHeading
        });
    }

    onClickCreateScenario() {
        location.href = '/editor/new';
    }

    render() {
        const { heading, scenarios } = this.state;
        const { onClickCreateScenario, onSearchChange } = this;
        return (
            <React.Fragment>
                <EditorMenu
                    type="scenarios"
                    items={{
                        left: [
                            <ConfirmAuth
                                key="menu-item-create-scenario-auth"
                                requiredPermission="create_scenario"
                            >
                                <Menu.Item
                                    key="menu-item-create-scenario"
                                    name="Create a scenario"
                                    onClick={onClickCreateScenario}
                                    className="scenarios__menu-item--padding"
                                >
                                    <Icon.Group className="editormenu__icon-group">
                                        <Icon name="newspaper outline" />
                                        <Icon
                                            corner="top right"
                                            name="add"
                                            color="green"
                                        />
                                    </Icon.Group>
                                    Create a Scenario
                                </Menu.Item>
                            </ConfirmAuth>,
                            <Menu.Item
                                key="menu-item-search-scenarios"
                                name="Search scenarios"
                                className="scenarios__menu-item--padding"
                            >
                                <Input
                                    icon="search"
                                    placeholder="Search..."
                                    onChange={onSearchChange}
                                />
                            </Menu.Item>
                        ]
                    }}
                />
                <Container fluid>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column stretched>
                                {heading && <h3>{heading}</h3>}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column stretched>
                                {scenarios.length ? (
                                    <Card.Group>
                                        <ScenarioEntries
                                            scenarios={scenarios}
                                            isLoggedIn={this.props.isLoggedIn}
                                        />
                                    </Card.Group>
                                ) : (
                                    <Loading size="medium" />
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }
}

ScenariosList.propTypes = {
    category: PropTypes.string,
    getScenarios: PropTypes.func,
    isLoggedIn: PropTypes.bool.isRequired,
    location: PropTypes.object,
    match: PropTypes.shape({
        params: PropTypes.shape({
            username: PropTypes.string
        })
    }),
    scenarios: PropTypes.array,
    username: PropTypes.string
};

function mapStateToProps(state) {
    const {
        login: { isLoggedIn, username },
        scenarios
    } = state;
    return { isLoggedIn, username, scenarios };
}

const mapDispatchToProps = {
    getScenarios
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenariosList);
