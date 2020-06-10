import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AddSlideMessage from '../components/AddSlideMessage';

storiesOf('AddSlideMessage', module)
  .add('with text', () => <AddSlideMessage onClick={action('clicked')}/>);
