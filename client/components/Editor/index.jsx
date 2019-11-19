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

        const scenarioId = this.props.match.params.id || 'new';

        this.fetchScenario = this.fetchScenario.bind(this);
        this.copyScenario = this.copyScenario.bind(this);
        this.deleteScenario = this.deleteScenario.bind(this);
        this.updateScenario = this.updateScenario.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickScenarioAction = this.onClickScenarioAction.bind(this);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
        this.getPostSubmitCallback = this.getPostSubmitCallback.bind(this);
        this.getTab = this.getTab.bind(this);
        this.getAllTabs = this.getAllTabs.bind(this);
        this.updateEditorMessage = this.updateEditorMessage.bind(this);
        this.state = {
            activeTab: 'moment',
            editorMessage: '',
            saving: false,
            scenarioId: scenarioId,
            tabs: this.getAllTabs(scenarioId)
        };

        switch (scenarioId) {
            case 'new':
            case 'copy':
                break;
            default:
                this.state.activeTab = 'slides';
                this.fetchScenario();
                break;
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

    componentDidMount() {
        if (this.state.scenarioId === 'copy') {
            this.copyScenario();
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

    async copyScenario() {
        const { scenarioCopyId } = this.props.location.state;
        if (!scenarioCopyId) return;

        const postSubmitCB = this.getPostSubmitCallback();
        const copyResponse = await (await fetch(
            `/api/scenarios/${scenarioCopyId}/copy`,
            {
                method: 'POST'
            }
        )).json();

        if (copyResponse.status !== 201) {
            this.updateEditorMessage('Error saving copy.');
            return;
        }

        this.props.setScenario(copyResponse.scenario);
        postSubmitCB(copyResponse.scenario);
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

    getTab(name, scenarioId) {
        switch (name) {
            case 'moment':
                return (
                    <ScenarioEditor
                        scenarioId={scenarioId || this.props.match.params.id}
                        submitCB={this.getSubmitCallback()}
                        postSubmitCB={this.getPostSubmitCallback()}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'slides':
                return (
                    <Slides
                        scenarioId={scenarioId || this.props.match.params.id}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'preview':
                return (
                    <Scenario
                        scenarioId={scenarioId || this.props.match.params.id}
                    />
                );
            default:
                return null;
        }
    }

    getAllTabs(scenarioId) {
        if (!scenarioId) return {};
        let copyId;
        switch (scenarioId) {
            case 'new':
                return {
                    moment: this.getTab('moment', 'new')
                };
            case 'copy':
                copyId = String(this.props.location.state.scenarioCopyId);
                return {
                    moment: this.getTab('moment', copyId),
                    slides: this.getTab('slides', copyId),
                    preview: this.getTab('preview', copyId)
                };
            default:
                return {
                    moment: this.getTab('moment'),
                    slides: this.getTab('slides'),
                    preview: this.getTab('preview')
                };
        }
    }

    getSubmitCallback() {
        let endpoint, method;
        const scenarioId = this.props.match.params.id;

        if (this.props.isNewScenario || scenarioId === 'copy') {
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
        if (this.props.isNewScenario || this.props.match.params.id === 'copy') {
            return scenarioData => {
                this.props.history.push(`/editor/${scenarioData.id}`);
                this.setState({
                    activeTab: 'moment',
                    scenarioId: scenarioData.id
                });

                // Clear cached new scenario values from tabs
                const tabs = this.getAllTabs(scenarioData.id);
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
        const editTabMenu = Object.keys(this.state.tabs).map(tabType => {
            return (
                <Menu.Item
                    key={tabType}
                    name={tabType}
                    active={this.state.activeTab === tabType}
                    onClick={this.onClick}
                />
            );
        });

        return (
            <div>
                <Menu attached="top" tabular>
                    {editTabMenu}
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
    location: PropTypes.shape({
        state: PropTypes.shape({
            scenarioCopyId: PropTypes.node
        })
    }).isRequired,
    isNewScenario: PropTypes.bool,
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
