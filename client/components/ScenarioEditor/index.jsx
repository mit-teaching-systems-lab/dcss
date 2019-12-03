import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Button,
    Container,
    Dropdown,
    Form,
    Grid,
    Popup
} from 'semantic-ui-react';
import { setScenario } from '@client/actions/scenario';

import ConfirmAuth from '@client/components/ConfirmAuth';
import './scenarioEditor.css';

class ScenarioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            categories: []
        };

        this.onChange = this.onChange.bind(this);
        this.onConsentChange = this.onConsentChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        if (this.props.scenarioId === 'new') {
            this.props.setScenario({
                title: '',
                description: '',
                categories: [],
                status: 1
            });
        }
    }

    async componentDidMount() {
        const categories = await (await fetch('/api/tags/categories')).json();
        this.setState({ categories });
    }

    onChange(event, { name, value }) {
        this.props.updateEditorMessage('');
        this.props.setScenario({ [name]: value });

        // Only auto-save after initial
        // save of new scenario
        // NOTE: temporarily disabling this until we
        // have a better strategy for auto saving details
        // on this page.
        // if (this.props.scenarioId !== 'new') {
        //     this.onSubmit();
        // }
    }

    onConsentChange(event, { value }) {
        this.props.updateEditorMessage('');

        let { id, prose } = this.props.consent;

        if (prose !== value) {
            id = null;
            prose = value;
            this.onChange(event, {
                name: 'consent',
                value: {
                    id,
                    prose
                }
            });
        }
    }

    async onSubmit() {
        if (!this.props.title || !this.props.description) {
            this.props.updateEditorMessage(
                'A title and description are required for Teacher Moments'
            );
            return;
        }

        this.setState({ saving: true });
        const data = {
            title: this.props.title,
            description: this.props.description,
            categories: this.props.categories,
            consent: this.props.consent,
            status: this.props.status
        };

        const saveResponse = await (await this.props.submitCB(data)).json();

        switch (saveResponse.status) {
            case 200:
                this.setState({ saving: false });
                this.props.updateEditorMessage('Teacher Moment saved');
                break;
            case 201:
                this.setState({ saving: false });
                this.props.updateEditorMessage('Teacher Moment created');
                break;
            default:
                if (saveResponse.error) {
                    this.setState({ saving: false });
                    this.props.updateEditorMessage(saveResponse.message);
                }
                break;
        }

        if (this.props.postSubmitCB) {
            this.props.postSubmitCB(saveResponse.scenario);
        }
    }

    render() {
        return (
            <Form size={'big'}>
                <Container fluid>
                    <Grid columns={2} divided>
                        <Grid.Row className="scenarioeditor__grid-nowrap">
                            <Grid.Column width={9}>
                                <Form.Input
                                    focus
                                    required
                                    label="Title"
                                    name="title"
                                    value={this.props.title}
                                    onChange={this.onChange}
                                />
                                <Form.TextArea
                                    focus="true"
                                    required
                                    label="Description"
                                    name="description"
                                    value={this.props.description}
                                    onChange={this.onChange}
                                />
                                {this.props.scenarioId !== 'new' && (
                                    <Popup
                                        content="Enter Consent Agreement prose here, or use the default provided Consent Agreement."
                                        trigger={
                                            <Form.TextArea
                                                focus="true"
                                                required
                                                label="Consent Agreement"
                                                name="consentprose"
                                                value={this.props.consent.prose}
                                                onChange={this.onConsentChange}
                                            />
                                        }
                                    />
                                )}

                                {this.state.saving ? (
                                    <Button type="submit" primary loading />
                                ) : (
                                    <Button
                                        type="submit"
                                        primary
                                        onClick={this.onSubmit}
                                    >
                                        Save
                                    </Button>
                                )}
                            </Grid.Column>
                            <Grid.Column
                                width={3}
                                className="scenarioeditor__categories-minwidth"
                            >
                                {this.state.categories.length && (
                                    <ConfirmAuth requiredPermission="edit_scenario">
                                        <Form.Field>
                                            <label>Categories</label>
                                            <Dropdown
                                                label="Categories"
                                                name="categories"
                                                placeholder="Select..."
                                                fluid
                                                multiple
                                                selection
                                                options={this.state.categories.map(
                                                    category => ({
                                                        key: category.id,
                                                        text: category.name,
                                                        value: category.name
                                                    })
                                                )}
                                                defaultValue={
                                                    this.props.categories
                                                }
                                                onChange={this.onChange}
                                            />
                                        </Form.Field>
                                    </ConfirmAuth>
                                )}
                                {/*
                                    TODO: create the same Dropdown style thing
                                            for displaying and selecting
                                            available topics (if any exist)

                                */}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    const { title, description, categories, consent, status } = state.scenario;
    return { title, description, categories, consent, status };
}

const mapDispatchToProps = {
    setScenario
};

ScenarioEditor.propTypes = {
    scenarioId: PropTypes.node.isRequired,
    setScenario: PropTypes.func.isRequired,
    submitCB: PropTypes.func.isRequired,
    postSubmitCB: PropTypes.func,
    updateEditorMessage: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.array,
    consent: PropTypes.shape({
        id: PropTypes.number,
        prose: PropTypes.string
    }),
    status: PropTypes.number
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenarioEditor);
