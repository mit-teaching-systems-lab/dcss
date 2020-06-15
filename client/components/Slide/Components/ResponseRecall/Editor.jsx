import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Table } from 'semantic-ui-react';
import FormField from '@components/FormField';
import { type } from './meta';

class ResponseRecallEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      components: null
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.fetchResponseComponents();
  }

  async fetchResponseComponents() {
    const { scenarioId } = this.props;
    const response = await fetch(
      `/api/scenarios/${scenarioId}/slides/response-components`
    );

    const { components, status } = await response.json();

    if (status === 200) {
      this.setState({ components });
    }
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
      slideIndex,
      value: { recallId }
    } = this.props;
    const { components } = this.state;
    const { onChange } = this;

    if (!components) {
      return null;
    }

    const prompts = components.reduce((accum, component, key) => {
      const {
        header,
        index: nonZeroIndex,
        prompt,
        responseId,
        slide: { title }
      } = component;

      const index = nonZeroIndex - 1;

      // Don't include empty/incomplete prompts
      // Don't include prompts from THIS slide
      if (!responseId || slideIndex === index) {
        return accum;
      }

      const slideTitle = title ? ` "${title}"` : ``;
      const text = `Slide #${nonZeroIndex} ${slideTitle}: "${prompt}"`;
      const content = (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">
                Slide #{nonZeroIndex}
                {slideTitle}
              </Table.HeaderCell>
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

    return (
      <FormField
        style={{ marginBottom: '1rem' }}
        label="Select a participant's previous response for display in this slide: "
        content={
          <Dropdown
            defaultValue={defaultValue}
            selection
            fluid
            name="recallId"
            onChange={onChange}
            options={prompts}
          />
        }
      />
    );
  }
}

ResponseRecallEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  recallId: PropTypes.any,
  scenarioId: PropTypes.any,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf([type]),
    recallId: PropTypes.string,
    components: PropTypes.array
  })
};

export default ResponseRecallEditor;
