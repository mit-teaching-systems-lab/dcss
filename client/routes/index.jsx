import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { logIn } from '@client/actions';
import { getUser } from '@client/actions/user';
import Loading from '@components/Loading';

import BackButtonHistory from './BackButtonHistory';
import Navigation from './Navigation';
import Notification from './Notification';
import Routes from './Routes';
import './Nav.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    const { getUser, logIn } = this.props;
    let { isReady } = this.state;

    if (!isReady) {
      await getUser();

      // After getUser() is resolved,
      // this.props.user.id will be set if
      // there is a valid, active session.
      if (this.props.user.id) {
        const { permissions } = await (await fetch(
          '/api/roles/permission'
        )).json();

        logIn({
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
      return <Loading />;
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
  getUser: PropTypes.func,
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
  getUser: () => dispatch(getUser()),
  logIn: params => dispatch(logIn(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
