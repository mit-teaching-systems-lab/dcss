import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import storage from 'local-storage-fallback';

import EditorMenu from '@components/EditorMenu';
import ScenarioEditor from '@components/ScenarioEditor';
import ScenarioStatusMenuItem from '@components/EditorMenu/ScenarioStatusMenuItem';
import Scenario from '@components/Scenario';
import Slides from './Slides';
import { getScenario, setScenario } from '@client/actions/scenario';

import './editor.css';

const EditorMessage = ({ message }) => {
    return <div>{message}</div>;
};

class Editor extends Component {
    constructor(props) {
        super(props);

        this.copyScenario = this.copyScenario.bind(this);
        this.deleteScenario = this.deleteScenario.bind(this);
        this.getAllTabs = this.getAllTabs.bind(this);
        this.getPostSubmitCallback = this.getPostSubmitCallback.bind(this);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
        this.getTab = this.getTab.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClickScenarioAction = this.onClickScenarioAction.bind(this);
        this.setActiveView = this.setActiveView.bind(this);
        this.updateEditorMessage = this.updateEditorMessage.bind(this);
        this.updateScenario = this.updateScenario.bind(this);

        let {
            activeTab,
            activeSlideIndex,
            isCopyScenario,
            isNewScenario,
            match,
            scenarioId
        } = this.props;

        if (!scenarioId) {
            scenarioId = isNewScenario ? 'new' : match.params.id;
        }

        if (isNewScenario) {
            activeTab = 'scenario';
        }

        if (!isCopyScenario && !isNewScenario) {
            this.persistenceKey = `editor/${scenarioId}`;

            let persisted = JSON.parse(storage.getItem(this.persistenceKey));

            if (!persisted) {
                persisted = { activeTab: 'scenario', activeSlideIndex };
                storage.setItem(this.persistenceKey, JSON.stringify(persisted));
            }

            // These have already been declared as let bindings above
            // but we may override those values here, with whatever
            // was persisted for this scenario
            ({ activeTab, activeSlideIndex } = persisted);
        }

        this.state = {
            activeSlideIndex,
            activeTab,
            editorMessage: '',
            saving: false,
            scenarioId,
            tabs: this.getAllTabs(scenarioId)
        };

        if (isCopyScenario) {
            this.copyScenario(scenarioId);
        }

        if (!isNewScenario) {
            this.state.activeTab = 'slides';
            this.props.getScenario(scenarioId);
        }
    }

    onClick(e, { name: activeTab }) {
        this.setState({ activeTab });

        const persisted = JSON.parse(storage.getItem(this.persistenceKey));
        const updated = {
            ...persisted,
            activeTab
        };
        const { scenarioId } = this.state;

        storage.setItem(this.persistenceKey, JSON.stringify(updated));

        const pathname = `/editor/${scenarioId}/${activeTab}/${updated.activeSlideIndex}`;
        this.props.history.push(pathname);
        this.updateEditorMessage('');
    }

    setActiveView({ activeTab, activeSlideIndex }) {
        const { scenarioId } = this.state;

        const pathname = `/editor/${scenarioId}/${activeTab}/${activeSlideIndex}`;

        storage.setItem(
            this.persistenceKey,
            JSON.stringify({ activeTab, activeSlideIndex })
        );
        this.props.history.push(pathname);
    }

    onClickScenarioAction(event, data) {
        if (data.name === 'save-scenario') {
            this.updateScenario();
        }

        if (data.name === 'save-status') {
            this.updateScenario({ status: data.id });
        }
    }

    async copyScenario(scenarioId) {
        if (!scenarioId) return;

        const { scenario, status } = await (await fetch(
            `/api/scenarios/${scenarioId}/copy`,
            {
                method: 'POST'
            }
        )).json();

        if (status !== 201) {
            this.updateEditorMessage('Error saving copy.');
            return;
        }

        // Hard refresh to clear all previous state from the editor.
        location.href = `/editor/${scenario.id}`;
    }

    async deleteScenario(scenarioId) {
        const result = await fetch(`/api/scenarios/${scenarioId}`, {
            method: 'DELETE'
        });
        await result.json();

        // Hard redirect to clear all previous state from the editor.
        location.href = '/';
    }

