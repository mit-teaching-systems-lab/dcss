import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Container, Form, Grid } from 'semantic-ui-react';

import './ScenarioEditor.css';

class ScenarioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            saving: false,
            saveMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            saveMessage: ''
        });
    }

    async handleSubmit() {
        if (!this.state.title || !this.state.description) {
            this.setState({
                saveMessage:
                    'A title and description are required for Teacher Moments'
            });
            return;
        }
        this.setState({ saving: true });
        const data = JSON.stringify({
            title: this.state.title,
            description: this.state.description
        });
        const saveResponse = await (await fetch('/api/scenarios', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        })).json();
        if (saveResponse.status === 201 || saveResponse.status === 200) {
            this.setState({ saving: false, saveMessage: 'Saved!' });
        } else if (saveResponse.error) {
            this.setState({ saving: false, saveMessage: saveResponse.message });
        }
    }

    render() {
        return (
            <Container fluid className="tm__scenario-editor">
                <h2>Teacher Moment Details</h2>
                <Form size={'big'}>
                    <Form.Input
                        focus
                        required
                        label="Title"
                        name="title"
                        onChange={this.handleChange}
                    />
                    <Form.TextArea
                        focus
                        required
                        label="Moment Description"
                        name="description"
                        onChange={this.handleChange}
                    />
                    <Grid divided="vertically">
                        <Grid.Row columns={2}>
                            <Grid.Column width={3}>
                                {this.state.saving ? (
                                    <Form.Button
                                        type="submit"
                                        className="tm__scenario-save"
                                        primary
                                        loading
                                    />
                                ) : (
                                    <Form.Button
                                        type="submit"
                                        className="tm__scenario-save"
                                        primary
                                        onClick={this.handleSubmit}
                                    >
                                        Submit
                                    </Form.Button>
                                )}
                            </Grid.Column>
                            <Grid.Column>{this.state.saveMessage}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form>
            </Container>
        );
    }
}

export default hot(module)(ScenarioEditor);
