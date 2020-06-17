import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon, Menu, Popup, Segment } from 'semantic-ui-react';
import copy from 'copy-text-to-clipboard';
import Storage from '@utils/Storage';
import { getCohort, setCohort, setCohortUserRole } from '@actions/cohort';
import { getScenarios } from '@actions/scenario';
import { getUser } from '@actions/user';
import DataTable from './DataTable';
import CohortParticipants from './CohortParticipants';
import CohortScenarios from './CohortScenarios';
import Loading from '@components/Loading';
import './Cohort.css';

export class Cohort extends React.Component {
  constructor(props) {
    super(props);

    const { location, match } = this.props;

    let {
      params: { id }
    } = match;

    if (!id && this.props.id) {
      id = this.props.id;
    }

    if (location && location.search) {
      Storage.set('app/referrer_params', location.search);
    }

    this.sessionKey = `cohort/${id}`;

    const { activeTabKey, tabs } = Storage.get(this.sessionKey, {
      activeTabKey: 'cohort',
      tabs: []
    });

    this.state = {
      isReady: false,
      activeTabKey,
      cohort: {
        id
      },
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
      const cohortId = Number(this.state.cohort.id);

      await this.props.getCohort(cohortId);
      await this.props.getScenarios();

      const { cohort, user } = this.props;

      const notInCohort = !!cohort.users.find(({ id }) => id === user.id);

      if (notInCohort) {
        // For now we'll default all unknown
        // users as "participant".
        await this.props.setCohortUserRole({
          id: cohortId,
          role: 'participant'
        });
      }

      this.setState({
        isReady: true
      });
    }
  }

  onClick(event, { source, type }) {
    let { activeTabKey } = this.state;
    const {
      cohort,
      cohort: { id },
      tabs
    } = this.state;
    const isScenario = type === 'scenario';
    const icon = isScenario ? 'content' : 'user outline';
    const key = `cohort-${id}-${type}-${source.id}`;
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
      cohort,
      cohort: { id, name },
      user
    } = this.props;
    const { isReady, activeTabKey, tabs } = this.state;
    const { onClick, onTabClick, onDataTableClick } = this;

    if (!isReady) {
      return <Loading />;
    }

    const cohortUrl = `${location.origin}/cohort/${cohort.id}`;
    const source = tabs.find(tab => tab.menuItem.key === activeTabKey);

    // Everytime there is a render, save the state.
    Storage.set(this.sessionKey, { activeTabKey, tabs });

    const { isOwner, isParticipant } = user;

    return (
      <div>
        <Menu attached="top" tabular className="cohort__tab-menu--overflow">
          <Menu.Item
            active={activeTabKey === 'cohort'}
            content={name}
            key="cohort"
            name="cohort"
            onClick={onTabClick}
          />

          {tabs.map(({ menuItem }) => {
            const { content, key, icon } = menuItem;
            return (
              <Menu.Item
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
              <Popup
                content="Copy cohort link to clipboard"
                trigger={
                  <Menu.Item
                    key="menu-item-account-administration"
                    className="em__icon-padding"
                    onClick={() => copy(cohortUrl)}
                  >
                    <Icon.Group className="em__icon-group-margin">
                      <Icon name="clipboard outline" />
                    </Icon.Group>
                    {cohortUrl}
                  </Menu.Item>
                }
              />
              {/*
                <Popup
                    content="Run this cohort as a participant"
                    trigger={
                        <Menu.Item
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
                        <Menu.Item
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
              isOwner={isOwner}
              isParticipant={isParticipant}
              onClick={onClick}
            />
            {isOwner ? (
              <CohortParticipants
                key="cohort-participants"
                id={id}
                isAuthorized={isOwner}
                onClick={onClick}
              />
            ) : null}
            {isParticipant ? (
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
  scenarios: PropTypes.array,
  runs: PropTypes.array,
  users: PropTypes.array,
  cohort: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    role: PropTypes.string,
    runs: PropTypes.array,
    scenarios: PropTypes.array,
    users: PropTypes.array
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
  setCohortUserRole: PropTypes.func,
  getScenarios: PropTypes.func,
  getUser: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { permissions } = state.login;
  const { cohort, scenarios, user } = state;
  const cohortUser = cohort.users.find(
    cohortMember => cohortMember.id === user.id
  );
  const authority = {
    isOwner: cohortUser && cohortUser.role === 'owner',
    isParticipant: cohortUser && cohortUser.role === 'participant'
  };
  // Super admins have access as an owner even if they are not in the cohort!
  if (user.roles.includes('super_admin')) {
    authority.isSuper = true;
    authority.isOwner = true;
    authority.isParticipant = false;
  }

  return { cohort, scenarios, user: { ...user, ...authority, permissions } };
};

const mapDispatchToProps = dispatch => ({
  getCohort: id => dispatch(getCohort(id)),
  getScenarios: () => dispatch(getScenarios()),
  setCohort: params => dispatch(setCohort(params)),
  setCohortUserRole: params => dispatch(setCohortUserRole(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohort)
);
