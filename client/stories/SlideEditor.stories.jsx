import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { Container, Header } from 'semantic-ui-react';
import { action } from '@storybook/addon-actions';

function makeDemo(name, Comp) {
    class Demo extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                value: Comp.defaultValue()
            };
            this.onChange = this.onChange.bind(this);
        }

        render() {
            const { onChange } = this;
            const { value } = this.state;
            return (
                <Container>
                    <Header>Card:</Header>
                    <Comp.Card />
                    <Header>Editor:</Header>
                    <Comp.Editor value={value} onChange={onChange} />
                    <Header>Display:</Header>
                    <Comp.Display {...value} />
                </Container>
            );
        }

        onChange(value) {
            this.setState({ value });
            this.props.onChange(value);
        }
    }

    Demo.propTypes = {
        onChange: PropTypes.func.isRequired
    };

    storiesOf(`Slide/Component/${name}`).add('Demo', () => (
        <Demo onChange={action('onChange')} />
    ));
}

import * as Components from '@components/Slide/Components';
for (const [type, Comp] of Object.entries(Components)) {
    makeDemo(type, Comp);
}

import Editor from '@components/Slide/Editor';
storiesOf('Slide/Editor').add('Demo', () => (
    <Editor onChange={action('onChange')} />
));
