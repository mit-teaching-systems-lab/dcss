import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Input,
  Menu,
  Modal,
  Segment,
  Text,
  Title
} from '@components/UI';
import copy from 'copy-text-to-clipboard';
import Storage from '@utils/Storage';
import { getChatsByCohortId } from '@actions/chat';
import {
  copyCohort,
  getCohort,
  getCohortScenarios,
  linkUserToCohort,
  setCohort
} from '@actions/cohort';
import { getUser } from '@actions/user';
import { getUsers } from '@actions/users';
// import Chat from '@components/Chat';
import DataTable from '@components/Cohorts/DataTable';
import CohortProgress from '@components/Cohorts/CohortProgress';
import CohortRename from '@components/Cohorts/CohortRename';
import CohortScenarios from '@components/Cohorts/CohortScenarios';
import { notify } from '@components/Notification';
import Loading from '@components/Loading';
import Boundary from '@components/Boundary';
import Identity from '@utils/Identity';

import './Cohort.css';

// const minAriaLabel = 'Click to minimize the group discussion window';
// const maxAriaLabel = 'Click to maximize the group discussion window';

export class Cohort extends React.Component {
  constructor(props) {
    super(props);

    const { id, location } = this.props;

    if (location && location.search) {
      Storage.set('app/referrer_params', location.search);
    }

    this.storageKey = `cohort/${id}`;

    const { activeTabKey, tabs } = Storage.get(this.storageKey, {
      activeTabKey: 'cohort',
      tabs: []
    });

    this.state = {
      isReady: false,
      archive: {
        isOpen: false
      },
      chat: {
        isMinimized: false
      },
      copy: {
        isOpen: false
      },
      delete: {
        isOpen: false
      },
      rename: {
        isOpen: false
      },
      activeTabKey,
      tabs
    };

    this.onClick = this.onClick.bind(this);
    this.onDataTableClick = this.onDataTableClick.bind(this);
    this.onTabClick = this.onTabClick.bind(this);

    this.hasUnmounted = false;
    this.interval = null;
  }

  async fetchCohort() {
    if (this.hasUnmounted) {
      return;
    }

    await this.props.getCohort(this.props.id);

    const hasScenariosLoaded = this.props.cohort.scenarios.every(
      id => this.props.scenariosById[id]
    );

    if (!hasScenariosLoaded) {
      await this.props.getCohortScenarios(this.props.id);
      await this.props.getChatsByCohortId(this.props.id);
    }

    /* istanbul ignore else */
    if (!this.state.isReady) {
      this.setState({
        isReady: true
      });
    }
  }

