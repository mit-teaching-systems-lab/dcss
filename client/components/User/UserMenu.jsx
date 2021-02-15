import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from '@components/UI';

import ConfirmableLogout from '@components/Login/ConfirmableLogout';
import Username from '@components/User/Username';
import UserSettings from '@components/User/UserSettings';

import Layout from '@utils/Layout';

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsIsOpen: false,
      logoutIsOpen: false
    };
    this.onSettingsOpenClick = this.onSettingsOpenClick.bind(this);
    this.onLogoutOpenClick = this.onLogoutOpenClick.bind(this);
  }

  onSettingsOpenClick() {
    this.setState({ settingsIsOpen: true });
  }

  onLogoutOpenClick() {
    this.setState({ logoutIsOpen: true });
  }

  render() {
    const { onSettingsOpenClick, onLogoutOpenClick } = this;
    const { settingsIsOpen, logoutIsOpen } = this.state;
    const { user } = this.props;

    const dropdownProps = {
      simple: true,
      item: true,
      onKeyUp(event) {
        const key = event.which || event.keyCode;
        const target = event.target;
        if (
          key === 13 ||
          (key === 32 && target.getAttribute('role') === 'option')
        ) {
          target.click();
        }
      }
    };

    if (Layout.isForMobile()) {
      dropdownProps.icon = 'user';
    } else {
      dropdownProps.trigger = <Username />;
    }

    return (
      <Fragment>
        <Dropdown {...dropdownProps}>
          <Dropdown.Menu>
            <Dropdown.Item tabIndex="0" onClick={onSettingsOpenClick}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item tabIndex="0" onClick={onLogoutOpenClick}>
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {settingsIsOpen ? (
          <UserSettings
            user={user}
            open={settingsIsOpen}
            onCancel={() => this.setState({ settingsIsOpen: false })}
          />
        ) : null}
        {logoutIsOpen ? (
          <ConfirmableLogout
            user={user}
            open={logoutIsOpen}
            onCancel={() => this.setState({ logoutIsOpen: false })}
          />
        ) : null}
      </Fragment>
    );
  }
}

UserMenu.propTypes = {
  user: PropTypes.object,
  invites: PropTypes.array
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.session;
  const { invites, user } = state;
  return { invites, user, isLoggedIn };
};

export default connect(mapStateToProps)(UserMenu);
