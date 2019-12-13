import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Grid, Loader } from 'semantic-ui-react';
import changeCase from 'change-case';
import PropTypes from 'prop-types';
import { getScenarios } from '@client/actions/scenario';
import ScenarioEntries from './ScenarioEntries';
import 'semantic-ui-css/semantic.min.css';
import './ScenariosList.css';

class ScenariosList extends Component {
    constructor(props) {
        super(props);

        const { category } = this.props;

        this.state = {
            category,
            listHeading: '',
            reducedScenarios: []
        };

        this.sortDeletedScenarios = this.sortDeletedScenarios.bind(this);
        this.reduceScenarios = this.reduceScenarios.bind(this);
    }

    async componentDidMount() {
        await this.props.getScenarios();
        await this.reduceScenarios();
    }

    sortDeletedScenarios(scenarios) {
        scenarios.forEach((scenario, index, scenarios) => {
            if (scenario.deleted_at) {
                scenarios.splice(index, 1);
                scenarios.push(scenario);
            }
        });

        return scenarios;
    }

    async reduceScenarios() {
        const { category } = this.state;
        let filteredScenarios = [];
        let listHeading = '';
        let authorUsername = '';

        switch (category) {
            case 'all':
                filteredScenarios = this.props.scenarios;
                listHeading = 'All Scenarios';
                break;
            case 'author':
                authorUsername = this.props.match.params.username;
                // Currently we're only showing author views for the current user
                if (this.props.username !== authorUsername) return;

                listHeading = ` Scenarios by ${changeCase.titleCase(
                    authorUsername
                )}`;
                filteredScenarios = this.props.scenarios.filter(
                    ({ user_is_author }) => {
                        return user_is_author;
                    }
                );
                break;
            case 'official':
            case 'community':
                filteredScenarios = this.props.scenarios.filter(
                    ({ categories }) => {
                        return !category || categories.includes(category);
                    }
                );
                listHeading = `${changeCase.titleCase(category)} Scenarios`;
                break;
            case 'continue':
                // eslint-disable-next-line no-case-declarations
                const { scenarios } = await (await fetch(
                    'api/scenarios/run'
                )).json();
                filteredScenarios = scenarios;
                listHeading = filteredScenarios.length
                    ? 'In-progress and Completed Scenarios'
                    : 'No Scenarios Completed Yet';
                break;
        }

        filteredScenarios = this.sortDeletedScenarios(filteredScenarios);
        this.setState({
            reducedScenarios: filteredScenarios,
            listHeading
        });
    }

    render() {
        const { listHeading, reducedScenarios } = this.state;

        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column stretched>
                            <h2>
                                Practice spaces for teacher preparation programs
                            </h2>
                            {listHeading && <h3>{listHeading}</h3>}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column stretched>
                            {reducedScenarios.length ? (
                                <Card.Group>
                                    <ScenarioEntries
                                        scenarios={reducedScenarios}
                                        isLoggedIn={this.props.isLoggedIn}
                                    />
                                </Card.Group>
                            ) : (
                                <Loader inverted content="Loading" />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
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
