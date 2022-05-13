import PropTypes from 'prop-types';
import React from 'react';

const RequestPermissionsLink = ({ children }) => {
  return (
    <a
      className="dashboard-card__link"
      href="https://forms.gle/qVDNxiD1yqrtDwMQ6"
    >
      {[children]}
    </a>
  );
};

RequestPermissionsLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

export default RequestPermissionsLink;
