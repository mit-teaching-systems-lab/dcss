import React from 'react';
import { storiesOf } from '@storybook/react';
import { Grid } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './stories.css';

storiesOf('Editor', module)
    .add('Layout', () => (
        <Grid columns={2}>
            <Grid.Row stretched>
                <Grid.Column width={4} color='orange'>SLIDE HOLDER</Grid.Column>
                <Grid.Column width={12} color='blue'>SLIDE EDITOR</Grid.Column>
            </Grid.Row>
        </Grid>
    ));