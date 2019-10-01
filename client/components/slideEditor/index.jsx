import React from 'react';
import { Grid } from 'semantic-ui-react';
import { ThumbnailContainer } from '@components/thumbnailContainer';

export const SlideEditor = () => (
    <Grid divided="vertically" className="editor">
        <ThumbnailContainer width={4} />
        <Grid.Column width={12} color="blue">
            SLIDE EDITOR
        </Grid.Column>
    </Grid>
);
