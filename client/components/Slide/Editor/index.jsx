import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Label, Input, Menu, Tab } from 'semantic-ui-react';
import ConfirmableDeleteButton from '@components/Editor/ConfirmableDeleteButton';
import * as Components from '../Components';
import './Editor.css';

const ComponentsMenuOrder = [
    'Text',
    'TextResponse',
    'CheckResponse',
    'AudioResponse'
];

export default class SlideEditor extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandlers = {};
        const { title = 'Slide', components = [] } = props;
        this.state = {
            title,
            components
        };

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDeleteComponent = this.onDeleteComponent.bind(this);
        this.updatedState = this.updatedState.bind(this);
    }

    updatedState() {
        if (this.props.onChange) {
            this.props.onChange(this.state);
        }
    }

    clickHandle(type) {
        if (!this.clickHandlers[type]) {
            this.clickHandlers[type] = this.onMenuClick.bind(this, type);
        }
        return this.clickHandlers[type];
    }

    onComponentChange(index, value) {
        const components = this.state.components.slice();
        components[index] = value;
        this.setState({ components }, this.updatedState);
    }

    onDeleteComponent(index) {
        const components = this.state.components.slice();
        components.splice(index, 1);
        this.setState({ components }, this.updatedState);
    }

    onMenuClick(type) {
        const components = [
            ...this.state.components,
            Components[type].defaultValue()
        ];
        this.setState({ components }, this.updatedState);
    }

    onTitleChange(event, { value: title }) {
        this.setState({ title }, this.updatedState);
    }

    render() {
        const {
            onTitleChange,
            state: { title, components }
        } = this;
        return (
            <Grid columns={2}>
                <Grid.Column stretched width={12}>
                    <Grid.Row>
                        <Label as="label">
                            Slide Title:{' '}
                            <Input
                                name="title"
                                value={title}
                                onChange={onTitleChange}
                            />
                        </Label>
                        {components.map((value, index) => {
                            const { type } = value;
                            const { Editor, Display } = Components[type];
                            const edit = (
                                <Editor
                                    value={value}
                                    onChange={v =>
                                        this.onComponentChange(index, v)
                                    }
                                />
                            );
                            const deleteButton = (
                                <ConfirmableDeleteButton
                                    what="Component"
                                    onConfirm={() =>
                                        this.onDeleteComponent(index)
                                    }
                                />
                            );
                            const display = <Display {...value} />;

                            return (
                                <React.Fragment key={index}>
                                    <Tab
                                        panes={[
                                            {
                                                menuItem: 'Edit',
                                                render: () => (
                                                    <Tab.Pane className="tm__edit-pane">
                                                        {edit}
                                                        {deleteButton}
                                                    </Tab.Pane>
                                                )
                                            },
                                            {
                                                menuItem: 'Preview',
                                                render: () => (
                                                    <Tab.Pane>
                                                        {display}
                                                    </Tab.Pane>
                                                )
                                            }
                                        ]}
                                    />
                                </React.Fragment>
                            );
                        })}
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Grid.Row>
                        <Menu vertical size="small" fluid={true} icon={true}>
                            Add:
                            {ComponentsMenuOrder.map(type => {
                                const { Card } = Components[type];
                                return (
                                    <Menu.Item
                                        key={type}
                                        onClick={this.clickHandle(type)}
                                    >
                                        <Card />
                                    </Menu.Item>
                                );
                            })}
                        </Menu>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

SlideEditor.propTypes = {
    title: PropTypes.string,
    components: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func
};
