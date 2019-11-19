import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import EditorMenu from '@components/EditorMenu';
import ScenarioEditor from '@components/ScenarioEditor';
import ScenarioStatusMenuItem from '@components/EditorMenu/ScenarioStatusMenuItem';
import Scenario from '@components/Scenario';
import Slides from './Slides';
import { setScenario } from '@client/actions';

import './editor.css';

const EditorMessage = ({ message }) => {
    return <div>{message}</div>;
};

class Editor extends Component {
    constructor(props) {
        super(props);

        if (!this.props.match.params.id) {
            this.props.match.params.id = 'new';
        }

        this.fetchScenario = this.fetchScenario.bind(this);
        this.deleteScenario = this.deleteScenario.bind(this);
        this.updateScenario = this.updateScenario.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickScenarioAction = this.onClickScenarioAction.bind(this);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
        this.getPostSubmitCallback = this.getPostSubmitCallback.bind(this);
        this.getTab = this.getTab.bind(this);
        this.updateEditorMessage = this.updateEditorMessage.bind(this);
        this.state = {
            activeTab: 'moment',
            editorMessage: '',
            saving: false,
            scenarioId: this.props.match.params.id,
            tabs: {
                moment: this.getTab('moment')
            }
        };

        if (this.props.match.params.id !== 'new') {
            Object.assign(this.state.tabs, {
                slides: this.getTab('slides'),
                preview: this.getTab('preview')
            });
            this.state.activeTab = 'slides';
            this.fetchScenario();
        }
    }

    onClick(e, { name }) {
        this.setState({ activeTab: name });
        this.updateEditorMessage('');
    }

    onClickScenarioAction(event, data) {
        if (data.name === 'save-scenario') {
            this.updateScenario();
        }

        if (data.name === 'save-status') {
            this.updateScenario({ status: data.id });
        }
    }

    async fetchScenario() {
        const { status, scenario } = await (await fetch(
            `/api/scenarios/${this.state.scenarioId}`
        )).json();

        if (status === 200) {
            this.props.setScenario(scenario);
        }
    }

    async deleteScenario(scenarioId) {
        const result = await fetch(`/api/scenarios/${scenarioId}`, {
            method: 'DELETE'
        });
        await result.json();

        this.setState({
            scenarioId: 'new',
            activeTab: 'moment'
        });

        this.props.history.push('/');
    }

    async updateScenario(updates = {}) {
        if (this.state.saving) {
            return;
        }

        this.setState({ saving: true });

        // NOTE: this is to support saving the whole
        //       scenario when clicking the [save icon]
        //       that's displayed via EditorMenu.
        const data = {
            title: this.props.title,
            description: this.props.description,
            categories: this.props.categories,
            consent: this.props.consent,
            status: this.props.status
        };

        Object.assign(data, updates);

        const submitCallback = this.getSubmitCallback();
        const response = await (await submitCallback(data)).json();

        this.setState({ saving: false });

        switch (response.status) {
            case 200:
                this.props.setScenario(response.scenario);
                this.updateEditorMessage('Teacher Moment saved');
                break;
            default:
                if (response.error) {
                    this.updateEditorMessage(response.message);
                }
                break;
        }
    }

    getTab(name) {
        switch (name) {
            case 'moment':
                return (
                    <ScenarioEditor
                        scenarioId={this.props.match.params.id}
                        submitCB={this.getSubmitCallback()}
                        postSubmitCB={this.getPostSubmitCallback()}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'slides':
                return (
                    <Slides
                        scenarioId={this.props.match.params.id}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'preview':
                return <Scenario scenarioId={this.props.match.params.id} />;
            default:
                return null;
        }
    }

    getSubmitCallback() {
        let endpoint, method;
        const scenarioId = this.props.match.params.id;

        if (scenarioId === 'new') {
            endpoint = '/api/scenarios';
            method = 'PUT';
        } else {
            endpoint = `/api/scenarios/${scenarioId}`;
            method = 'POST';
        }

        return scenarioData => {
            return fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scenarioData)
            });
        };
    }

    getPostSubmitCallback() {
        if (this.props.match.params.id === 'new') {
            return scenarioData => {
                this.props.history.push(`/editor/${scenarioData.id}`);
                this.setState({
                    activeTab: 'slides',
                    scenarioId: scenarioData.id
                });

                // Clear cached new scenario values from tabs
                const tabs = Object.assign({}, this.state.tabs, {
                    moment: this.getTab('moment'),
                    slides: this.getTab('slides'),
                    preview: this.getTab('preview')
                });

                this.setState({ tabs });
            };
        }

        return null;
    }

    updateEditorMessage(message) {
        this.setState({ editorMessage: message });
    }

    render() {
        const scenarioStatusMenuItem = this.props.status !== undefined && (
            <ScenarioStatusMenuItem
                key="scenario-status-menu-item"
                name="Set scenario status"
                status={this.props.status}
                onClick={this.onClickScenarioAction}
            />
        );

        return (
            <div>
                <Menu attached="top" tabular>
                    <Menu.Item
                        name="moment"
                        active={this.state.activeTab === 'moment'}
                        onClick={this.onClick}
                    />
                    {this.state.scenarioId !== 'new' && (
                        <React.Fragment>
                            <Menu.Item
                                name="slides"
                                active={this.state.activeTab === 'slides'}
                                onClick={this.onClick}
                            />
                            <Menu.Item
                                name="preview"
                                active={this.state.activeTab === 'preview'}
                                onClick={this.onClick}
                            />
                        </React.Fragment>
                    )}
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <EditorMessage message={this.state.editorMessage} />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Segment attached="bottom" className="editor__content-pane">
                    {this.state.scenarioId !== 'new' && (
                        <EditorMenu
                            type="scenario"
                            items={{
                                save: {
                                    onClick: (...args) => {
                                        this.onClickScenarioAction(...args);
                                    }
                                },
                                delete: {
                                    onConfirm: () => {
                                        this.deleteScenario(
                                            this.state.scenarioId
                                        );
                                    }
                                },
                                right: [scenarioStatusMenuItem]
                            }}
                        />
                    )}

                    {this.state.tabs[this.state.activeTab]}
                </Segment>
            </div>
        );
    }
}

// Note: this silences the warning about "text={}" receiving
// an object, instead of a string.
Dropdown.propTypes.text = PropTypes.any;

EditorMessage.propTypes = {
    message: PropTypes.string
};

Editor.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired,
    setScenario: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.array,
    consent: PropTypes.shape({
        id: PropTypes.number,
        prose: PropTypes.string
    }),
    status: PropTypes.number
};

function mapStateToProps(state) {
    const { title, description, categories, consent, status } = state.scenario;
    return { title, description, categories, consent, status };
}

const mapDispatchToProps = {
    setScenario
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);
