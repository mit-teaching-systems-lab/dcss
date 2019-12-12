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
import { getScenario, setScenario } from '@client/actions/scenario';

import ConfirmAuth from '@client/components/ConfirmAuth';
import { Text } from '@client/components/Slide/Components';
import './scenarioEditor.css';

const { Editor: TextEditor } = Text;

const configTextEditor = {
    plugins: {
        options: 'inline link list image video help'
    },
    toolbar: {
        options: 'top',
        top: {
            options: 'inline link list image video history help',
            inline: {
                options: 'strong em underline strike'
            }
        }
    }
};

class ScenarioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            categories: []
        };

        this.onChange = this.onChange.bind(this);
        this.onConsentChange = this.onConsentChange.bind(this);
        this.onFinishSlideChange = this.onFinishSlideChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        if (this.props.scenarioId === 'new') {
            this.props.setScenario({
                title: '',
                description: '',
                finish: {
                    components: [
                        {
                            html: '<h2>Thanks for participating!</h2>'
                        }
                    ],
                    is_finish: true,
                    title: ''
                },
                categories: [],
                status: 1
            });
        }
    }

    async componentDidMount() {
        const categories = await (await fetch('/api/tags/categories')).json();
        this.setState({ categories });
        if (this.props.scenarioId !== 'new') {
            await this.props.getScenario(this.props.scenarioId);
        }
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

    onConsentChange({ html: value }) {
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

    onFinishSlideChange({ html }) {
        const {
            components: [existing],
            id,
            is_finish,
            title
        } = this.props.finish;

        if (!existing || (existing && existing.html !== html)) {
            this.onChange(event, {
                name: 'finish',
                value: {
                    components: [{ html, type: 'Text' }],
                    id,
                    is_finish,
                    title
                }
            });
        }
    }

    async onSubmit() {
        const {
            categories = [],
            consent,
            description,
            finish,
            postSubmitCB,
            status,
            submitCB,
            title,
            updateEditorMessage
        } = this.props;

        if (!title || !description) {
            updateEditorMessage(
                'A title and description are required for Teacher Moments'
            );
            return;
        }

        this.setState({ saving: true });

        const data = {
            categories,
            consent,
            description,
            finish,
            status,
            title
        };

        const response = await (await submitCB(data)).json();

        let editorMessage = '';
        switch (response.status) {
            case 200: {
                editorMessage = 'Scenario saved';
                break;
            }
            case 201: {
                editorMessage = 'Scenario created';
                break;
            }
            default:
                if (response.message) {
                    editorMessage = response.message;
                }
                break;
        }
        updateEditorMessage(editorMessage);
        this.setState({ saving: false });
        if (postSubmitCB) {
            postSubmitCB(response.scenario);
        }
    }

    render() {
        const {
            onChange,
            onConsentChange,
            onFinishSlideChange,
            onSubmit
        } = this;
        const {
            categories,
            consent,
            description,
            finish,
            scenarioId,
            title
        } = this.props;

        const consentAgreementValue = {
            type: 'Text',
            html: consent.prose || ''
        };

        return (
            <Form size={'big'}>
                <Container fluid>
                    <Grid columns={2} divided>
                        <Grid.Row className="scenarioeditor__grid-nowrap">
                            <Grid.Column
                                width={6}
                                className="scenarioeditor__grid-column-min-width"
                            >
                                <Popup
                                    content="Enter a title for your scenario. This will appear on the scenario 'entry' slide."
                                    trigger={
                                        <Form.Input
                                            focus
                                            required
                                            label="Title"
                                            name="title"
                                            value={title}
                                            onChange={onChange}
                                        />
                                    }
                                />
                                <Popup
                                    content="Enter a description for your scenario. This will appear on the scenario 'entry' slide."
                                    trigger={
                                        <Form.TextArea
                                            focus="true"
                                            required
                                            label="Description"
                                            name="description"
                                            value={description}
                                            onChange={onChange}
                                        />
                                    }
                                />

                                {scenarioId !== 'new' && (
                                    <Popup
                                        content="Enter Consent Agreement prose here, or use the default provided Consent Agreement. This will appear on the scenario 'entry' slide."
                                        trigger={
                                            <Form.Field required>
                                                <label>Consent Agreement</label>
                                                {consentAgreementValue.html && (
                                                    <TextEditor
                                                        onChange={
                                                            onConsentChange
                                                        }
                                                        scenarioId={scenarioId}
                                                        name="consentprose"
                                                        value={
                                                            consentAgreementValue
                                                        }
                                                        spellCheck={true}
                                                        styleConfig={{
                                                            editor: () => ({
                                                                height: '100px'
                                                            })
                                                        }}
                                                        config={
                                                            configTextEditor
                                                        }
                                                    />
                                                )}
                                            </Form.Field>
                                        }
                                    />
                                )}

                                {this.state.saving ? (
                                    <Button type="submit" primary loading />
                                ) : (
                                    <Button
                                        type="submit"
                                        primary
                                        onClick={onSubmit}
                                    >
                                        Save
                                    </Button>
                                )}
                            </Grid.Column>
                            <Grid.Column
                                width={6}
                                className="scenarioeditor__grid-column-min-width"
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
                                                defaultValue={categories}
                                                onChange={onChange}
                                            />
                                        </Form.Field>
                                    </ConfirmAuth>
                                )}
                                {/*
                                    TODO: create the same Dropdown style thing
                                            for displaying and selecting
                                            available topics (if any exist)

                                */}

                                {scenarioId !== 'new' && finish && (
                                    <Popup
                                        content="This will appear on the slide that's shown after the scenario has been completed."
                                        trigger={
                                            <Form.Field>
                                                <label>
                                                    After a scenario has been
                                                    completed, the participant
                                                    will be shown this:
                                                </label>
                                                <TextEditor
                                                    onChange={
                                                        onFinishSlideChange
                                                    }
                                                    scenarioId={scenarioId}
                                                    value={finish.components[0]}
                                                    spellCheck={true}
                                                    styleConfig={{
                                                        editor: () => ({
                                                            height: '200px'
                                                        })
                                                    }}
                                                    config={configTextEditor}
                                                />
                                            </Form.Field>
                                        }
                                    />
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    const {
        categories,
        consent,
        description,
        finish,
        status,
        title
    } = state.scenario;
    return { categories, consent, description, finish, status, title };
}

const mapDispatchToProps = {
    getScenario,
    setScenario
};

ScenarioEditor.propTypes = {
    getScenario: PropTypes.func.isRequired,
    scenarioId: PropTypes.node.isRequired,
    setScenario: PropTypes.func.isRequired,
    submitCB: PropTypes.func.isRequired,
    postSubmitCB: PropTypes.func,
    updateEditorMessage: PropTypes.func.isRequired,
    title: PropTypes.string,
    categories: PropTypes.array,
    consent: PropTypes.shape({
        id: PropTypes.number,
        prose: PropTypes.string
    }),
    description: PropTypes.string,
    finish: PropTypes.object,
    status: PropTypes.number
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ScenarioEditor);
