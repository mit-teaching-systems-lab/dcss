import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';

import ConfirmAuth from '@components/ConfirmAuth';
import ConfirmableLogoutMenuItem from '@components/Login/ConfirmableLogoutMenuItem';

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
    permission: 'view_run_data'
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
            <Menu.Item>
              <NavLink to={path}>{text}</NavLink>
            </Menu.Item>
          </ConfirmAuth>
        );
      }
    );

    const navLinkToScenarios = <NavLink to="/scenarios/">Scenarios</NavLink>;
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
              <Dropdown simple item text={navLinkToScenarios}>
                <Dropdown.Menu>
                  {isLoggedIn && (
                    <Fragment>
                      <ConfirmAuth requiredPermission="create_scenario">
                        <Dropdown.Item>
                          <NavLink
                            to={{
                              pathname: `/scenarios/author/${user.username}`
                            }}
                          >
                            My Scenarios
                          </NavLink>
                        </Dropdown.Item>
                      </ConfirmAuth>
                    </Fragment>
                  )}
                  <Dropdown.Item>
                    <NavLink to="/scenarios/official">Official</NavLink>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <NavLink to="/scenarios/community">Community</NavLink>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>

            {isLoggedIn ? navLinkAuthorized : null}

            {isLoggedIn ? (
              <ConfirmableLogoutMenuItem user={user} />
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
