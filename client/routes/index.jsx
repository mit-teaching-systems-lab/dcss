import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import History from './History';
import Navigation from './Navigation';
import Notification from './Notification';
import Routes from './Routes';
import './Nav.css';

import Session from '@utils/session';

Session.timeout();

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch(handleCheckLoggedIn());
    // dispatch(handleGetValidAts());
    // dispatch(getAllUsers());
  }

  render() {
    return (
      <Router>
        <History>
          <Navigation />
          <Routes />
          <Notification />
        </History>
      </Router>
    );
  }
}

export default App;
