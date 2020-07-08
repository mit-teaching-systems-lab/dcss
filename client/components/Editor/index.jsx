import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Icon, Menu, Segment } from '@components/UI';
import PropTypes from 'prop-types';
import Storage from '@utils/Storage';
import EditorMenu from '@components/EditorMenu';
import { notify } from '@components/Notification';
import ScenarioEditor from '@components/ScenarioEditor';
import ScenarioStatusMenuItem from '@components/EditorMenu/ScenarioStatusMenuItem';
import Scenario from '@components/Scenario';
import Slides from './Slides';
import { getScenario, setScenario } from '@actions/scenario';

import './editor.css';

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
    this.updateScenario = this.updateScenario.bind(this);

    let noPersistedView = true;
    let {
      activeTab,
      activeSlideIndex,
      isCopyScenario,
      isNewScenario,
      match,
      scenarioId
    } = this.props;

    if (!scenarioId) {
      scenarioId = isNewScenario ? 'new' : Number(match.params.id);
    }

    if (isNewScenario) {
      activeTab = 'scenario';
    }

    if (!isCopyScenario && !isNewScenario) {
      this.sessionKey = `editor/${scenarioId}`;

      let persisted = Storage.get(this.sessionKey, {
        activeTab: 'scenario',
        activeSlideIndex
      });

      // These have already been declared as let bindings above
      // but we may override those values here, with whatever
      // was persisted for this scenario
      ({ activeTab, activeSlideIndex } = persisted);

      noPersistedView = false;
    }

    this.state = {
      activeSlideIndex,
      activeTab,
      scenarioId,
      tabs: null
    };

    if (isCopyScenario) {
      this.copyScenario(scenarioId);
    }

    if (!isNewScenario) {
      if (noPersistedView) {
        this.state.activeTab = 'slides';
      }
      this.props.getScenario(scenarioId);
    }
  }

  componentDidMount() {
    this.setState(state => ({
      tabs: this.getAllTabs(state.scenarioId)
    }));
  }

  onClick(e, { name: activeTab }) {
    this.setState({ activeTab });
    const { scenarioId } = this.state;
    // const updated = Storage.merge(this.sessionKey, {
    //   activeSlideIndex,
    //   activeTab
    // });

    let activeNonZeroSlideIndex = Number(
      this.props.match.params.activeNonZeroSlideIndex ||
        this.props.match.params.activeRunSlideIndex
    );

    const pathname = `/editor/${scenarioId}/${activeTab}/${activeNonZeroSlideIndex}`;

    this.props.history.push(pathname);

    Storage.set(this.sessionKey, {
      activeSlideIndex: activeNonZeroSlideIndex,
      activeTab
    });
  }

  setActiveView({ activeTab, activeSlideIndex }) {
    const { scenarioId } = this.state;
    /*

        High likelihood that this is buggy.


     */

    let activeNonZeroSlideIndex = activeSlideIndex + 1 || 1;
    let pathname;

    if (activeTab === 'preview') {
      activeNonZeroSlideIndex = activeSlideIndex;
      pathname = `/editor/${scenarioId}/${activeTab}/${activeNonZeroSlideIndex}`;
      this.setState({ activeTabSlideIndex: activeNonZeroSlideIndex });
    } else {
      pathname = `/editor/${scenarioId}/${activeTab}/${activeNonZeroSlideIndex}`;
      this.setState({ activeSlideIndex });
    }

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

  // TODO: Move to own async action
  async copyScenario(scenarioId) {
    if (!scenarioId) return;

    const { scenario, status } = await (await fetch(
      `/api/scenarios/${scenarioId}/copy`,
      {
        method: 'POST'
      }
    )).json();

    if (status !== 201) {
      notify({ type: 'error', message: 'Error saving copy.' });
      return;
    }

    // Hard refresh to clear all previous state from the editor.
    // TODO: determine if this can be handled by pushing to history
    location.href = `/editor/${scenario.id}`;
  }

  // TODO: Move to own async action
  async deleteScenario(scenarioId) {
    await (await fetch(`/api/scenarios/${scenarioId}`, {
      method: 'DELETE'
    })).json();

    // Hard redirect to clear all previous state from the editor.
    location.href = '/';
  }

  // TODO: Move to own async action
  async updateScenario(updates = {}) {
    // NOTE: this is to support saving the whole
    //       scenario when clicking the [save icon]
    //       that's displayed via EditorMenu.
    const {
      author,
      categories,
      consent,
      description,
      finish,
      status,
      title
    } = this.props;

    const data = {
      author,
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

    switch (response.status) {
      case 200:
        this.props.setScenario(response.scenario);
        notify({ type: 'success', message: 'Scenario saved' });
        break;
      default:
        if (response.error) {
          notify({ type: 'error', message: response.message });
        }
        break;
    }
  }

  getTab(name, scenarioId) {
    const { setActiveView } = this;

    switch (name) {
      case 'scenario':
        return (
          <ScenarioEditor
            scenarioId={scenarioId}
            submitCB={this.getSubmitCallback()}
            postSubmitCB={this.getPostSubmitCallback()}
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
            scenarioId={scenarioId}
          />
        );
      case 'preview':
        return (
          <Scenario
            key={scenarioId}
            setActiveSlide={activeSlideIndex =>
              setActiveView({
                activeSlideIndex,
                activeTab: 'preview'
              })
            }
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

    // TODO: Move to own async action
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
          setActiveView({ activeTab: 'slides', activeSlideIndex: 1 });
        });
      };
    }

    return null;
  }

  render() {
    if (this.props.isCopyScenario) {
      return null;
    }

    if (!this.state.tabs) {
      return null;
    }

    const { scenarioId } = this.state;

    const menuItemScenarioStatus = this.props.status !== undefined && (
      <ScenarioStatusMenuItem
        key="scenario-status-menu-item"
        name="Set scenario status"
        status={this.props.status}
        onClick={this.onClickScenarioAction}
      />
    );

    const menuItemScenarioRun =
      scenarioId !== 'new' ? (
        <Menu.Item
          key="scenario-run-menu-item"
          name="Run this scenario"
          onClick={() => {
            this.props.history.push(`/run/${scenarioId}/slide/0`);
          }}
        >
          <Icon name="play" />
        </Menu.Item>
      ) : null;

    const menuItemsForMenuBar = Object.keys(this.state.tabs).map(tabType => {
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
      <Fragment>
        <Menu attached="top" tabular className="editor__tabmenu">
          {menuItemsForMenuBar}
        </Menu>

        <Segment attached="bottom" className="editor__content-pane">
          {scenarioId !== 'new' && (
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
                    this.deleteScenario(scenarioId);
                  }
                },
                right: [menuItemScenarioRun, menuItemScenarioStatus]
              }}
            />
          )}

          {this.state.tabs[this.state.activeTab]}
        </Segment>
      </Fragment>
    );
  }
}

// Note: this silences the warning about "text={}" receiving
// an object, instead of a string.
Dropdown.propTypes.text = PropTypes.any;

Editor.propTypes = {
  author: PropTypes.object,
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
      activeNonZeroSlideIndex: PropTypes.node,
      activeRunSlideIndex: PropTypes.node,
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

const mapStateToProps = (state, ownProps) => {
  const scenarioId = Number(ownProps.scenarioId);
  const {
    author,
    categories,
    consent,
    description,
    finish,
    status,
    title
  } = state.scenario;
  return {
    scenarioId,
    author,
    categories,
    consent,
    description,
    finish,
    status,
    title
  };
};

const mapDispatchToProps = dispatch => ({
  getScenario: id => dispatch(getScenario(id)),
  setScenario: params => dispatch(setScenario(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
