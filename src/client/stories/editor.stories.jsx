import React from 'react';
import { storiesOf } from '@storybook/react';
import { Editor } from '../components/editor';

import 'semantic-ui-css/semantic.min.css';
import './stories.css';

storiesOf('Editor', module).add('Editor Layout', () => <Editor />);
