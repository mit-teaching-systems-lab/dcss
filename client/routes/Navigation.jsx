import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Button, Dropdown, Icon, Menu, Popup } from '@components/UI';
import { endScenarioLock } from '@actions/scenario';
import ConfirmAuth from '@components/ConfirmAuth';
import UserMenu from '@components/User/UserMenu';

const DCSS_BRAND_LABEL = process.env.DCSS_BRAND_LABEL || 'Teaching Systems Lab';

const MOBILE_WIDTH = 767;
const restrictedNav = [
  {
    text: 'History',
    path: '/history'
  },
  {
    text: 'Cohorts',
    path: '/cohorts',
    permission: 'view_own_cohorts'
  },
  {
    text: 'Downloads',
    path: '/downloads',
    permission: 'view_all_run_data'
  },
  {
    text: 'Admin',
    path: '/admin',
    permission: 'edit_permissions'
  }
];

class Navigation extends Component {
  constructor(props) {
    super(props);
    const isMenuOpen = window.innerWidth > MOBILE_WIDTH;
    this.state = {
      isMenuOpen
    };
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    const { isMenuOpen } = this.state;

    if (window.innerWidth > MOBILE_WIDTH && !isMenuOpen) {
      this.setState({ isMenuOpen: true });
    }
  }

  onBeforeUnload() {
    const { lock } = this.props.scenario;

    if (lock && lock.user_id === this.props.user.id) {
      this.props.endScenarioLock(this.props.scenario.id);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('beforeunload', this.onBeforeUnload);

    this.props.history.listen(({ pathname }) => {
      if (!pathname.startsWith('/editor/')) {
        this.onBeforeUnload();
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  render() {
    const { isMenuOpen } = this.state;

    const { isLoggedIn, user } = this.props;

    const navLinkToAuthorized = restrictedNav.map(
      ({ text, path, permission }, index) => {
        const menuItem = (
          <Menu.Item key={`menu-item-nav-${index}`} to={path} as={NavLink}>
            {text}
          </Menu.Item>
        );
        return permission ? (
          <ConfirmAuth
            key={`confirmed-menu-item-nav-${index}`}
            requiredPermission={permission}
          >
            {menuItem}
          </ConfirmAuth>
        ) : (
          menuItem
        );
      }
    );

    const explainAllScenarios = 'See all scenarios';
    // This is used as the dropdown trigger, in the top menu
    const navLinkToScenarios = (
      <Menu.Item
        role="option"
        to="/scenarios/"
        aria-label={explainAllScenarios}
        as={NavLink}
      >
        Scenarios
      </Menu.Item>
    );
    // This is used WITHIN the dropdown menu
    const navLinkToAllScenarios = (
      <Menu.Item
        role="option"
        to="/scenarios/"
        aria-label={explainAllScenarios}
        as={NavLink}
      >
        All
      </Menu.Item>
    );

    // to={`/scenarios/author/${user.username}`}
    const explainMyScenarios = 'See scenarios where I am an owner, author or reviewer';
    const navLinkToMyScenarios = isLoggedIn ? (
      <Menu.Item
        role="option"
        to="/scenarios/mine"
        aria-label={explainMyScenarios}
        as={NavLink}
      >
        Mine
      </Menu.Item>
    ) : null;

    const explainOfficialScenarios = `See scenarios made by ${DCSS_BRAND_LABEL}`;
    const navLinkToOfficialScenarios = (
      <Menu.Item
        role="option"
        to="/scenarios/official"
        aria-label={explainOfficialScenarios}
        as={NavLink}
      >
        Official
      </Menu.Item>
    );

    const explainCommunityScenarios = 'See scenarios made by the community';
    const navLinkToCommunityScenarios = (
      <Menu.Item
        role="option"
        to="/scenarios/community"
        aria-label={explainCommunityScenarios}
        as={NavLink}
      >
        Community
      </Menu.Item>
    );





    //<NavLink to="/scenarios/">Scenarios</NavLink>;
    return (
      <Fragment>
        <Button
          icon
          fluid
          basic
          labelPosition="left"
          className="nav__mobile"
          id="nav__mobile--button"
          aria-controls="nav"
          onClick={() => this.setState({ isMenuOpen: !isMenuOpen })}
        >
          <Icon name="content" />
          MENU
        </Button>
        {isMenuOpen && (
          <Menu id="nav" className="nav" stackable borderless>
            <Menu.Item className="navigation__menu-item-logo">
              <NavLink to="/">
                {process.env.DCSS_BRAND_NAME_TITLE || 'Home'}
              </NavLink>
            </Menu.Item>

            <Menu.Menu>
              <Dropdown
                simple
                item
                className="navigation__dropdown"
                text={navLinkToScenarios}
              >
                <Dropdown.Menu>
                  <Popup
                    position="right center"
                    size="large"
                    content={explainAllScenarios}
                    trigger={navLinkToAllScenarios}
                  />
                  <Popup
                    position="right center"
                    size="large"
                    content={explainMyScenarios}
                    trigger={navLinkToMyScenarios}
                  />
                  <Popup
                    position="right center"
                    size="large"
                    content={explainOfficialScenarios}
                    trigger={navLinkToOfficialScenarios}
                  />
                  <Popup
                    position="right center"
                    size="large"
                    content={explainCommunityScenarios}
                    trigger={navLinkToCommunityScenarios}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>

            {isLoggedIn ? navLinkToAuthorized : null}

            <Menu.Menu position="right">
              {isLoggedIn ? (
                <UserMenu user={user} />
              ) : (
                <NavLink to="/login">Log in</NavLink>
              )}
            </Menu.Menu>
          </Menu>
        )}
      </Fragment>
    );
  }
}

Navigation.propTypes = {
  endScenarioLock: PropTypes.func,
  history: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  scenario: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.login;
  const { user, scenario } = state;
  return { user, scenario, isLoggedIn };
};

const mapDispatchToProps = dispatch => ({
  endScenarioLock: params => dispatch(endScenarioLock(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navigation)
);
