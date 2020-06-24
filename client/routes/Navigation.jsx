import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';

import ConfirmAuth from '@components/ConfirmAuth';
import ConfirmableLogout from '@components/Login/ConfirmableLogout';
import UserSettings from '@components/Login/UserSettings';

const MOBILE_WIDTH = 767;
const restrictedNav = [
  {
    text: 'My Scenario Data',
    path: '/my-scenario-data',
    permission: 'view_own_data'
  },
  {
    text: 'Cohorts',
    path: '/cohorts',
    permission: 'view_own_cohorts'
  },
  {
    text: 'Research',
    path: '/research',
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
    this.onResize = this.onResize.bind(this);
  }

  onResize() {
    const { isMenuOpen } = this.state;

    if (window.innerWidth > MOBILE_WIDTH && !isMenuOpen) {
      this.setState({ isMenuOpen: true });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    const { isMenuOpen } = this.state;

    const { isLoggedIn, user } = this.props;

    const navLinkAuthorized = restrictedNav.map(
      ({ text, path, permission }, index) => {
        return (
          <ConfirmAuth key={index} requiredPermission={permission}>
            <Menu.Item href={path}>{text}</Menu.Item>
          </ConfirmAuth>
        );
      }
    );

    const navLinkToScenarios = (
      <Menu.Item href="/scenarios/">Scenarios</Menu.Item>
    );

    //<NavLink to="/scenarios/">Scenarios</NavLink>;
    return (
      <Fragment>
        <Button
          icon
          fluid
          labelPosition="left"
          basic
          className="nav__mobile"
          id="nav__mobile--button"
          onClick={() => this.setState({ isMenuOpen: !isMenuOpen })}
          aria-controls="nav"
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
                  {isLoggedIn && (
                    <Fragment>
                      <ConfirmAuth requiredPermission="create_scenario">
                        <Menu.Item href={`/scenarios/author/${user.username}`}>
                          My Scenarios
                        </Menu.Item>
                      </ConfirmAuth>
                    </Fragment>
                  )}
                  <Menu.Item href="/scenarios/official">Official</Menu.Item>
                  <Menu.Item href="/scenarios/community">Community</Menu.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>

            {isLoggedIn ? navLinkAuthorized : null}

            {isLoggedIn ? (
              <Menu.Menu position="right">
                <Dropdown simple item text={user.username}>
                  <Dropdown.Menu>
                    <UserSettings user={user} />
                    <ConfirmableLogout user={user} />
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Menu>
            ) : (
              <Menu.Item position="right">
                <NavLink to="/login">Log in</NavLink>
              </Menu.Item>
            )}
          </Menu>
        )}
      </Fragment>
    );
  }
}

Navigation.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.login;
  const { user } = state;
  return { user, isLoggedIn };
};

export default connect(mapStateToProps)(Navigation);
