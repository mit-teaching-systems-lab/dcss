import React from 'react';
import { Grid, Image } from 'semantic-ui-react';
import Cohorts from '../Cohorts';
import './Dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid columns={3}>
                <Grid.Column width={4}>
                    <Cohorts />
                </Grid.Column>
                <Grid.Column width={9}>
                    <Image src="/images/wireframe/paragraph.png" />
                </Grid.Column>
                <Grid.Column width={3}>
                    <Image src="/images/wireframe/media-paragraph.png" />
                </Grid.Column>
            </Grid>
        );
    }
}

export default Dashboard;
