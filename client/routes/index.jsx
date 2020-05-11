import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router';
import Navigation from './Navigation';
import Notification from './Notification';
import Routes from './Routes';
import './Nav.css';

import Session from '@utils/session';

Session.timeout();

const History = withRouter(
  class extends Component {
    constructor(props) {
      super(props);

      this.onPopState = this.onPopState.bind(this);
    }

    static propTypes() {
      return {
        children: PropTypes.array,
        history: PropTypes.object
      };
    }

    componentDidMount() {
      window.addEventListener('popstate', this.onPopState);
    }

    componentWillUnmount() {
      window.removeEventListener('popstate', this.onPopState);
    }

    onPopState(event) {
      // console.log(event);
      // console.log(this.props.history);
      // console.log('onPopState');
      // this.props.history.goBack();
    }

    render() {
      return this.props.children;
    }
  }
);

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
