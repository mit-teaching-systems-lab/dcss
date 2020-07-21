import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Menu,
  Modal,
  Segment
} from '@components/UI';
import Storage from '@utils/Storage';
import EditorMenu from '@components/EditorMenu';
import { notify } from '@components/Notification';
import ScenarioEditor from '@components/ScenarioEditor';
import ScenarioStatusMenuItem from '@components/EditorMenu/ScenarioStatusMenuItem';
import Scenario from '@components/Scenario';
import Username from '@components/User/Username';
// import Review from './Review';
import Slides from './Slides';
import htmlId from '@utils/html-id';
import {
  deleteScenario,
  getScenario,
  setScenario,
  endScenarioLock
} from '@actions/scenario';
import { getUsers } from '@actions/users';
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
    // this.onBeforeUnload = this.onBeforeUnload.bind(this);
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
      isReady: false,
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
    }
  }

  async componentDidMount() {
    if (!this.props.isNewScenario) {
      const scenario = await this.props.getScenario(this.props.scenarioId, {
        lock: true
      });

      const { scenarioUser } = this.props;

      // The viewing user might be a super admin that is not
      // a collaborator on this scenario.
      if (scenarioUser) {
        if (
          scenario.lock.user_id === scenarioUser.id &&
          scenarioUser.is_reviewer
        ) {
          await this.props.endScenarioLock(scenario.id);
        }
      }
    }

    await this.props.getUsers();

    this.setState(state => {
      const { scenarioUser } = this.props;

      return {
        isReady: true,
        activeTab:
          scenarioUser && scenarioUser.is_reviewer ? 'review' : state.activeTab,
        tabs: this.getAllTabs(state.scenarioId)
      };
    });
  }

  onClick(e, { name: activeTab }) {
    this.setState({ activeTab });
    const { scenarioId } = this.state;
    const activeNonZeroSlideIndex = Number(
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
  async deleteScenario(scenario) {
    await this.props.deleteScenario(scenario.id);
    this.props.history.push('/scenarios/');
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
    } = this.props.scenario;

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
        // TODO: Eliminate scenarioId
        return (
          <ScenarioEditor
            scenarioId={scenarioId}
            submitCB={this.getSubmitCallback()}
            postSubmitCB={this.getPostSubmitCallback()}
          />
        );
      case 'slides':
        // TODO: Eliminate scenarioId
        return (
          <Slides
            setActiveSlide={activeSlideIndex =>
              setActiveView({
                activeSlideIndex,
                activeTab: 'slides'
              })
            }
            scenarioId={scenarioId}
            scenario={this.props.scenario}
          />
        );
      case 'preview':
        // TODO: Eliminate scenarioId
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
            scenario={this.props.scenario}
          />
        );
      case 'review':
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
            scenario={this.props.scenario}
          />
        );
      // return (
      //   <Review scenario={this.props.scenario} />
      // );
      default:
        return null;
    }
  }

  getAllTabs() {
    const { scenario, scenarioUser } = this.props;

    switch (scenario.id) {
      case undefined:
        return {
          scenario: this.getTab('scenario', 'new')
        };
      default: {
        const authorTabs = {
          scenario: this.getTab('scenario', scenario.id),
          slides: this.getTab('slides', scenario.id),
          preview: this.getTab('preview', scenario.id)
        };

        const reviewerTabs = {
          review: this.getTab('review', scenario.id)
        };

        return scenarioUser && scenarioUser.is_reviewer
          ? reviewerTabs
          : authorTabs;
      }
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
    const { isReady, scenarioId } = this.state;

    if (this.props.isCopyScenario) {
      return null;
    }

    if (!this.state.tabs) {
      return null;
    }

    if (!isReady) {
      return null;
    }

    const { scenario, scenarioUser, user, usersById } = this.props;

    const menuItemScenarioStatus = scenario.status !== undefined && (
      <ScenarioStatusMenuItem
        key="scenario-status-menu-item"
        name="Set scenario status"
        status={scenario.status}
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

    // const scenarioLockIcon = scenario.lock ? (
    //   <Icon name="unlock" />
    // ) : (
    //   <Icon name="lock" />
    // );

    const menuItemScenarioUnlock =
      scenarioId !== 'new' ? (
        <Menu.Item
          key="scenario-unlock-menu-item"
          name="Unlock this scenario"
          onClick={() => {
            this.props.endScenarioLock(this.props.scenario.id);
          }}
        >
          <Icon name="unlock" />
        </Menu.Item>
      ) : null;

    const menuItemsForAttachedTabularBar = Object.keys(this.state.tabs).map(
      tabType => {
        return (
          <Menu.Item
            key={tabType}
            name={tabType}
            active={this.state.activeTab === tabType}
            onClick={this.onClick}
          />
        );
      }
    );

    let modal = null;

    if (scenarioId !== 'new') {
      const modalProps = {
        open: false
      };
      let header = '';
      let content = '';
      const hasLock = scenario.lock && scenario.lock.user_id !== user.id;

      if (scenarioUser) {
        if (!scenarioUser.is_reviewer && hasLock) {
          modalProps.open = true;

          const lockHolder = usersById[scenario.lock.user_id];
          content = (
            <Fragment>
              This scenario is currently being edited by{' '}
              <Username {...lockHolder} />
            </Fragment>
          );
          setTimeout(() => {
            this.props.history.push('/scenarios/');
          }, 10000);
        }
      } else {
        if (!scenarioUser && !user.is_super) {
          modalProps.open = true;
          content = 'You do not have permission to access this scenario.';
        }
      }

      if (modalProps.open) {
        const ariaLabelledBy = htmlId();
        const ariaDescribedBy = htmlId();
        modal = (
          <Modal.Accessible open={modalProps.open}>
            <Modal
              {...modalProps}
              size="small"
              role="dialog"
              aria-modal="true"
              aria-labelledby={ariaLabelledBy}
              aria-describedby={ariaDescribedBy}
            >
              <Header id={ariaLabelledBy} content={header} icon="lock" />
              <Modal.Content id={ariaDescribedBy}>{content}</Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    as={Link}
                    to={{
                      pathname: '/scenarios/'
                    }}
                    aria-label="Go back"
                    color="green"
                    content="Go back"
                  />
                  {/*
                  <Button.Or />
                  <Button
                    as={Link}
                    to={{
                      pathname: '/scenarios/'
                    }}
                    aria-label="Try again"
                    color="orange"
                    content="Try again"
                  />
                  */}
                </Button.Group>
              </Modal.Actions>
            </Modal>
          </Modal.Accessible>
        );
      }

      menuItemsForAttachedTabularBar.push(
        <Menu.Menu key="menu-menu-item-tabs-right" position="right">
          <Menu.Item className="editor__righttitle">
            {this.props.scenario.title}
          </Menu.Item>
        </Menu.Menu>
      );
    }

    const right = [
      menuItemScenarioRun,
      location.href.includes('localhost') ? menuItemScenarioUnlock : null,
      menuItemScenarioStatus
    ];

    const isNotReviewer = scenarioUser && !scenarioUser.is_reviewer;
    const canDisplayEditorMenu =
      scenarioId !== 'new' && (isNotReviewer || user.is_super);

    return modal ? (
      modal
    ) : (
      <Fragment>
        <Menu attached="top" tabular className="editor__tabmenu">
          {menuItemsForAttachedTabularBar}
        </Menu>

        <Segment attached="bottom" className="editor__content-pane">
          {canDisplayEditorMenu ? (
            <EditorMenu
              className="em__fullwidth"
              type="scenario"
              items={{
                save: {
                  onClick: (...args) => {
                    this.onClickScenarioAction(...args);
                  }
                },
                delete: {
                  onConfirm: () => {
                    this.deleteScenario(scenario);
                  }
                },
                right
              }}
            />
          ) : null}

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
  activeTab: PropTypes.string,
  activeSlideIndex: PropTypes.number,
  scenarioId: PropTypes.node,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
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
  endScenarioLock: PropTypes.func.isRequired,
  deleteScenario: PropTypes.func.isRequired,
  getScenario: PropTypes.func.isRequired,
  setScenario: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  scenarioUser: PropTypes.object,
  user: PropTypes.object,
  usersById: PropTypes.object,
  getUsers: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const scenarioId = Number(ownProps.scenarioId);
  const { scenario, user, usersById } = state;
  const scenarioUser = scenario.users.find(u => u.id === user.id);
  return {
    scenario,
    scenarioId,
    scenarioUser,
    user,
    usersById
  };
};

const mapDispatchToProps = dispatch => ({
  endScenarioLock: id => dispatch(endScenarioLock(id)),
  deleteScenario: id => dispatch(deleteScenario(id)),
  getScenario: (id, options = {}) => dispatch(getScenario(id, options)),
  setScenario: params => dispatch(setScenario(params)),
  getUsers: () => dispatch(getUsers())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Editor)
);
