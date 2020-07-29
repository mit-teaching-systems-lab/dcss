import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Menu, Segment, Title } from '@components/UI';
import copy from 'copy-text-to-clipboard';
import Storage from '@utils/Storage';
import { getCohort, setCohort, linkUserToCohort } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import { getUsers } from '@actions/users';
import DataTable from './DataTable';
import CohortParticipants from './CohortParticipants';
import CohortScenarios from './CohortScenarios';
import { notify } from '@components/Notification';
import Loading from '@components/Loading';

import './Cohort.css';

export class Cohort extends React.Component {
  constructor(props) {
    super(props);

    const { cohort, location } = this.props;

    if (location && location.search) {
      Storage.set('app/referrer_params', location.search);
    }

    this.sessionKey = `cohort/${cohort.id}`;

    const { activeTabKey, tabs } = Storage.get(this.sessionKey, {
      activeTabKey: 'cohort',
      tabs: []
    });

    this.state = {
      isReady: false,
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
      if (!this.props.cohort.created_at) {
        await this.props.getCohort(this.props.cohort.id);
      }

      await this.props.getScenarios();
      // Not sure this is necessary?
      await this.props.getUsers();

      const { cohort, user } = this.props;

      if (cohort.id === null) {
        this.props.history.push('/cohorts');
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

  onClick(event, { source, type }) {
    let { activeTabKey } = this.state;
    const { tabs } = this.state;
    const { cohort } = this.props;
    const isScenario = type === 'scenario';
    const icon = isScenario ? 'content' : 'user outline';
    const key = `cohort-${cohort.id}-${type}-${source.id}`;
    const tab = tabs.find(tab => tab.menuItem.key === key);
    const content = source[isScenario ? 'title' : 'username'];

    // const display = source[isScenario ? 'title' : 'username'];
    // const content = (
    //   <>
    //     {display}
    //     <Button
    //       circular
    //       icon="close"
    //       floated="right"
    //       size="mini"
    //       style={{ fontSize: '0.75em', marginLeft: '1rem' }}
    //     />
    //   </>
    // );

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
    const {
      authority,
      cohort,
      cohort: { id, name },
      user
    } = this.props;
    const { isReady, activeTabKey, tabs } = this.state;
    const { onClick, onTabClick, onDataTableClick } = this;

    if (!isReady) {
      return <Loading />;
    }

    const url = `${location.origin}/cohort/${cohort.id}`;
    const onCohortUrlCopyClick = () => {
      copy(url);
      notify({
        message: `Copied: ${url}`
      });
    };
    const source = tabs.find(tab => tab.menuItem.key === activeTabKey);

    // console.log(authority);
    const { isFacilitator } = authority;

    // Everytime there is a render, save the state.
    Storage.set(this.sessionKey, { activeTabKey, tabs });

    const menuItemCopyUrl = (
      <Menu.Item.Tabbable
        key="menu-item-account-administration"
        onClick={onCohortUrlCopyClick}
      >
        <Icon.Group className="em__icon-group-margin">
          <Icon name="clipboard outline" />
        </Icon.Group>
        Copy cohort link to clipboard
      </Menu.Item.Tabbable>
    );

    return (
      <div>
        <Title content={cohort.name} />
        <Menu attached="top" tabular className="c__tab-menu--overflow">
          <Menu.Item.Tabbable
            active={activeTabKey === 'cohort'}
            content={name}
            key="cohort"
            name="cohort"
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
            <Menu icon borderless>
              {menuItemCopyUrl}
              {/*
                <Popup
                    content="Run this cohort as a participant"
                    trigger={
                        <Menu.Item.Tabbable
                            icon
                            content={<Icon name="play" />}
                            onClick={() => {
                                alert(
                                    'View cohort as participant. (Feature not available in this version)'
                                );
                            }}
                        />
                    }
                />
                <Popup
                    content="Download the data from this data table tab"
                    trigger={
                        <Menu.Item.Tabbable
                            icon
                            content={<Icon name="download" />}
                            onClick={() => {
                                alert(
                                    'Download all data from this cohort. (Feature not available in this version)'
                                );
                            }}
                        />
                    }
                />
            */}
            </Menu>
            <CohortScenarios
              key="cohort-scenarios"
              id={id}
              authority={authority}
              onClick={onClick}
            />
            {isFacilitator ? (
              <CohortParticipants
                key="cohort-participants"
                id={id}
                authority={authority}
                onClick={onClick}
              />
            ) : null}
            {!isFacilitator ? (
              <DataTable
                source={{
                  cohortId: id,
                  participantId: user.id
                }}
                onClick={onDataTableClick}
              />
            ) : null}
          </Segment>
        ) : (
          <Segment key={activeTabKey} attached="bottom">
            <DataTable
              source={source && source.data}
              onClick={onDataTableClick}
            />
          </Segment>
        )}
      </div>
    );
  }
}

Cohort.propTypes = {
  activeTabKey: PropTypes.string,
  authority: PropTypes.object,
  scenarios: PropTypes.array,
  runs: PropTypes.array,
  users: PropTypes.array,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    created_at: PropTypes.string,
    name: PropTypes.string,
    // roles: PropTypes.array,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array,
    usersById: PropTypes.object
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.any,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  }),
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  onChange: PropTypes.func,
  getCohort: PropTypes.func,
  setCohort: PropTypes.func,
  linkUserToCohort: PropTypes.func,
  getScenarios: PropTypes.func,
  getUser: PropTypes.func,
  user: PropTypes.object,
  getUsers: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const id = Number(ownProps.match.params.id);
  const { permissions } = state.login;
  const { cohortsById, scenarios, user } = state;
  const cohort = cohortsById[id] || { ...state.cohort, id };

  const cohortUser = cohort.users.find(
    cohortMember => cohortMember.id === user.id
  );
  const authority = {
    isOwner: (cohortUser && cohortUser.roles.includes('owner')) || false,
    isFacilitator:
      (cohortUser && cohortUser.roles.includes('facilitator')) || false,
    isResearcher:
      (cohortUser && cohortUser.roles.includes('researcher')) || false,
    isParticipant:
      (cohortUser && cohortUser.roles.includes('participant')) || false
  };

  // Super admins have unrestricted access to cohorts

  if (user.is_super) {
    authority.isOwner = true;
    authority.isFacilitator = true;
    authority.isResearcher = true;
    authority.isParticipant = true;
  }

  return { authority, cohort, scenarios, user: { ...user, permissions } };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getScenarios: () => dispatch(getScenarios()),
  setCohort: params => dispatch(setCohort(params)),
  linkUserToCohort: (...params) => dispatch(linkUserToCohort(...params)),
  getUser: () => dispatch(getUser()),
  getUsers: () => dispatch(getUsers())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohort)
);
