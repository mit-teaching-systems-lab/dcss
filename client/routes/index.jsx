import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import interval from 'interval-promise';
import { getInvites } from '@actions/invite';
import { getPermissions, getSession } from '@actions/session';
import Notification from '@components/Notification';
import withSocket, { HEART_BEAT } from '@hoc/withSocket';
import BackButtonHistory from './BackButtonHistory';
import Navigation from './Navigation';
import Routes from './Routes';
import Layout from '@utils/Layout';

// TODO: switch to this Router import when ready to migrate
// import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

import './Nav.css';
// import 'semantic-ui-css/semantic.min.css';
import 'fomantic-ui-css/semantic.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
    this.heartBeat = this.heartBeat.bind(this);
    this.heartBeat.cancel = () => {};
    this.onLoad = this.onLoad.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('load', this.onLoad);

    let { isReady } = this.state;

    if (!isReady) {
      await this.props.getSession();
      // After getSession() is resolved,
      // this.props.user.id will be set if
      // there is a valid, active session.
      if (this.props.user.id) {
        await this.props.getPermissions();
        await this.props.getInvites();

        interval(async (count, stop) => {
          if (document.visibilityState === 'visible') {
            this.heartBeat();
          }
          this.heartBeat.cancel = stop;
        }, 60000);

        this.heartBeat();
      }
      isReady = true;
    }

    this.setState({
      isReady
    });
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad);
    this.heartBeat.cancel();
  }

  onLoad() {
    if (Layout.isForMobile()) {
      window.scrollTo(0, 1);
    }
  }

  heartBeat() {
    const {
      user: { id }
    } = this.props;
    this.props.socket.emit(HEART_BEAT, { id });
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }

    return (
      <Router history={history}>
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
  isLoggedIn: PropTypes.bool,
  getInvites: PropTypes.func,
  getPermissions: PropTypes.func,
  getSession: PropTypes.func,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.session;
  const { user } = state;
  return { isLoggedIn, user };
};

const mapDispatchToProps = dispatch => ({
  getInvites: () => dispatch(getInvites()),
  getSession: () => dispatch(getSession()),
  getPermissions: () => dispatch(getPermissions())
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
