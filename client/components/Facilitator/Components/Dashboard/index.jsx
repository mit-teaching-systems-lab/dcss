import React from 'react';
import { Container, Grid, Header, List } from 'semantic-ui-react';

export default () => (
    <Container fluid>
        <Grid columns={2} divided stackable>
            <Grid.Column width={3}>Menu of things to do.</Grid.Column>
            <Grid.Column stretched>
                <Header as="h2">
                    This is the &quot;Facilitator Dashboard&quot;
                </Header>
                <List as="ul">
                    <List.Item as="li">Choose a teacher moment</List.Item>
                    <List.Item as="li">Run moment, with N people</List.Item>
                    <List.Item as="li">
                        Can be logged into teacher moment session, which other
                        facilitator can log into (1 or more can access same
                        session)
                    </List.Item>
                    <List.Item as="li">Hit &quot;start&quot;</List.Item>
                    <List.Item as="li">Students given access</List.Item>
                    <List.Item as="li">
                        Students participate and complete
                    </List.Item>
                </List>
            </Grid.Column>
        </Grid>
    </Container>
);
