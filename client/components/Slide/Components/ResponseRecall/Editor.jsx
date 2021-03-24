import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Form, Segment, Table } from '@components/UI';
import { type } from './meta';

const ResponsePromptFormatted = ({ title, prompt, header, isConditional }) => {
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

ResponsePromptFormatted.propTypes = {
  title: PropTypes.string,
  prompt: PropTypes.string,
  header: PropTypes.string,
  isConditional: PropTypes.bool
};

class ResponseRecallEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      components: null
    };

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
  }

  onChange(event, { name, value }) {
    console.log(this.props.value);
    this.props.onChange({
      ...this.props.value,
      type,
      // recallId: selected value
      // recallSharedWithRoles: []
      [name]: value
    });
  }

  render() {
    const {
      scenario,
      slideId,
      value: { recallId, recallSharedWithRoles }
    } = this.props;
    const { components } = this.state;
    const { onChange } = this;

    if (!components) {
      return null;
    }

    const isMultiParticipant = scenario.personas.length > 1;

    const prompts = components.reduce((accum, component, key) => {
      const {
        header,
        index,
        isConditional,
        prompt,
        responseId,
        slide
      } = component;

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
        <ResponsePromptFormatted
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

    if (!prompts.length) {
      prompts.push({
        key: 'recall-response-missing',
        text: 'No participant responses available',
        value: null
      });
    } else {
      prompts.unshift({
        key: 'recall-response-default',
        text: 'No participant response embed has been selected',
        value: null
      });
    }

    const defaultValue = recallId || null;
    const selectResponsePromptDropdown = (
      <Dropdown
        fluid
        selection
        name="recallId"
        defaultValue={defaultValue}
        onChange={onChange}
        options={prompts}
      />
    );

    const displayParticipantResponseLabel = isMultiParticipant
      ? 'Select the prompt for which you want a response to be displayed: '
      : "If you want to display a participant's response to another prompt: ";

    const selectPromptFormFieldLabelled = (
      <Form.Field.Labelled
        style={{ marginBottom: '1rem' }}
        label={displayParticipantResponseLabel}
        content={selectResponsePromptDropdown}
      />
    );

    const selectedPrompt = recallId
      ? prompts.find(({ value }) => value === recallId)
      : null;

    const selectedPromptContent = selectedPrompt
      ? selectedPrompt.content
      : null;

    const personaOptions = isMultiParticipant
      ? scenario.personas.map(persona => ({
          key: persona.id,
          value: persona.id,
          text: persona.name
        }))
      : null;

    const selectPersonasLabel =
      'Select personas that will share this response:';
    const selectAllPersonasLabel = 'Select all personas';

    const personasSelect = isMultiParticipant ? (
      <Dropdown
        fluid
        multiple
        search
        selection
        name="recallSharedWithRoles"
        aria-label={selectPersonasLabel}
        onChange={onChange}
        options={personaOptions}
        value={recallSharedWithRoles || []}
      />
    ) : null;

    const selectPersonasFormFieldLabelled = isMultiParticipant ? (
      <Form.Field.Labelled
        label={selectPersonasLabel}
        content={personasSelect}
      />
    ) : null;

    const selectAllPersonas = isMultiParticipant ? (
      <Button
        fluid
        icon="arrow left"
        labelPosition="left"
        className="icon-primary"
        content={selectAllPersonasLabel}
        onClick={() => {
          const value = scenario.personas.map(({ id }) => id);
          onChange(
            {},
            {
              name: 'recallSharedWithRoles',
              value
            }
          );
        }}
      />
    ) : null;

    const selectAllPersonasFormFieldLabelled = isMultiParticipant ? (
      <Form.Field.Labelled label="&nbsp;" content={selectAllPersonas} />
    ) : null;

    const shareResponseGroup = isMultiParticipant ? (
      <Form.Group widths="equal">
        {selectPersonasFormFieldLabelled}
        {selectAllPersonasFormFieldLabelled}
      </Form.Group>
    ) : null;

    return this.props.isEmbedded ? (
      <Segment>
        {selectPromptFormFieldLabelled}
        {selectedPromptContent}
        {shareResponseGroup}
      </Segment>
    ) : (
      <Form>
        {selectPromptFormFieldLabelled}
        {selectedPromptContent}
        {shareResponseGroup}
      </Form>
    );
  }
}

ResponseRecallEditor.defaultProps = {
  isEmbedded: false
};

ResponseRecallEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  isEmbedded: PropTypes.bool,
  recallId: PropTypes.string,
  recallSharedWithRoles: PropTypes.array,
  scenario: PropTypes.object,
  slideId: PropTypes.any,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    recallId: PropTypes.string,
    recallSharedWithRoles: PropTypes.array,
    type: PropTypes.oneOf([type]),
    components: PropTypes.array
  })
};

export default ResponseRecallEditor;
