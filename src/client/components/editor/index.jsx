import React from 'react';
import { Grid } from 'semantic-ui-react';
import './editor.css';

export const Editor = (props) => (
    <Grid columns={2}>
        <Grid.Column width={4} color='orange'>SLIDE HOLDER</Grid.Column>
        <Grid.Column width={12} color='blue'>SLIDE EDITOR</Grid.Column>
    </Grid>
);