    async updateScenario(updates = {}) {
        if (this.state.saving) {
            return;
        }

        this.setState({ saving: true });

        // NOTE: this is to support saving the whole
        //       scenario when clicking the [save icon]
        //       that's displayed via EditorMenu.
        const {
            categories,
            consent,
            description,
            finish,
            status,
            title
        } = this.props;

        const data = {
            categories,
            consent,
            description,
            finish,
            status,
            title
        };

        Object.assign(data, updates);

        const submitCallback = this.getSubmitCallback();
        const response = await (await submitCallback(data)).json();

        this.setState({ saving: false });

        switch (response.status) {
            case 200:
                this.props.setScenario(response.scenario);
                this.updateEditorMessage('Scenario saved');
                break;
            default:
                if (response.error) {
                    this.updateEditorMessage(response.message);
                }
                break;
        }
    }

    getTab(name, scenarioId) {
        const { activeSlideIndex = 0 } = this.state || this.props;
        const { setActiveView } = this;

        switch (name) {
            case 'scenario':
                return (
                    <ScenarioEditor
                        scenarioId={scenarioId}
                        submitCB={this.getSubmitCallback()}
                        postSubmitCB={this.getPostSubmitCallback()}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'slides':
                return (
                    <Slides
                        setActiveSlide={activeSlideIndex =>
                            setActiveView({
                                activeSlideIndex,
                                activeTab: 'slides'
                            })
                        }
                        activeSlideIndex={activeSlideIndex}
                        scenarioId={scenarioId}
                        updateEditorMessage={this.updateEditorMessage}
                    />
                );
            case 'preview':
                return (
                    <Scenario
                        setActiveSlide={activeSlideIndex =>
                            setActiveView({
                                activeSlideIndex,
                                activeTab: 'preview'
                            })
                        }
                        activeSlideIndex={activeSlideIndex}
                        scenarioId={scenarioId}
                    />
                );
            default:
                return null;
        }
    }

    getAllTabs(scenarioId) {
        switch (scenarioId) {
            case 'new':
                return {
                    scenario: this.getTab('scenario', 'new')
                };
            default:
                return {
                    scenario: this.getTab('scenario', scenarioId),
                    slides: this.getTab('slides', scenarioId),
                    preview: this.getTab('preview', scenarioId)
                };
        }
    }

    getSubmitCallback() {
        let endpoint, method;
        const { isNewScenario, scenarioId } = this.props;

        if (isNewScenario) {
            endpoint = '/api/scenarios';
            method = 'PUT';
        } else {
            endpoint = `/api/scenarios/${scenarioId}`;
            method = 'POST';
        }
        return scenario => {
            return fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(scenario)
            });
        };
    }

    getPostSubmitCallback() {
        const { history, isCopyScenario, isNewScenario } = this.props;
        const { setActiveView } = this;

        if (isCopyScenario || isNewScenario) {
            return scenario => {
                history.push(`/editor/${scenario.id}`);
                this.setState({ scenarioId: scenario.id }, () => {
                    setActiveView({ activeTab: 'slides' });
                });
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
    activeTab: PropTypes.string,
    activeSlideIndex: PropTypes.number,
    scenarioId: PropTypes.node,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    match: PropTypes.shape({
        path: PropTypes.string,
        params: PropTypes.shape({
            id: PropTypes.node,
            activeSlideIndex: PropTypes.node
        }).isRequired
    }).isRequired,
    location: PropTypes.shape({
        state: PropTypes.shape({
            scenarioCopyId: PropTypes.node
        })
    }).isRequired,
    isCopyScenario: PropTypes.bool,
    isNewScenario: PropTypes.bool,
    getScenario: PropTypes.func.isRequired,
    setScenario: PropTypes.func.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    categories: PropTypes.array,
    consent: PropTypes.shape({
        id: PropTypes.number,
        prose: PropTypes.string
    }),
    finish: PropTypes.object,
    status: PropTypes.number
};

function mapStateToProps(state) {
    const {
        categories,
        consent,
        description,
        finish,
        status,
        title
    } = state.scenario;
    return {
        categories,
        consent,
        description,
        finish,
        status,
        title
    };
}

const mapDispatchToProps = dispatch => ({
    getScenario: id => dispatch(getScenario(id)),
    setScenario: params => dispatch(setScenario(params))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Editor);
