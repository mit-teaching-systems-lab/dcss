import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class History extends React.Component {
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
    // console.log(event);
    // console.log(this.props.history);
    // console.log('onPopState');
    // this.props.history.goBack();
  }

  render() {
    return this.props.children;
  }
}

History.propTypes = {
  children: PropTypes.array,
  history: PropTypes.object
};

export default withRouter(History);
