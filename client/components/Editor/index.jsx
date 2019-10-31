import React, { Component } from 'react';
import { Menu, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import EditorMenu from '@components/EditorMenu';
import ScenarioEditor from '@components/ScenarioEditor';
import Scenario from '@components/Scenario';
import Slides from './Slides';

import './editor.css';

const EditorMessage = ({ message }) => {
    return <div>{message}</div>;
};

class Editor extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onClickScenarioAction = this.onClickScenarioAction.bind(this);
        this.getSubmitCallback = this.getSubmitCallback.bind(this);
        this.getPostSubmitCallback = this.getPostSubmitCallback.bind(this);
        this.getTab = this.getTab.bind(this);
        this.updateEditorMessage = this.updateEditorMessage.bind(this);
        this.state = {
            activeTab: 'moment',
            editorMessage: '',
            scenarioId: this.props.match.params.id,
            tabs: {
                moment: this.getTab('moment')
            }
        };

        if (this.props.match.params.id != 'new') {
            const tabsObj = {
                ...this.state.tabs,
                slides: this.getTab('slides'),
                preview: this.getTab('preview')
            };
            this.state.tabs = tabsObj;
        }
    }

    onClick(e, { name }) {
        this.setState({ activeTab: name });
        this.updateEditorMessage('');
    }

    onClickScenarioAction(event, data) {
        if (data.name === 'save-scenario') {
            // TODO: Determine if we need to actually
            //       save the scenario, or if the
            //       auto-save is sufficient.
            this.updateEditorMessage('Teacher Moment saved');
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
                method: method,
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

                if (!this.state.tabs.slides) {
                    const tabs = this.state.tabs;
                    tabs.slides = this.getTab('slides');
                    this.setState({ tabs });
                }
            };
        }

        return null;
    }

    updateEditorMessage(message) {
        this.setState({ editorMessage: message });
    }

    render() {
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
                <Segment attached="bottom">
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
                                }
                            }}
                        />
                    )}
                    <div>{this.state.tabs[this.state.activeTab]}</div>
                </Segment>
            </div>
        );
    }
}

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
    }).isRequired
};

export default Editor;
