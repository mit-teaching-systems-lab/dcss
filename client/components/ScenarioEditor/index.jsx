import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Form, Grid } from 'semantic-ui-react';
import { setScenario } from '@client/actions';

import './scenarioEditor.css';

class ScenarioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            saveMessage: ''
        };

        this.getScenarioData = this.getScenarioData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        if (this.props.scenarioId === 'new') {
            this.props.setScenario({ title: '', description: '' });
        } else {
            this.getScenarioData();
        }
    }

    async getScenarioData() {
        const scenarioResponse = await (await fetch(
            `/api/scenarios/${this.props.scenarioId}`
        )).json();

        if (scenarioResponse.status === 200) {
            this.props.setScenario({
                title: scenarioResponse.scenario.title,
                description: scenarioResponse.scenario.description
            });
        }
    }

    handleChange(event) {
        this.setState({
            saveMessage: ''
        });
        this.props.setScenario({ [event.target.name]: event.target.value });
    }

    async handleSubmit() {
        if (!this.props.title || !this.props.description) {
            this.setState({
                saveMessage:
                    'A title and description are required for Teacher Moments'
            });
            return;
        }
        this.setState({ saving: true });
        const data = {
            title: this.props.title,
            description: this.props.description
        };
        const saveResponse = await (await this.props.submitCB(data)).json();

        switch (saveResponse.status) {
            case 200:
                this.setState({ saving: false, saveMessage: 'Saved!' });
                break;
            case 201:
                this.setState({ saving: false, saveMessage: 'Saved!' });
                break;
            default:
                if (saveResponse.error) {
                    this.setState({
                        saving: false,
                        saveMessage: saveResponse.message
                    });
                }
                break;
        }

        if (this.props.postSubmitCB) {
            this.props.postSubmitCB(saveResponse.scenario);
        }
    }

    render() {
        return (
            <Container fluid className="tm__editor-tab">
                <h2>Teacher Moment Details</h2>
                <Form size={'big'}>
                    <Form.Input
                        focus
                        required
                        label="Title"
                        name="title"
                        value={this.props.title}
                        onChange={this.handleChange}
                    />
                    <Form.TextArea
                        focus="true"
                        required
                        label="Moment Description"
                        name="description"
                        value={this.props.description}
                        onChange={this.handleChange}
                    />
                    <Grid divided="vertically">
                        <Grid.Row columns={2}>
                            <Grid.Column width={3}>
                                {this.state.saving ? (
                                    <Form.Button
                                        type="submit"
                                        className="tm__scenario-save"
                                        primary
                                        loading
                                    />
                                ) : (
                                    <Form.Button
                                        type="submit"
                                        className="tm__scenario-save"
                                        primary
                                        onClick={this.handleSubmit}
                                    >
                                        Submit
                                    </Form.Button>
                                )}
                            </Grid.Column>
                            <Grid.Column>{this.state.saveMessage}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    const { title, description } = state.scenario;
    return { title, description };
}

const mapDispatchToProps = {
    setScenario
};

ScenarioEditor.propTypes = {
    scenarioId: PropTypes.node.isRequired,
    setScenario: PropTypes.func.isRequired,
    submitCB: PropTypes.func.isRequired,
    postSubmitCB: PropTypes.func,
    title: PropTypes.string,
    description: PropTypes.string
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenarioEditor);
