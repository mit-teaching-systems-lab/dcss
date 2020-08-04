import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import {
  Button,
  Container,
  Form,
  Grid,
  Menu,
  Popup,
  Ref
} from '@components/UI';

import ConfirmAuth from '@components/ConfirmAuth';
import EditorMenu from '@components/EditorMenu';
import { makeDefaultDescription } from '@components/Editor/scenario';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import { AuthorDropdown, CategoriesDropdown } from './DropdownOptions';
import ScenarioAuthors from './ScenarioAuthors';
import RichTextEditor from '@components/RichTextEditor';

import { getScenario, setScenario } from '@actions/scenario';
import { getCategories } from '@actions/tags';
import { getUsersByPermission } from '@actions/users';

import './scenarioEditor.css';

function createSectionDef(label) {
  return {
    label,
    node: React.createRef(),
    offsetTop: 0
  };
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

    this.leftcolRef = React.createRef();
    this.leftcol = {
      title: createSectionDef('Title'),
      description: createSectionDef('Description'),
      categories: createSectionDef('Categories'),
      consentprose: createSectionDef('Consent Agreement'),
      finish: createSectionDef('Finish Slide')
    };

    this.debouncer = null;
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConsentChange = this.onConsentChange.bind(this);
    this.onFinishSlideChange = this.onFinishSlideChange.bind(this);
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
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

    if (!scenario.title) {
      notify({
        type: 'error',
        message: `Scenario title cannot be empty.`
      });
      return;
    }

    if (!scenario.description) {
      // If description is any kind of falsy value, ensure that
      // it's saved as an empty string.
      scenario.description = '';
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

  scrollIntoView(name) {
    let top = this.leftcolRef.scrollHeight;
    Object.values(this.leftcol).forEach(({ offsetTop }) => {
      top = Math.min(top, offsetTop);
    });
    this.leftcolRef.scrollTo(0, this.leftcol[name].offsetTop - top);
  }

  render() {
    const {
      onChange,
      onConsentChange,
      onFinishSlideChange,
      scrollIntoView
    } = this;
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
    const innerRef = (node, name) => {
      if (node) {
        this.leftcol[name].node = node;
        this.leftcol[name].offsetTop = node.offsetTop;
      }
    };

    const formInputTitle = (
      <Ref innerRef={node => innerRef(node, 'title')}>
        <Form.Field>
          <label htmlFor="title">Title</label>
          <Form.Input
            focus
            required
            autoComplete="off"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
          />
        </Form.Field>
      </Ref>
    );

    const descriptionDefaultValue =
      this.props.scenarioId === 'new'
        ? makeDefaultDescription(scenario)
        : scenario.description;

    const textAreaDescription = (
      <Ref innerRef={node => innerRef(node, 'description')}>
        <Form.Field>
          <label htmlFor="description">Description</label>
          <Form.TextArea
            required
            autoComplete="off"
            id="description"
            name="description"
            rows={1}
            value={descriptionDefaultValue}
            onChange={onChange}
          />
        </Form.Field>
      </Ref>
    );

    const rteConsent =
      scenarioId !== 'new' ? (
        <Ref innerRef={node => innerRef(node, 'consentprose')}>
          <Form.Field required>
            <label htmlFor="consentprose">Consent Agreement</label>
            {consentAgreementValue ? (
              <RichTextEditor
                id="consentprose"
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
        </Ref>
      ) : null;

    const rteFinish =
      scenarioId !== 'new' ? (
        <Ref innerRef={node => innerRef(node, 'finish')}>
          <Form.Field>
            <label htmlFor="finish">
              After a scenario has been completed, the participant will be shown
              this:
            </label>
            <RichTextEditor
              id="finish"
              defaultValue={finish.components[0].html}
              onChange={onFinishSlideChange}
              options={{
                buttons: 'suggestion',
                minHeight: '200px'
              }}
            />
          </Form.Field>
        </Ref>
      ) : null;

    const dropdowns = (
      <ConfirmAuth requiredPermission="edit_scenario">
        {this.state.authors.length && scenarioId === 'new' ? (
          <AuthorDropdown
            author={author}
            options={this.state.authors}
            onChange={onChange}
          />
        ) : null}
        {this.state.categories.length ? (
          <Ref innerRef={node => innerRef(node, 'categories')}>
            <CategoriesDropdown
              options={this.state.categories}
              categories={categories}
              onChange={onChange}
            />
          </Ref>
        ) : null}
      </ConfirmAuth>
    );

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

    const left = Object.entries(this.leftcol).map(
      ([name, { label }], index) => (
        <Menu.Item.Tabbable
          icon
          key={Identity.key({ label, index })}
          onClick={() => scrollIntoView(name)}
        >
          {label}
        </Menu.Item.Tabbable>
      )
    );

    // const hideEditorMenu = !location.href.includes('localhost');
    // const editorMenu = hideEditorMenu ? null : (
    const editorMenu =
      scenarioId !== 'new' ? (
        <EditorMenu
          text
          className="em__sticky se_em__sticky-special"
          type="scenario authors"
          items={{ left }}
        />
      ) : null;

    // const isTestEnv = location.href.includes('localhost');
    const isTestEnv = true;
    const styleHeight = {
      height: '500px'
    };
    const leftColBottomStyle = scenarioId !== 'new' ? styleHeight : {};

    return (
      <Form>
        <Container fluid>
          <Grid columns={2} divided>
            <Grid.Row className="se__grid-nowrap">
              <Ref innerRef={node => (this.leftcolRef = node)}>
                <Grid.Column className={leftColumnClassName} width={8}>
                  {editorMenu}
                  <Popup
                    inverted
                    content="Enter a title for your scenario. This will appear on the scenario 'entry' slide."
                    trigger={formInputTitle}
                    {...popupProps}
                  />
                  <Popup
                    inverted
                    content="Enter a description for your scenario. This will appear on the scenario 'entry' slide."
                    trigger={textAreaDescription}
                    {...popupProps}
                  />

                  {isTestEnv ? dropdowns : null}

                  {scenarioId !== 'new' ? (
                    <Fragment>
                      {rteConsent}
                      {rteFinish}
                    </Fragment>
                  ) : (
                    <Button
                      type="submit"
                      primary
                      onClick={onCreateScenarioClick}
                    >
                      Create this scenario
                    </Button>
                  )}

                  <div style={leftColBottomStyle}></div>
                </Grid.Column>
              </Ref>
              <Grid.Column
                className="se__grid-column-width-constraint"
                width={8}
              >
                {!isTestEnv ? dropdowns : null}

                {isTestEnv && scenarioId !== 'new' ? (
                  <ScenarioAuthors scenario={scenario} />
                ) : null}
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
