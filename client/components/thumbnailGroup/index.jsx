import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { ThumbnailGroupTitle } from '@components/thumbnailGroupTitle';

export const ThumbnailGroup = ({ title, children }) => (
    <Grid.Row>
        <ThumbnailGroupTitle title={title} />
        {children}
    </Grid.Row>
);

ThumbnailGroup.propTypes = {
    title: PropTypes.string,
    children: PropTypes.element
};
