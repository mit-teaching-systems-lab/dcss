import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Grid, Button } from 'semantic-ui-react';
import { Parser } from 'json2csv';
import { getScenarios } from '@client/actions/scenario';

class Researcher extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scenarioId: undefined,
            scenarioTitle: undefined
        };

        this.downloadCSV = this.downloadCSV.bind(this);
        this.onSelectScenario = this.onSelectScenario.bind(this);
    }

    async componentDidMount() {
        await this.props.getScenarios();
    }

    async downloadCSV() {
        const researcherData = await (await fetch(
            `/api/scenarios/${this.state.scenarioId}/data/researcher`
        )).json();

        // TODO: this can be dynamically made. Need to figure out what happens when the data is empty
        const fields = [
            'response_id',
            'run_id',
            'response',
            'created_at',
            'ended_at',
            'user_id'
        ];
        const parser = new Parser({ fields });
        const csv = parser.parse(researcherData.data);

        const csvFile = new Blob([csv], { type: 'text/csv' });
        const csvURL = URL.createObjectURL(csvFile);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute(
            'download',
            `${encodeURI(this.state.scenarioTitle)}.csv`
        );
        tempLink.click();
    }

    onSelectScenario(event, { value: scenarioId, options }) {
        const { text: scenarioTitle } = options.find(
            option => option.value === scenarioId
        );

        this.setState({ scenarioId, scenarioTitle });
    }

    render() {
        let options =
            (this.props.scenarios &&
                this.props.scenarios.map(({ id, title }) => ({
                    key: id,
                    value: id,
                    text: title
                }))) ||
            [];
        return (
            <Grid columns={2}>
                <Grid.Column width={12}>
                    <Dropdown
                        placeholder="Select a Scenario"
                        fluid
                        search
                        selection
                        options={options}
                        onChange={this.onSelectScenario}
                    />
                </Grid.Column>
                <Grid.Column width={4}>
                    <Button
                        color="green"
                        onClick={this.downloadCSV}
                        disabled={!this.state.scenarioId}
                    >
                        Download CSV
                    </Button>
                </Grid.Column>
            </Grid>
        );
    }
}

Researcher.propTypes = {
    scenarios: PropTypes.array,
    getScenarios: PropTypes.func
};

const mapStateToProps = state => {
    const { scenarios } = state;
    return { scenarios };
};

const mapDispatchToProps = {
    getScenarios
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Researcher);
