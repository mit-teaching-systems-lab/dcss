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
      openSettings: false,
      openLogout: false
    };
    this.onSettingsClick = this.onSettingsClick.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onSettingsClick() {
    this.setState({ openSettings: true });
  }

  onLogoutClick() {
    this.setState({ openLogout: true });
  }

  render() {
    const { onSettingsClick, onLogoutClick } = this;
    const { openSettings, openLogout } = this.state;
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
      dropdownProps.trigger = <Username {...user} />;
    }

    return (
      <Fragment>
        <Dropdown {...dropdownProps}>
          <Dropdown.Menu>
            <Dropdown.Item tabIndex="0" onClick={onSettingsClick}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item tabIndex="0" onClick={onLogoutClick}>
              Log out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {openSettings ? (
          <UserSettings
            user={user}
            open={openSettings}
            onCancel={() => this.setState({ openSettings: false })}
          />
        ) : null}
        {openLogout ? (
          <ConfirmableLogout
            user={user}
            open={openLogout}
            onCancel={() => this.setState({ openLogout: false })}
          />
        ) : null}
      </Fragment>
    );
  }
}

UserMenu.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.session;
  const { user } = state;
  return { user, isLoggedIn };
};

export default connect(mapStateToProps)(UserMenu);
