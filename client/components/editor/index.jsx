import React from 'react';
import { hot } from 'react-hot-loader';
import { Tab } from 'semantic-ui-react';
import ScenarioEditor from '@components/scenarioEditor';
import { SlideEditor } from '@components/slideEditor';

import './editor.css';

const panes = [
    { menuItem: 'Moment', render: () => <ScenarioEditor /> },
    { menuItem: 'Slides', render: SlideEditor }
];

const Editor = () => <Tab panes={panes} />;

export default hot(module)(Editor);
