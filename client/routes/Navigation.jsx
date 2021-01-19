import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Menu } from '@components/UI';
import { endScenarioLock } from '@actions/scenario';
import Gate from '@components/Gate';
import UserMenu from '@components/User/UserMenu';
import Layout from '@utils/Layout';

const restrictedNav = [
  {
    text: 'Cohorts',
    path: '/cohorts',
    permission: 'view_own_cohorts'
  },
  {
    text: 'History',
    path: '/history'
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
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
  }

  onBeforeUnload() {
    const { lock } = this.props.scenario;
    if (lock && lock.user_id === this.props.user.id) {
      this.props.endScenarioLock(this.props.scenario.id);
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload);

    this.props.history.listen(({ pathname }) => {
      if (!pathname.startsWith('/editor/')) {
        this.onBeforeUnload();
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  render() {
    const { isLoggedIn, user } = this.props;

    const menuItemsRequireLogin = restrictedNav.map(
      ({ text, path, permission }, index) => {
        const menuItem = (
          <Menu.Item.Tabbable
            key={`menu-item-nav-${index}`}
            to={path}
            as={NavLink}
          >
            {text}
          </Menu.Item.Tabbable>
        );
        return permission ? (
          <Gate
            key={`confirmed-menu-item-nav-${index}`}
            requiredPermission={permission}
          >
            {menuItem}
          </Gate>
        ) : (
          menuItem
        );
      }
    );

    const menuItemAuthorized = isLoggedIn ? menuItemsRequireLogin : null;

    // This is used as the dropdown trigger, in the top menu
    const menuItemScenarios = (
      <Menu.Item.Tabbable
        aria-label="See all scenarios"
        role="option"
        to="/scenarios/"
        as={NavLink}
      >
        Scenarios
      </Menu.Item.Tabbable>
    );

    const menuItemBrandLogo = (
      <Menu.Item.Tabbable className="navigation__menu-item-logo">
        <NavLink to="/">{process.env.DCSS_BRAND_NAME_TITLE || 'Home'}</NavLink>
      </Menu.Item.Tabbable>
    );

    const menuItemUserMenu = isLoggedIn ? (
      <UserMenu user={user} />
    ) : (
      <Menu.Item.Tabbable to="/login" as={NavLink}>
        Log in
      </Menu.Item.Tabbable>
    );

    // const menuItemBugReport = (
    //   <Menu.Item.Tabbable to="https://form.asana.com?k=1usHUVJzjZAbjxDSZ1Wp6A&d=74607040975" as={NavLink}>
    //     <Icon name="bug" />
    //   </Menu.Item.Tabbable>
    // );

    const menuItemGoTo = (
      <Menu.Item.Tabbable role="option" aria-label="Go to...">
        Go to...
      </Menu.Item.Tabbable>
    );

    const topLevelNavigation = (
      <Menu id="nav" aria-controls="nav" borderless>
        {Layout.isForMobile() ? (
          <Fragment>
            {menuItemBrandLogo}
            <Dropdown
              basic
              item
              className="navigation__dropdown-mobile"
              trigger={menuItemGoTo}
            >
              <Dropdown.Menu>
                {menuItemScenarios}
                {menuItemAuthorized}
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Menu position="right">{menuItemUserMenu}</Menu.Menu>
          </Fragment>
        ) : (
          <Fragment>
            {menuItemBrandLogo}
            {menuItemScenarios}
            {menuItemAuthorized}
            <Menu.Menu position="right">{menuItemUserMenu}</Menu.Menu>
          </Fragment>
        )}
      </Menu>
    );

    return topLevelNavigation;
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
  const { isLoggedIn } = state.session;
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
