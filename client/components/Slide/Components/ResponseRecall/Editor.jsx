import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Form, Table } from '@components/UI';
import { type } from './meta';

const ResponsePromptFormatted = ({ title, prompt, header }) => {
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
      </Table.Body>
    </Table>
  );
};

ResponsePromptFormatted.propTypes = {
  title: PropTypes.string,
  prompt: PropTypes.string,
  header: PropTypes.string
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

    this.setState({ components });
  }

  onChange(event, { name, value }) {
    this.props.onChange({
      type,
      // recallId: selected value
      [name]: value
    });
  }

  render() {
    const {
      slideId,
      value: { recallId }
    } = this.props;
    const { components } = this.state;
    const { onChange } = this;

    if (!components) {
      return null;
    }

    const prompts = components.reduce((accum, component, key) => {
      const { header, index, prompt, responseId, slide } = component;

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
      const title = `Slide #${index} ${quotedSlideTitle}`;
      const content = (
        <ResponsePromptFormatted
          title={title}
          prompt={prompt}
          header={header}
        />
      );

      const text = `Slide #${index}: "${prompt}"`;
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
        value: -1
      });
    } else {
      prompts.unshift({
        key: 'recall-response-default',
        text: 'No participant response embed has been selected',
        value: -1
      });
    }

    const defaultValue = recallId || -1;
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

    const formFieldLabelled = (
      <Form.Field.Labelled
        style={{ marginBottom: '1rem' }}
        label="If you want to display a participant's response to another prompt: "
        content={selectResponsePromptDropdown}
      />
    );

    const selectedPrompt = recallId
      ? prompts.find(({ value }) => value === recallId)
      : null;

    const selectedPromptContent = selectedPrompt
      ? selectedPrompt.content
      : null;

    return this.props.isEmbedded ? (
      <Fragment>
        {formFieldLabelled}
        {selectedPromptContent}
      </Fragment>
    ) : (
      <Form>
        {formFieldLabelled}
        {selectedPromptContent}
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
  scenario: PropTypes.object,
  slideId: PropTypes.any,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf([type]),
    recallId: PropTypes.string,
    components: PropTypes.array
  })
};

export default ResponseRecallEditor;
