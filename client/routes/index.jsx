import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { logIn } from '@actions/login';
import { getSession } from '@actions/user';

import Notification from '@components/Notification';
import BackButtonHistory from './BackButtonHistory';
import Navigation from './Navigation';
import Routes from './Routes';

import './Nav.css';
// import 'semantic-ui-css/semantic.min.css';
import 'fomantic-ui-css/semantic.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    let { isReady } = this.state;

    if (!isReady) {
      await this.props.getSession();

      // After getSession() is resolved,
      // this.props.user.id will be set if
      // there is a valid, active session.
      if (this.props.user.id) {
        // TODO: move this into async action
        const { permissions } = await (
          await fetch('/api/roles/permission')
        ).json();

        await this.props.logIn({
          ...this.props.user,
          permissions
        });
      }
      isReady = true;
    }

    this.setState({
      isReady
    });
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    return (
      <Router>
        <BackButtonHistory>
          <Navigation />
          <Routes isLoggedIn={this.props.isLoggedIn} />
          <Notification />
        </BackButtonHistory>
      </Router>
    );
  }
}

App.propTypes = {
  getSession: PropTypes.func,
  isLoggedIn: PropTypes.bool,
  logIn: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.login;
  const { user } = state;
  return { user, isLoggedIn };
};

const mapDispatchToProps = dispatch => ({
  getSession: options => dispatch(getSession(options)),
  logIn: params => dispatch(logIn(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
