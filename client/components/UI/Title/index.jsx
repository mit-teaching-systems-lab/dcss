import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

let brandTitle = null;

const Title = ({ content, override }) => {
  if (!brandTitle) {
    brandTitle = document.title;
  }

  const title = override
    ? content
    : `${brandTitle}: ${content}`;

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

Title.defaultProps = {
  override: false
};

Title.propTypes = {
  content: PropTypes.any,
  override: PropTypes.bool
};

export default Title;
