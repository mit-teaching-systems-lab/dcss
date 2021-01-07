import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Dropdown, Menu, Popup } from '@components/UI';
import { endScenarioLock } from '@actions/scenario';
import Gate from '@components/Gate';
import UserMenu from '@components/User/UserMenu';
import Events from '@utils/Events';
import Layout from '@utils/Layout';

const DCSS_BRAND_LABEL = process.env.DCSS_BRAND_LABEL || 'Teaching Systems Lab';

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

    const explainAllScenarios = 'See all scenarios';
    // This is used as the dropdown trigger, in the top menu
    const menuItemScenarios = (
      <Menu.Item.Tabbable
        role="option"
        to="/scenarios/"
        aria-label={explainAllScenarios}
        as={NavLink}
      >
        Scenarios
      </Menu.Item.Tabbable>
    );

    // This is used WITHIN the dropdown menu
    // const menuItemAllScenarios = (
    //   <Menu.Item.Tabbable
    //     role="option"
    //     to="/scenarios/"
    //     aria-label={explainAllScenarios}
    //     as={NavLink}
    //   >
    //     All
    //   </Menu.Item.Tabbable>
    // );

    // to={`/scenarios/author/${user.username}`}
    const explainMyScenarios =
      'See scenarios where I am an owner, author or reviewer';
    const menuItemMyScenarios = isLoggedIn ? (
      <Menu.Item.Tabbable
        role="option"
        to={`/scenarios/author/${user.username}`}
        aria-label={explainMyScenarios}
        as={NavLink}
      >
        Mine
      </Menu.Item.Tabbable>
    ) : null;

    const explainOfficialScenarios = `See scenarios made by ${DCSS_BRAND_LABEL}`;
    const menuItemOfficialScenarios = (
      <Menu.Item.Tabbable
        role="option"
        to="/scenarios/official"
        aria-label={explainOfficialScenarios}
        as={NavLink}
      >
        Official
      </Menu.Item.Tabbable>
    );

    const explainCommunityScenarios = 'See scenarios made by the community';
    const menuItemCommunityScenarios = (
      <Menu.Item.Tabbable
        role="option"
        to="/scenarios/community"
        aria-label={explainCommunityScenarios}
        as={NavLink}
      >
        Community
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
    //   <Menu.Item.Tabbable to="https://form.asana.com?hash=7d5e154fd719cf063ef8f8bccaa40556c49b0f4c89157730ef86b701d374f265&id=1189279338202577" as={NavLink}>
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

            <Menu.Menu>
              <Dropdown
                simple
                item
                className="navigation__dropdown"
                aria-label={explainAllScenarios}
                trigger={menuItemScenarios}
                onKeyUp={event => {
                  if (event.target.getAttribute('role') === 'option') {
                    Events.onKeyUp(event, {}, () => event.target.click());
                  }
                }}
              >
                <Dropdown.Menu>
                  {/*
                  <Popup
                    position="right center"
                    size="large"
                    content={explainAllScenarios}
                    trigger={menuItemAllScenarios}
                  />
                  */}
                  <Popup
                    inverted
                    position="right center"
                    size="large"
                    content={explainMyScenarios}
                    trigger={menuItemMyScenarios}
                  />
                  <Popup
                    inverted
                    position="right center"
                    size="large"
                    content={explainOfficialScenarios}
                    trigger={menuItemOfficialScenarios}
                  />
                  <Popup
                    inverted
                    position="right center"
                    size="large"
                    content={explainCommunityScenarios}
                    trigger={menuItemCommunityScenarios}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>

            {menuItemAuthorized}

            <Menu.Menu position="right">{menuItemUserMenu}</Menu.Menu>
          </Fragment>
        )}
      </Menu>
    );
    return topLevelNavigation;
  }
}

const navPropTypes = {
  endScenarioLock: PropTypes.func,
  history: PropTypes.object,
  isLoggedIn: PropTypes.bool,
  scenario: PropTypes.object,
  user: PropTypes.object
};

Navigation.propTypes = navPropTypes;

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