  refresh() {
    this.interval = setInterval(async () => {
      /* istanbul ignore else */
      if (!this.state.search && document.visibilityState === 'visible') {
        await this.fetchCohort();
      }
    }, 5000);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      await this.props.getCohort(
        this.props.id || (this.props.cohort && this.props.cohort.id)
      );

      const { authority, cohort, user } = this.props;

      // If this participant is not a super admin user, and the cohort
      // has been deleted, then send the participant to the
      // main cohorts view.
      if (!user.is_super && cohort.deleted_at) {
        this.props.history.push('/cohorts');
        return;
      }

      if (authority.isFacilitator) {
        await this.props.getUsers();
      }

      // This requests the chats that are created by and for participants
      await this.props.getChatsByCohortId(cohort.id);

      const notInCohort =
        cohort.users.find(({ id }) => id === user.id) === undefined;

      if (notInCohort) {
        // For now we'll default all unknown
        // users as "participant".
        await this.props.linkUserToCohort(cohort.id, 'participant');
      }

      await this.fetchCohort();
      this.refresh();
    }
  }

  componentWillUnmount() {
    this.hasUnmounted = true;
    clearInterval(this.interval);
  }

  onClick(event, props = {}) {
    const { source = { id: null }, type = 'scenario' } = props;
    let { activeTabKey } = this.state;
    const { tabs } = this.state;
    const { cohort } = this.props;
    const isScenario = type === 'scenario';
    const icon = isScenario ? 'content' : 'user outline';
    const key = `cohort-${cohort.id}-${type}-${source.id}`;
    const tab = tabs.find(tab => tab.menuItem.key === key);
    const content = source[isScenario ? 'title' : 'username'];

    if (!tab) {
      tabs.push({
        menuItem: {
          content,
          key,
          icon
        },
        data: {
          cohortId: cohort.id,
          [`${type}Id`]: source.id
        }
      });
      activeTabKey = key;
    } else {
      activeTabKey = tab.menuItem.key;
    }

    this.setState({
      activeTabKey,
      tabs
    });
  }

  onTabClick(event, { name: activeTabKey }) {
    this.setState({ activeTabKey });
  }

  onDataTableClick(event, { name, key }) {
    const { tabs } = this.state;

    // If the button name was "close"...
    if (name === 'close') {
      // Move to the main cohort tab
      this.setState({ activeTabKey: 'cohort' });

      // Remove the tab from the tabs list
      tabs.splice(tabs.indexOf(tabs.find(tab => tab.menuItem.key === key)), 1);
      this.setState({ tabs });
    }
  }

  render() {
    const { authority, cohort, user } = this.props;
    const { isReady, activeTabKey, tabs } = this.state;
    const { onClick, onTabClick, onDataTableClick } = this;

    if (!isReady || !cohort) {
      return <Loading />;
    }

    const url = `${location.origin}/cohort/${Identity.toHash(cohort.id)}`;
    const onCohortUrlCopyClick = () => {
      copy(url);
      notify({
        message: url,
        title: 'Copied',
        icon: 'linkify'
      });
    };
    const source = tabs.find(tab => tab.menuItem.key === activeTabKey);
    const { isFacilitator } = authority;

    // Everytime there is a render, save the state.
    Storage.set(this.storageKey, { activeTabKey, tabs });

    const menuItemCopyCohortUrl = (
      <Button onClick={onCohortUrlCopyClick}>
        <Icon name="clipboard outline" className="primary" />
        Copy cohort link to clipboard
      </Button>
    );

    const menuItemShowCohortUrl = (
      <Input
        type="text"
        labelPosition="right"
        label={menuItemCopyCohortUrl}
        defaultValue={url}
      />
    );

    const cohortTools = (
      <Dropdown
        text="Cohort tools"
        icon="setting"
        labeled
        button
        className="icon icon-primary"
      >
        <Dropdown.Menu direction="left">
          {!cohort.is_archived ? (
            <Dropdown.Item
              text="Archive cohort"
              icon="archive"
              className="icon-primary"
              onClick={() => this.setState({ archive: { isOpen: true } })}
            />
          ) : null}
          <Dropdown.Item
            text="Rename cohort"
            icon="edit outline"
            className="icon-primary"
            onClick={() => this.setState({ rename: { isOpen: true } })}
          />
          <Dropdown.Item
            text="Copy cohort"
            icon="copy outline"
            className="icon-primary"
            onClick={() => this.setState({ copy: { isOpen: true } })}
          />
          <Dropdown.Item
            text="Delete cohort"
            icon="trash alternate outline"
            className="icon-primary"
            onClick={() => this.setState({ delete: { isOpen: true } })}
          />
        </Dropdown.Menu>
      </Dropdown>
    );

    const cohortToolsActionIsOpen =
      this.state.copy.isOpen ||
      this.state.delete.isOpen ||
      this.state.archive.isOpen;
    const cohortActionKind = this.state.copy.isOpen
      ? 'Copy'
      : this.state.delete.isOpen
      ? 'Delete'
      : 'Archive';
    const cohortToolsActionModalHeader = `${cohortActionKind} "${cohort.name}"`;
    const cohortToolsActionAction = cohortActionKind.toLowerCase();
    const onCohortToolActionClose = () => {
      this.setState({
        [cohortToolsActionAction]: {
          isOpen: false
        }
      });
    };

    const onCohortToolActionConfirm = async () => {
      const isArchive = cohortToolsActionAction === 'archive';
      const isCopy = cohortToolsActionAction === 'copy';
      const isDelete = cohortToolsActionAction === 'delete';
      const prop = isArchive ? 'is_archived' : 'deleted_at';
      const value = isArchive ? true : new Date().toISOString();

      if (isArchive || isDelete) {
        await this.props.setCohort(this.props.cohort.id, {
          [prop]: value
        });

        if (!isArchive) {
          // Hard location change to force state purge
          location.href = '/cohorts';
        } else {
          onCohortToolActionClose();
        }
      }

      if (isCopy) {
        const { id } = await this.props.copyCohort(this.props.cohort.id);

        location.href = `/cohort/${Identity.toHash(id)}`;
      }
    };

    // <Menu.Item.Tabbable
    //   key="chat"
    //   name="chat"
    // >
    //   <Chat chat={this.props.cohort.chat} />
    // </Menu.Item.Tabbable>
    // {!cohort.is_archived ? (
    //   <Chat chat={this.props.cohort.chat} />
    // ) : null}
    // {isFacilitator ? cohortTools : null}

    /*

    // THIS FEATURE IS CURRENTLY DISABLED

    const chatMinMaxAriaLabel = this.state.chatIsMinimized
      ? maxAriaLabel
      : minAriaLabel;

    const chatMinMaxIcon = 'discussion';

    const chatMinMaxTriggerProps = {
      'aria-label': chatMinMaxAriaLabel,
      icon: chatMinMaxIcon,
      content: 'Group discussion'
    };

    const chatMinMaxTrigger = <Button {...chatMinMaxTriggerProps} />;
    const groupChat = (
      <Chat
        chat={this.props.cohort.chat}
        onMinMaxChange={({ isMinimized }) => {
          this.setState({
            chat: {
              isMinimized
            }
          });
        }}
      />
    );
    */
    /*
      This will be used when cohort-wide chat is enabled.
    (
      <section className="c__section c__cohort-header">
        <div className="c__cohort-header-left">

        </div>
        <div className="c__cohort-header-right">
          {groupChat}
        </div>
      </section>
    )};
    */

    return (
      <div>
        <Title content={cohort.name} />
        <Menu attached="top" tabular className="c__tab-menu--overflow">
          <Menu.Item.Tabbable
            key="cohort"
            name="cohort"
            active={activeTabKey === 'cohort'}
            onClick={onTabClick}
          >
            <Icon className="chalkboard teacher primary" />
          </Menu.Item.Tabbable>

          {tabs.map(({ menuItem }) => {
            const { content, key, icon } = menuItem;
            return (
              <Menu.Item.Tabbable
                active={activeTabKey === key}
                content={content}
                key={key}
                name={key}
                icon={icon}
                onClick={onTabClick}
              />
            );
          })}
        </Menu>

        {activeTabKey === 'cohort' ? (
          <Segment attached="bottom">
            <section className="c__section c__cohort-header">
              <div className="c__cohort-header-left">
                <Header as="h1">{cohort.name}</Header>
              </div>
              <div className="c__cohort-header-right c__activation-state">
                Cohort is{' '}
                <span>{cohort.is_archived ? 'Archived' : 'Active'}</span>
              </div>
            </section>

            {isFacilitator ? (
              <section className="c__section c__cohort-header">
                <div className="c__cohort-header-left">
                  {menuItemShowCohortUrl}
                </div>
                <div className="c__cohort-header-right">
                  {/* this is causing issues, so is disabled for now */}
                  {/* groupChat */}
                  {cohortTools}
                </div>
              </section>
            ) : null}

            <section className="c__section">
              {/*<Header as="h3">Cohort scenarios</Header>*/}
              <CohortScenarios
                key="cohort-scenarios"
                id={cohort.id}
                authority={authority}
                onClick={onClick}
              />
            </section>
            {isFacilitator ? (
              <Fragment>
                <section className="c__section">
                  {/*<Header as="h3">Cohort progress</Header>*/}
                  <Header as="h4">
                    Track participant progress and responses to selected
                    scenarios
                  </Header>
                  <CohortProgress
                    key="cohort-progress"
                    id={cohort.id}
                    authority={authority}
                    onClick={onClick}
                  />
                </section>
              </Fragment>
            ) : (
              <DataTable
                source={{
                  cohortId: cohort.id,
                  participantId: user.id
                }}
                onClick={onDataTableClick}
              />
            )}
          </Segment>
        ) : (
          <Segment attached="bottom" key={activeTabKey}>
            <DataTable
              source={source && source.data}
              onClick={onDataTableClick}
            />
          </Segment>
        )}

        {this.state.rename.isOpen ? (
          <CohortRename
            onClose={() => this.setState({ rename: { isOpen: false } })}
          />
        ) : null}

        {cohortToolsActionIsOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onCohortToolActionClose}
            >
              <Header icon="group" content={cohortToolsActionModalHeader} />
              <Modal.Content>
                <Text>
                  Are you sure you want to {cohortToolsActionAction} &quot;
                  {cohort.name}&quot;?
                </Text>
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    primary
                    aria-label="Yes"
                    onClick={onCohortToolActionConfirm}
                  >
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onCohortToolActionClose}>
                    No
                  </Button>
                </Button.Group>
              </Modal.Actions>
              <div data-testid="cohort-rename" />
            </Modal>
          </Modal.Accessible>
        ) : null}

        <Boundary bottom data-testid="cohort-boundary-bottom" />
      </div>
    );
  }
}

