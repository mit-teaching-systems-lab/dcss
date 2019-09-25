import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';

export const ThumbnailGallery = ({ children }) => (
    <Grid.Row className="thumbnail_gallery">{children}</Grid.Row>
);

ThumbnailGallery.propTypes = {
    children: PropTypes.element
};
