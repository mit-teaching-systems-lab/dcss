import React from 'react';
import { storiesOf } from '@storybook/react';
import ScenariosList from '@components/ScenariosList';
import { Provider } from 'react-redux';
import store from '@client/store';

const scenarioTestData = [
    {
        title: 'Gendered or racialized student comments',
        description:
            'This is an online practice space about managing classroom climate.'
    },
    {
        title: 'Noticing student belonging in the classroom',
        description:
            'This is an interactive case study simulating the observation of a high school computer science classroom.'
    },
    {
        title: 'Positioning students in the classroom',
        description:
            'This is an interactive case study simulating a small part of a high school computer science lesson.'
    }
];

storiesOf('Scenario List', module).add('List View', () => (
    <Provider store={store}>
        <ScenariosList scenarioData={scenarioTestData} isLoggedIn={true} />
    </Provider>
));
