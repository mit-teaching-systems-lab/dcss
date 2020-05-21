import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { logIn, logOut } from '@client/actions';
import { getUser } from '@client/actions/user';
import Loading from '@components/Loading';

import History from './History';
import Navigation from './Navigation';
import Notification from './Notification';
import Routes from './Routes';
import './Nav.css';

localStorage.removeItem('session');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    const { getUser, logIn, logOut } = this.props;
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
    const { isReady } = this.state;

    if (!isReady) {
      return <Loading />;
    }
    console.log(isReady);
    const { isLoggedIn } = this.props;

    return (
      <Router>
        <History>
          <Navigation />
          <Routes isLoggedIn={isLoggedIn} />
          <Notification />
        </History>
      </Router>
    );
  }
}

App.propTypes = {
  getUser: PropTypes.func,
  isLoggedIn: PropTypes.bool,
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
