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
import {
  copyCohort,
  getCohort,
  linkUserToCohort,
  setCohort
} from '@actions/cohort';
import { getUser } from '@actions/user';
import { getUsers } from '@actions/users';
import DataTable from '@components/Cohorts/DataTable';
import CohortProgress from '@components/Cohorts/CohortProgress';
import CohortRename from '@components/Cohorts/CohortRename';
import CohortScenarios from '@components/Cohorts/CohortScenarios';
import { notify } from '@components/Notification';
import Loading from '@components/Loading';
import Boundary from '@components/Boundary';
import Identity from '@utils/Identity';

import './Cohort.css';

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
      archiveIsOpen: false,
      copyIsOpen: false,
      deleteIsOpen: false,
      renameIsOpen: false,
      activeTabKey,
      tabs
    };

    this.onClick = this.onClick.bind(this);
    this.onDataTableClick = this.onDataTableClick.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      if (!this.props.cohort || !this.props.cohort.id) {
        await this.props.getCohort(this.props.id);
      }

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

      const notInCohort =
        cohort.users.find(({ id }) => id === user.id) === undefined;

      if (notInCohort) {
        // For now we'll default all unknown
        // users as "participant".
        await this.props.linkUserToCohort(cohort.id, 'participant');
      }

      this.setState({
        isReady: true
      });
    }
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
    const {
      isReady,
      activeTabKey,
      tabs,
      copyIsOpen,
      renameIsOpen,
      deleteIsOpen,
      archiveIsOpen
    } = this.state;
    const { onClick, onTabClick, onDataTableClick } = this;

    if (!isReady) {
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

    const menuItemShowCohortUrl = (
      <Input label="Cohort link" size="big" type="text" defaultValue={url} />
    );

    const menuItemCopyCohortUrl = (
      <Button size="small" onClick={onCohortUrlCopyClick}>
        <Icon name="clipboard outline" className="primary" />
        Copy cohort link to clipboard
      </Button>
    );

    const cohortActivationState = (
      <p className="c__activation-state">
        Cohort is <span>{cohort.is_archived ? 'Archived' : 'Active'}</span>
      </p>
    );

    const cohortUserActions = (
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
              onClick={() => this.setState({ archiveIsOpen: true })}
            />
          ) : null}
          <Dropdown.Item
            text="Rename cohort"
            icon="edit outline"
            className="icon-primary"
            onClick={() => this.setState({ renameIsOpen: true })}
          />
          <Dropdown.Item
            text="Copy cohort"
            icon="copy outline"
            className="icon-primary"
            onClick={() => this.setState({ copyIsOpen: true })}
          />
          <Dropdown.Item
            text="Delete cohort"
            icon="trash alternate outline"
            className="icon-primary"
            onClick={() => this.setState({ deleteIsOpen: true })}
          />
        </Dropdown.Menu>
      </Dropdown>
    );

    const copyDeleteOrArchiveIsOpen =
      copyIsOpen || deleteIsOpen || archiveIsOpen;
    const cohortActionKind = copyIsOpen
      ? 'Copy'
      : deleteIsOpen
      ? 'Delete'
      : 'Archive';
    const copyDeleteOrArchiveModalHeader = `${cohortActionKind} "${cohort.name}"`;
    const copyDeleteOrArchiveAction = cohortActionKind.toLowerCase();
    const onCopyDeleteOrArchiveClose = () => {
      this.setState({
        [`${copyDeleteOrArchiveAction}IsOpen`]: false
      });
    };

    const onDeleteOrArchiveConfirm = async () => {
      const isArchive = copyDeleteOrArchiveAction === 'archive';
      const isCopy = copyDeleteOrArchiveAction === 'copy';
      const isDelete = copyDeleteOrArchiveAction === 'delete';
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
          onCopyDeleteOrArchiveClose();
        }
      }

      if (isCopy) {
        const { id } = await this.props.copyCohort(this.props.cohort.id);

        location.href = `/cohort/${Identity.toHash(id)}`;
      }
    };

    return (
      <div>
        <Title content={cohort.name} />
        <Menu attached="top" tabular className="c__tab-menu--overflow">
          <Menu.Item.Tabbable
            key="cohort"
            name="cohort"
            active={activeTabKey === 'cohort'}
            content={cohort.name}
            onClick={onTabClick}
          />

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
            {isFacilitator ? (
              <section className="c__section c__cohort-header">
                <div className="c__cohort-url">
                  {menuItemShowCohortUrl} {menuItemCopyCohortUrl}
                </div>
                <div className="c__cohort-user-actions">
                  {cohortActivationState}
                  {cohortUserActions}
                </div>
              </section>
            ) : null}
            <section className="c__section">
              <Header as="h2">Cohort scenarios</Header>
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
                  <Header as="h2">Cohort progress</Header>
                  <Header as="h3">
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

        {renameIsOpen ? (
          <CohortRename
            onClose={() => this.setState({ renameIsOpen: false })}
          />
        ) : null}

        {copyDeleteOrArchiveIsOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onCopyDeleteOrArchiveClose}
            >
              <Header icon="group" content={copyDeleteOrArchiveModalHeader} />
              <Modal.Content>
                <Text>
                  Are you sure you want to {copyDeleteOrArchiveAction} &quot;
                  {cohort.name}&quot;?
                </Text>
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    primary
                    aria-label="Yes"
                    onClick={onDeleteOrArchiveConfirm}
                  >
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onCopyDeleteOrArchiveClose}>
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
  copyCohort: PropTypes.func,
  cohort: PropTypes.shape({
    id: PropTypes.node,
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
  getCohort: PropTypes.func,
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
  runs: PropTypes.array,
  users: PropTypes.array,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const id = Identity.fromHashOrId(ownProps.match.params.id || ownProps.id);
  const { cohort, user } = state;
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

  return { authority, cohort, id, user };
};

const mapDispatchToProps = dispatch => ({
  copyCohort: id => dispatch(copyCohort(id)),
  getCohort: id => dispatch(getCohort(id)),
  setCohort: (id, params) => dispatch(setCohort(id, params)),
  getUser: () => dispatch(getUser()),
  getUsers: () => dispatch(getUsers()),
  linkUserToCohort: (...params) => dispatch(linkUserToCohort(...params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohort)
);
