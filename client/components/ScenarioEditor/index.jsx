import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Form, Grid, Popup } from '@components/UI';
import { getScenario, setScenario } from '@actions/scenario';
import { getCategories } from '@actions/tags';
import { getUsersByPermission } from '@actions/users';

import ConfirmAuth from '@components/ConfirmAuth';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import { AuthorDropdown, CategoriesDropdown } from './DropdownOptions';
import RichTextEditor from '@components/RichTextEditor';
import './scenarioEditor.css';

class ScenarioEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      authors: [],
      categories: []
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConsentChange = this.onConsentChange.bind(this);
    this.onFinishSlideChange = this.onFinishSlideChange.bind(this);
  }

  async componentDidMount() {
    const {
      setScenario,
      getScenario,
      getUsersByPermission,
      getCategories,
      scenarioId,
      tags
    } = this.props;

    if (scenarioId === 'new') {
      setScenario(null);
    } else {
      await getScenario(scenarioId);
    }

    const authors = await getUsersByPermission('create_scenario');

    let { categories } = tags;

    // Either the existing categories have been loaded,
    // or fetch categories to fill the default value
    if (!categories.length) {
      categories = await getCategories();
    }

    this.setState({
      isReady: true,
      categories,
      authors
    });
  }

  onChange(event, { name, value }) {
    this.props.setScenario({ [name]: value });

    // Only auto-save after initial
    // save of new scenario
    // NOTE: temporarily disabling this until we
    // have a better strategy for auto saving details
    // on this page.
    if (this.props.scenarioId !== 'new') {
      this.onSubmit();
    }
  }

  onConsentChange(value) {
    let { id, prose } = this.props.consent;

    if (prose !== value) {
      id = null;
      prose = value;
      this.onChange(event, {
        name: 'consent',
        value: {
          id,
          prose
        }
      });
    }
  }

  onFinishSlideChange(html) {
    const {
      components: [existing],
      id,
      is_finish,
      title
    } = this.props.finish;

    if (!existing || (existing && existing.html !== html)) {
      this.onChange(event, {
        name: 'finish',
        value: {
          components: [{ html, type: 'Text' }],
          id,
          is_finish,
          title
        }
      });
    }
  }

  async onSubmit() {
    const {
      author,
      categories = [],
      consent,
      description,
      finish,
      postSubmitCB,
      status,
      submitCB,
      title
    } = this.props;

    if (!title || !description) {
      notify({
        type: 'info',
        message: 'A title and description are required for saving scenarios'
      });
      return;
    }

    const data = {
      author,
      categories,
      consent,
      description,
      finish,
      status,
      title
    };

    const response = await (await submitCB(data)).json();

    let message = '';
    switch (response.status) {
      case 200: {
        message = 'Scenario saved';
        break;
      }
      case 201: {
        message = 'Scenario created';
        break;
      }
      default:
        if (response.message) {
          message = response.message;
        }
        break;
    }
    notify({ message });

    if (postSubmitCB) {
      postSubmitCB(response.scenario);
    }
  }

  render() {
    const { onChange, onConsentChange, onFinishSlideChange, onSubmit } = this;
    const {
      author,
      categories,
      consent,
      description,
      finish,
      scenarioId,
      title
    } = this.props;

    const { isReady } = this.state;

    if (!isReady || !finish.components[0]) {
      return <Loading />;
    }

    const consentAgreementValue = consent.prose || '';

    return (
      <Form size={'big'}>
        <Container fluid>
          <Grid columns={2} divided>
            <Grid.Row className="scenarioeditor__grid-nowrap">
              <Grid.Column
                width={6}
                className="scenarioeditor__grid-column-min-width"
              >
                <Popup
                  size="small"
                  content="Enter a title for your scenario. This will appear on the scenario 'entry' slide."
                  trigger={
                    <Form.Input
                      focus
                      required
                      label="Title"
                      name="title"
                      value={title}
                      onChange={onChange}
                    />
                  }
                />
                <Popup
                  size="small"
                  content="Enter a description for your scenario. This will appear on the scenario 'entry' slide."
                  trigger={
                    <Form.TextArea
                      focus="true"
                      required
                      label="Description"
                      name="description"
                      value={description}
                      onChange={onChange}
                    />
                  }
                />

                {scenarioId !== 'new' && (
                  <Popup
                    size="small"
                    content="Enter Consent Agreement prose here, or use the default provided Consent Agreement. This will appear on the scenario 'entry' slide."
                    trigger={
                      <Form.Field required>
                        <label>Consent Agreement</label>
                        {consentAgreementValue ? (
                          <RichTextEditor
                            defaultValue={consent.prose}
                            name="consentprose"
                            onChange={onConsentChange}
                            options={{
                              buttons: 'suggestion',
                              minHeight: '150px'
                            }}
                          />
                        ) : null}
                      </Form.Field>
                    }
                  />
                )}

                {scenarioId === 'new' ? (
                  <Button type="submit" primary onClick={onSubmit}>
                    Create this scenario
                  </Button>
                ) : null}
              </Grid.Column>
              <Grid.Column
                width={6}
                className="scenarioeditor__grid-column-min-width"
              >
                <ConfirmAuth requiredPermission="edit_scenario">
                  {this.state.authors.length ? (
                    <AuthorDropdown
                      author={author}
                      options={this.state.authors}
                      onChange={onChange}
                    />
                  ) : null}
                  {this.state.categories.length ? (
                    <CategoriesDropdown
                      options={this.state.categories}
                      categories={categories}
                      onChange={onChange}
                    />
                  ) : null}
                </ConfirmAuth>

                {/*
                TODO: create the same Dropdown style thing
                        for displaying and selecting
                        available topics (if any exist)

                */}

                {scenarioId !== 'new' && finish && (
                  <Popup
                    size="small"
                    content="This will appear on the slide that's shown after the scenario has been completed."
                    trigger={
                      <Form.Field>
                        <label>
                          After a scenario has been completed, the participant
                          will be shown this:
                        </label>
                        <RichTextEditor
                          defaultValue={finish.components[0].html}
                          onChange={onFinishSlideChange}
                          options={{
                            buttons: 'suggestion',
                            minHeight: '200px'
                          }}
                        />
                      </Form.Field>
                    }
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Form>
    );
  }
}

ScenarioEditor.propTypes = {
  getUsersByPermission: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  getScenario: PropTypes.func.isRequired,
  scenarioId: PropTypes.node.isRequired,
  setScenario: PropTypes.func.isRequired,
  submitCB: PropTypes.func.isRequired,
  postSubmitCB: PropTypes.func,
  author: PropTypes.object,
  title: PropTypes.string,
  categories: PropTypes.array,
  consent: PropTypes.shape({
    id: PropTypes.number,
    prose: PropTypes.string
  }),
  description: PropTypes.string,
  finish: PropTypes.object,
  status: PropTypes.number,
  tags: PropTypes.shape({
    categories: PropTypes.array
  })
};

const mapStateToProps = (state, ownProps) => {
  const {
    scenario: {
      author,
      categories,
      consent,
      description,
      finish,
      status,
      title
    },
    user,
    tags
  } = state;

  if (ownProps.scenarioId === 'new') {
    Object.assign(author, user);
  }

  return {
    author,
    categories,
    consent,
    description,
    finish,
    status,
    title,
    tags
  };
};

const mapDispatchToProps = dispatch => ({
  getScenario: id => dispatch(getScenario(id)),
  setScenario: params => dispatch(setScenario(params)),
  getCategories: () => dispatch(getCategories()),
  getUsersByPermission: permission => dispatch(getUsersByPermission(permission))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioEditor);