Cohort.propTypes = {
  activeTabKey: PropTypes.string,
  authority: PropTypes.object,
  chats: PropTypes.array,
  copyCohort: PropTypes.func,
  cohort: PropTypes.shape({
    id: PropTypes.node,
    chat: PropTypes.object,
    created_at: PropTypes.string,
    deleted_at: PropTypes.string,
    updated_at: PropTypes.string,
    is_archived: PropTypes.bool,
    name: PropTypes.string,
    // roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array,
    usersById: PropTypes.object
  }),
  getChatsByCohortId: PropTypes.func,
  getCohort: PropTypes.func,
  getCohortScenarios: PropTypes.func,
  getUser: PropTypes.func,
  getUsers: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.node,
  linkUserToCohort: PropTypes.func,
  location: PropTypes.shape({
    search: PropTypes.string
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onChange: PropTypes.func,
  setCohort: PropTypes.func,
  scenariosById: PropTypes.object,
  runs: PropTypes.array,
  users: PropTypes.array,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const id = Identity.fromHashOrId(ownProps.match.params.id || ownProps.id);
  const { chats, scenariosById, user } = state;

  const cohort = state.cohort && state.cohort.id === id ? state.cohort : null;

  const participant = cohort
    ? cohort.users.find(participant => participant.id === user.id)
    : null;

  const roles = participant ? participant.roles : [];

  const authority = {
    isOwner: roles.includes('owner') || false,
    isFacilitator: roles.includes('facilitator') || false,
    isResearcher: roles.includes('researcher') || false,
    isParticipant: roles.includes('participant') || false
  };

  // Super admins have unrestricted access to cohorts
  if (user.is_super) {
    authority.isOwner = true;
    authority.isFacilitator = true;
    authority.isResearcher = true;
    authority.isParticipant = true;
  }

  return { authority, chats, cohort, id, scenariosById, user };
};

const mapDispatchToProps = dispatch => ({
  copyCohort: id => dispatch(copyCohort(id)),
  getCohort: id => dispatch(getCohort(id)),
  getCohortScenarios: id => dispatch(getCohortScenarios(id)),
  setCohort: (id, params) => dispatch(setCohort(id, params)),
  getUser: () => dispatch(getUser()),
  getUsers: () => dispatch(getUsers()),
  linkUserToCohort: (...params) => dispatch(linkUserToCohort(...params)),
  getChatsByCohortId: id => dispatch(getChatsByCohortId(id))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohort)
);
