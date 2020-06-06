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

  onPopState() {
    window.location.href = this.props.location.pathname;
  }

  render() {
    return this.props.children;
  }
}

BackButtonHistory.propTypes = {
  children: PropTypes.array,
  location: PropTypes.object.isRequired
};

export default withRouter(BackButtonHistory);
