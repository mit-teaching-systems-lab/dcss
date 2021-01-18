import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class BackButtonHistory extends React.Component {
  constructor(props) {
    super(props);
    this.onPopState = this.onPopState.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.onPopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.onPopState);
  }

  onPopState(event) {
    this.props.history.go(-1);
    // Previously:
    // window.location.href = this.props.location.pathname;
  }

  render() {
    return this.props.children || null;
  }
}

BackButtonHistory.propTypes = {
  children: PropTypes.array,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(BackButtonHistory);
