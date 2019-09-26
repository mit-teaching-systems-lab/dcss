import React from 'react';
import PropTypes from 'prop-types';

export const ThumbnailGroupTitle = ({ title }) => <h2>{title}</h2>;

ThumbnailGroupTitle.propTypes = {
    title: PropTypes.string
};
