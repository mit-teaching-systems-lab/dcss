import React from 'react';
import { storiesOf } from '@storybook/react';
import { Dropdown } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

const dropDownValues = [
    {
        key: 'context',
        value: 'context',
        text: 'Context'
    },
    {
        key: 'anticipate',
        value: 'anticipate',
        text: 'Anticipate'
    },
    {
        key: 'enact',
        value: 'enact',
        text: 'Enact'
    },
    {
        key: 'reflect',
        value: 'reflect',
        text: 'Reflect'
    }
];

storiesOf('Dropdown', module)
    .add('dropdown no title', () => (
        <Dropdown selection options={dropDownValues} />
    ))
    .add('dropdown with title', () => (
        <Dropdown selection placeholder="Add +" options={dropDownValues} />
    ));
