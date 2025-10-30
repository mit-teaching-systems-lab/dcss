import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import interval from 'interval-promise';
import { getInvites } from '@actions/invite';
import { getPermissions, getSession } from '@actions/session';
import BrandedLandingPage from '@components/BrandedLandingPage';
import Notification from '@components/Notification';
import withSocket, {
  CREATE_USER_CHANNEL,
  HEART_BEAT,
  REDIRECT
} from '@hoc/withSocket';
import BackButtonHistory from './BackButtonHistory';
import Navigation from './Navigation';
import Routes from './Routes';
import Layout from '@utils/Layout';
import { BRAND_NAME } from '@utils/constants';
import { detectIncognito } from 'detectincognitojs';

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
      isPrivate: false,
      isReady: false
    };
    this.heartBeat = this.heartBeat.bind(this);
    this.heartBeat.cancel = () => {};
    this.onLoad = this.onLoad.bind(this);
    this.onRedirect = this.onRedirect.bind(this);
  }

  async componentDidMount() {
    window.addEventListener('load', this.onLoad);

    let isPrivate = false;

    try {
      const detection = await detectIncognito();
      isPrivate = detection.isPrivate;
    } catch (error) {
      isPrivate = false;
    }

    let { isReady } = this.state;

    if (!isPrivate) {
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
    } else {
      isReady = true;
    }

    const { user } = this.props;

    this.props.socket.on(REDIRECT, this.onRedirect);
    this.props.socket.emit(CREATE_USER_CHANNEL, {
      user
    });

    this.setState({
      isPrivate,
      isReady
    });
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.onLoad);
    this.props.socket.off(REDIRECT, this.onRedirect);
    this.heartBeat.cancel();
  }

  onLoad() {
    if (Layout.isForMobile()) {
      window.scrollTo(0, 1);
    }
  }

  onRedirect({ href }) {
    if (href) {
      location.href = href;
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

    if (this.state.isPrivate) {
      return (
        <h1>{BRAND_NAME} is not compatible with private or incognito mode. </h1>
      );
    }

    const { isLoggedIn } = this.props;
    const applicationComponents = (
      <Router history={history}>
        <BackButtonHistory>
          <Navigation />
          <Routes isLoggedIn={isLoggedIn} />
          <Notification />
        </BackButtonHistory>
      </Router>
    );

    const shouldShowBrandedLandingPage =
      BrandedLandingPage.hasValidURL && location.pathname === '/';

    // If logged in, always display Application
    // If not logged in, and a branded landing page url is set, display that
    // If not logged in, and there is no branded landing page, display Application
    return isLoggedIn ? (
      applicationComponents
    ) : shouldShowBrandedLandingPage ? (
      <BrandedLandingPage />
    ) : (
      applicationComponents
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
