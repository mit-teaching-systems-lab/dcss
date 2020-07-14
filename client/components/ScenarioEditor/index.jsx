import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { diff } from 'deep-object-diff';

import { Button, Container, Form, Grid, Popup } from '@components/UI';
import { getScenario, setScenario } from '@actions/scenario';
import { getCategories } from '@actions/tags';
import { getUsersByPermission } from '@actions/users';

import ConfirmAuth from '@components/ConfirmAuth';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import { AuthorDropdown, CategoriesDropdown } from './DropdownOptions';
import ScenarioAuthors from './ScenarioAuthors';
import RichTextEditor from '@components/RichTextEditor';
import './scenarioEditor.css';

function makeDefaultDescription({ title, description }) {
  let returnValue = description;
  if (!returnValue && title) {
    returnValue = `A scenario about "${title}"`;
  }
  return returnValue;
}

class ScenarioEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      authors: [],
      reviewers: [],
      categories: []
    };

    this.debouncer = null;
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConsentChange = this.onConsentChange.bind(this);
    this.onFinishSlideChange = this.onFinishSlideChange.bind(this);
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
  }

  onBeforeUnload() {
    if (this.props.scenarioId !== 'new') {
      this.onSubmit();
    }
  }

  componentWillUnmount() {
    if (this.debouncer) {
      clearTimeout(this.debouncer);
    }
    window.removeEventListener('beforeunload', this.onBeforeUnload);
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

    const authors = await getUsersByPermission('edit_scenario');

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

    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  async onChange(event, { name, value }) {
    const { scenario } = await this.props.setScenario({
      ...this.props.scenario,
      [name]: value
    });

    // Only auto-save after scenario has been created.
    if (this.props.scenarioId !== 'new') {
      if (this.debouncer) {
        clearTimeout(this.debouncer);
      }
      this.debouncer = setTimeout(() => {
        this.onSubmit(scenario);
      }, 1000);
    }
  }

  onConsentChange(value) {
    let { id, prose } = this.props.scenario.consent;

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
    } = this.props.scenario.finish;

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

  async onSubmit(updatedScenario) {
    const { postSubmitCB, submitCB } = this.props;
    const scenario = updatedScenario || this.props.scenario;

    if (!scenario.description) {
      scenario.description = makeDefaultDescription(scenario);
    }

    if (!scenario.title || !scenario.description) {
      notify({
        type: 'error',
        message: 'A title and description are required for saving scenarios.'
      });
      return;
    }

    const response = await (await submitCB(scenario)).json();

    let type = 'success';
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
          type = response.error ? 'error' : type;
          message = response.message;
        }
        break;
    }
    notify({ type, message });

    if (response.error) {
      return;
    }

    if (postSubmitCB) {
      postSubmitCB(response.scenario);
    }
  }

  render() {
    const { onChange, onConsentChange, onFinishSlideChange } = this;
    const {
      scenarioId,
      scenario,
      scenario: { author, categories, consent, finish, title }
    } = this.props;

    const { isReady } = this.state;

    if (!isReady || !finish.components[0]) {
      return <Loading />;
    }

    const consentAgreementValue = consent.prose || '';

    const formInputTitle = (
      <Form.Field>
        <label htmlFor="title">Title</label>
        <Form.Input
          focus
          required
          id="title"
          name="title"
          value={title}
          onChange={onChange}
        />
      </Form.Field>
    );

    const descriptionDefaultValue = makeDefaultDescription(scenario);

    const textAreaDescription = (
      <Form.Field>
        <label htmlFor="description">Description</label>
        <Form.TextArea
          required
          focus="true"
          id="description"
          name="description"
          rows={1}
          value={descriptionDefaultValue}
          onChange={onChange}
        />
      </Form.Field>
    );

    const rteConsent =
      scenarioId !== 'new' ? (
        <Form.Field required>
          <label>Consent Agreement</label>
          {consentAgreementValue ? (
            <RichTextEditor
              name="consentprose"
              defaultValue={consent.prose}
              onChange={onConsentChange}
              options={{
                buttons: 'suggestion',
                minHeight: '150px'
              }}
            />
          ) : null}
        </Form.Field>
      ) : null;

    const rteFinish =
      scenarioId !== 'new' ? (
        <Form.Field>
          <label>
            After a scenario has been completed, the participant will be shown
            this:
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
      ) : null;

    // This call is wrapped to prevent the form submit handler from
    // sending an event object to the "onSubmit" handler method.
    const onCreateScenarioClick = () => this.onSubmit();

    const popupProps =
      scenarioId === 'new'
        ? { size: 'large', position: 'right center', hideOnScroll: true }
        : { disabled: true };

    const leftColumnClassName =
      scenarioId !== 'new'
        ? 'se__grid-column-height-constraint se__grid-column-width-constraint'
        : '';

    return (
      <Form>
        <Container fluid>
          <Grid columns={2} divided>
            <Grid.Row className="se__grid-nowrap">
              <Grid.Column className={leftColumnClassName} width={6}>
                <Popup
                  content="Enter a title for your scenario. This will appear on the scenario 'entry' slide."
                  trigger={formInputTitle}
                  {...popupProps}
                />
                <Popup
                  content="Enter a description for your scenario. This will appear on the scenario 'entry' slide."
                  trigger={textAreaDescription}
                  {...popupProps}
                />

                {scenarioId !== 'new' ? (
                  <Fragment>
                    {rteConsent}
                    {rteFinish}
                  </Fragment>
                ) : (
                  <Button type="submit" primary onClick={onCreateScenarioClick}>
                    Create this scenario
                  </Button>
                )}
              </Grid.Column>
              <Grid.Column
                width={9}
                className="se__grid-column-width-constraint"
              >
                {scenarioId !== 'new' ? (
                  <ScenarioAuthors scenario={scenario} />
                ) : null}

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
  postSubmitCB: PropTypes.func,
  scenarioId: PropTypes.node.isRequired,
  scenario: PropTypes.shape({
    author: PropTypes.object,
    categories: PropTypes.array,
    consent: PropTypes.shape({
      id: PropTypes.number,
      prose: PropTypes.string
    }),
    description: PropTypes.string,
    finish: PropTypes.object,
    lock: PropTypes.object,
    status: PropTypes.number,
    title: PropTypes.string,
    users: PropTypes.array
  }),
  setScenario: PropTypes.func.isRequired,
  submitCB: PropTypes.func.isRequired,
  tags: PropTypes.shape({
    categories: PropTypes.array
  }),
  user: PropTypes.object,
  users: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const { scenario, tags, user, users } = state;

  if (ownProps.scenarioId === 'new') {
    Object.assign(scenario.author, user);
  }
  return {
    // author,
    // categories,
    // consent,
    // description,
    // finish,
    // status,
    // title,
    scenario,
    tags,
    user,
    users
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
