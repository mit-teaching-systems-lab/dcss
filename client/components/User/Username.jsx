import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@components/UI';

class Username extends Component {
  constructor(props) {
    super(props);
    const { personalname, username } = this.props;

    this.displayName = personalname || username;
  }
  toString() {
    return this.displayName;
  }
  render() {
    const { is_super } = this.props;
    return (
      <Fragment>
        {this.displayName}{' '}
        {is_super ? (
          <Icon
            size="small"
            name="chess queen"
            title="Super user"
            style={{
              marginRight: '0',
              marginBottom: '0.3em',
              marginLeft: '0.25em',
              opacity: '0.25'
            }}
          />
        ) : null}
      </Fragment>
    );
  }
}

Username.propTypes = {
  is_super: PropTypes.bool,
  personalname: PropTypes.string,
  username: PropTypes.string
};

export default Username;
