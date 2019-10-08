import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import ScenariosList from '@client/components/scenariosList';

class App extends Component {
    render() {
        return (
            <Container className="tm__app">
                <ScenariosList />
            </Container>
        );
    }
}

export default hot(module)(App);
