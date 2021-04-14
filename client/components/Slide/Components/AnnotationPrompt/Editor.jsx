import React from 'react';
import PropTypes from 'prop-types';
import DataHeader from '@components/Slide/Components/DataHeader';
import { Button, Dropdown, Form, Table } from '@components/UI';
import Identity from '@utils/Identity';
import { type } from './meta';

const AnnotationPromptFormatted = ({
  title,
  prompt,
  header,
  isConditional
}) => {
  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="2">{title}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell collapsing>Prompt:</Table.Cell>
          <Table.Cell>{prompt}</Table.Cell>
        </Table.Row>
        {header ? (
          <Table.Row>
            <Table.Cell collapsing>Data header:</Table.Cell>
            <Table.Cell>{header}</Table.Cell>
          </Table.Row>
        ) : null}
        {isConditional ? (
          <Table.Row>
            <Table.Cell colSpan={2}>
              This prompt appears conditionally.
            </Table.Cell>
          </Table.Row>
        ) : null}
      </Table.Body>
    </Table>
  );
};

AnnotationPromptFormatted.propTypes = {
  title: PropTypes.string,
  prompt: PropTypes.string,
  header: PropTypes.string,
  isConditional: PropTypes.bool
};

class AnnotationPromptEditor extends React.Component {
  constructor(props) {
    super(props);

    const { header, question, prompts, responseId } = props.value;

    this.state = {
      components: null,
      header,
      question,
      prompts,
      responseId
    };
    this.timeout = null;
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    const { scenario } = this.props;
    // TODO: move to async action
    const { components } = await (await fetch(
      `/api/scenarios/${scenario.id}/slides/prompt-components`
    )).json();

    if (!this.hasUnmounted) {
      this.setState({ components });
    }
  }

  componentWillUnmount() {
    this.hasUnmounted = true;

    clearTimeout(this.timeout);

    const { header, prompts, question, responseId } = this.props.value;
    const lastProps = {
      header,
      prompts,
      question,
      responseId
    };

    if (Identity.key(this.state) !== Identity.key(lastProps)) {
      this.updateState();
    }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.updateState, 500);
  }

  updateState() {
    const { header, question, responseId, prompts } = this.state;
    this.props.onChange({
      ...this.props.value,
      header,
      question,
      responseId,
      prompts,
      type
    });
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  render() {
    const {
      slideId,
      value: { header = '', prompts = [], question = '' }
    } = this.props;
    const { components } = this.state;
    const { onChange, updateState } = this;

    if (!components) {
      return null;
    }

    const reviewables = components.reduce((accum, component, key) => {
      const { header, isConditional, prompt, responseId, slide } = component;

      // Don't include empty/incomplete prompts
      // Don't include prompts from THIS slide
      // Don't include components with `disableEmbed: true`
      if (
        !responseId ||
        slideId === component.slide.id ||
        component.disableEmbed
      ) {
        return accum;
      }

      const quotedSlideTitle = slide.title ? ` "${slide.title}"` : ``;
      const title = `Slide #${slide.slide_number} ${quotedSlideTitle}`;
      const content = (
        <AnnotationPromptFormatted
          title={title}
          prompt={prompt}
          header={header}
          isConditional={isConditional}
        />
      );

      const text = `Slide #${slide.slide_number}: "${prompt}"`;
      accum.push({
        key: `recall-response-${key}`,
        text,
        content,
        value: responseId
      });

      return accum;
    }, []);

    if (!reviewables.length) {
      reviewables.push({
        key: 'recall-response-missing',
        text: 'No participant responses available',
        value: null
      });
    }

    const defaultValue = prompts || [];
    const selectAnnotationDropdown = (
      <Dropdown
        fluid
        multiple
        selection
        name="prompts"
        value={defaultValue}
        onChange={(event, { name, value }) => {
          onChange(event, {
            name,
            value: value.filter(Boolean)
          });
        }}
        options={reviewables}
      />
    );

    const displayParticipantAnnotationLabel = `Select the prompts to be reviewed by the participant:`;

    const selectAnnotationPromptsFormFieldLabelled = (
      <Form.Field.Labelled
        label={displayParticipantAnnotationLabel}
        content={selectAnnotationDropdown}
      />
    );

    // const selectedPrompts = prompts.length
    //   ? reviewables.filter(reviewable => prompts.includes(reviewable.responseId))
    //   : [];

    // const selectedPromptContent = selectedPrompts.length ? (
    //   <Fragment>
    //     {selectedPrompts.map(selected => selected.content)}
    //   </Fragment>
    // ) : null

    const selectAllPromptsLabel = 'Select all prompts';

    const selectAllPrompts = (
      <Button
        fluid
        icon="arrow left"
        labelPosition="left"
        className="icon-primary"
        content={selectAllPromptsLabel}
        onClick={() => {
          const name = 'prompts';
          const value = reviewables.map(prompt => prompt.value).filter(Boolean);
          onChange(
            {},
            {
              name,
              value
            }
          );
        }}
      />
    );

    const selectAllPromptsFormFieldLabelled = (
      <Form.Field.Labelled label="&nbsp;" content={selectAllPrompts} />
    );

    const questionAriaLabel = 'Question to ask about these prompts:';

    return (
      <Form>
        <Form.TextArea
          required
          name="question"
          label={questionAriaLabel}
          aria-label={questionAriaLabel}
          rows={1}
          defaultValue={question}
          onChange={onChange}
          onBlur={updateState}
        />

        <Form.Group widths="equal">
          {selectAnnotationPromptsFormFieldLabelled}
          {selectAllPromptsFormFieldLabelled}
        </Form.Group>

        <DataHeader content={header} onChange={onChange} onBlur={updateState} />
      </Form>
    );
  }
}

AnnotationPromptEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  slideId: PropTypes.any,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    header: PropTypes.string,
    prompts: PropTypes.array,
    question: PropTypes.string,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default AnnotationPromptEditor;
