import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@components/UI';

export const Username = props => {
  const { is_super, psersonalname, username } = props;
  return (
    <Fragment>
      {psersonalname || username}{' '}
      {is_super ? (
        <Icon
          size="small"
          style={{ marginLeft: '0.25em', marginRight: '0', opacity: '0.25' }}
          name="chess queen"
          title="Super user"
        />
      ) : null}
    </Fragment>
  );
};

Username.propTypes = {
  is_super: PropTypes.bool,
  psersonalname: PropTypes.string,
  username: PropTypes.string
};

export default Username;
