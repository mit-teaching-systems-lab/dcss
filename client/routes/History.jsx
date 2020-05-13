import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class History extends Component {
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

  onPopState() {
    // console.log(event);
    // console.log(this.props.history);
    // console.log('onPopState');
    // this.props.history.goBack();
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(History);
