import React from 'react';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
import Identity from '@utils/Identity';
import {
  Container,
  ColorPicker,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Table
} from '@components/UI';
import { type } from './meta';
import { html } from './html';
import EditorMenu from '@components/EditorMenu';
import DataHeader from '@components/Slide/Components/DataHeader';
import Sortable from '@components/Sortable';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import SlideComponents from '@components/SlideComponents';
import MultiPathNetworkGraphModal from './MultiPathNetworkGraphModal';
import '@components/Slide/SlideEditor/SlideEditor.css';
import './MultiPathResponse.css';

class MultiPathResponseEditor extends React.Component {
  constructor(props) {
    super(props);

    const {
      header = '',
      /*
      {
          color: "#HHHHHH" | "colorname" | #73b580 (default)
          display: "Text on button",
          id: Slide id,
      }
      */
      paths = [],
      prompt = '',
      recallId = '',
      responseId = ''
    } = props.value;

    const open = false;

    this.state = {
      isReady: false,
      header,
      prompt,
      paths,
      open,
      recallId,
      responseId
    };

    this.slides = [];
    this.onPathAddClick = this.onPathAddClick.bind(this);
    this.onPathDeleteClick = this.onPathDeleteClick.bind(this);
    this.onPathDetailChange = this.onPathDetailChange.bind(this);
    this.onPathOrderChange = this.onPathOrderChange.bind(this);
    this.onPathSearchChange = this.onPathSearchChange.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onRecallChange = this.onRecallChange.bind(this);
    this.onViewGraphClick = this.onViewGraphClick.bind(this);

    this.updateState = this.updateState.bind(this);
    this.preventEmptyButtonField = this.preventEmptyButtonField.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
  }

  async componentDidMount() {
    const { scenario } = this.props;

    // TODO: move to async action
    const { slides } = await (await fetch(
      `/api/scenarios/${scenario.id}/slides`
    )).json();
    this.slides = slides;
    this.setState({
      isReady: true
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    // This is disabled until it's failures can be investigated.
    //
    //
    // const { header, prompt, paths, recallId, responseId } = this.props.value;
    // const propsValue = {
    //   header,
    //   prompt,
    //   paths,
    //   recallId,
    //   responseId
    // };

    // let stateValue;

    // {
    //   const { header, prompt, paths, recallId, responseId } = this.state;

    //   stateValue = {
    //     header,
    //     prompt,
    //     paths,
    //     recallId,
    //     responseId
    //   };
    // }

    // if (Identity.key(stateValue) !== Identity.key(propsValue)) {
    //   this.updateState();
    // }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this.updateState, 500);
  }

  updateState() {
    const { paths, header, prompt, recallId, responseId } = this.state;

    this.props.onChange({
      paths,
      header,
      prompt,
      recallId,
      responseId,
      type
    });
  }

  onRecallChange({ recallId }) {
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ recallId }, this.updateState);
  }

  onPathAddClick() {
    const { paths } = this.state;
    paths.push({
      display: '',
      value: null
    });
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ paths }, this.updateState);
  }

  onPathDeleteClick(index) {
    const paths = this.state.paths.slice();
    paths.splice(index, 1);
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ paths }, this.updateState);
  }

  onPathOrderChange(fromIndex, toIndex) {
    this.moveButton(fromIndex, toIndex);
  }

  onPathDetailChange(event, { index, options, name, value }) {
    if (value === -1) {
      return;
    }
    const { paths } = this.state;
    paths[index][name] = value;

    if (!paths[index].display.trim()) {
      const { text } =
        options.find(option => option.value === paths[index].value) || {};

      if (text) {
        paths[index].display = `Go to ${text}`;
      }
    }

    this.setState({ paths }, this.delayedUpdateState);
  }

  onPathSearchChange(options, query) {
    const re = new RegExp(escapeRegExp(query));
    return options.filter(
      (option, index) => re.test(option.text) || String(index + 1) === query
    );
  }

  moveButton(fromIndex, toIndex) {
    const { paths } = this.state;
    const moving = paths[fromIndex];
    paths.splice(fromIndex, 1);
    paths.splice(toIndex, 0, moving);
    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState({ paths }, this.updateState);
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  preventEmptyButtonField(index, options, event) {
    const { paths } = this.state;

    // If the value field is presently empty/has not been assigned,
    // there's nothing we can do, so bail out immediately.
    if (!paths[index].value) {
      return;
    }

    // If the Display field is presently empty,
    // but the value field is not, kindly fill it with something.
    if (!paths[index].display.trim()) {
      const { text } =
        options.find(option => option.value === paths[index].value) || {};

      if (text) {
        paths[index].display = `Go to ${text}`;
      }
    }

    // This is not a typed text input, so there should be no delay
    // applied to saving this state to the server.
    this.setState(
      { paths },
      event.type === 'blur' ? this.delayedUpdateState : () => {}
    );
  }

  onViewGraphClick() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const {
      onPathAddClick,
      onPathDeleteClick,
      onPathDetailChange,
      onPathOrderChange,
      onPathSearchChange,
      onRecallChange,
      onChange,
      onViewGraphClick,
      preventEmptyButtonField,
      slides = [],
      updateState
    } = this;
    const {
      scenario,
      slideIndex,
      value: { id }
    } = this.props;
    const { header, prompt, paths, open, recallId } = this.state;

    if (!slides.length) {
      return null;
    }

    slides.sort((a, b) => {
      return a.is_finish === b.is_finish ? 0 : a.is_finish ? 1 : -1;
    });

    const slidesAsOptions = slides.map((slide, index) => {
      const nonZeroIndex = index + 1;
      const value = slide.id;
      let quotedSlideTitle = slide.title ? ` "${slide.title}"` : ``;
      let text = `Slide #${nonZeroIndex} ${quotedSlideTitle}`.trim();
      let headerCell = `
      Slide #${nonZeroIndex}
      ${quotedSlideTitle}
      `.trim();
      let components = slide.components;

      if (slide.is_finish) {
        const type = 'Text';
        // Override these for display consistency
        text = 'Finish';
        headerCell = text;
        components = [{ html, type }];
      }

      const content = (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="mpr__slide-preview-constraint mpr__title-constraint">
                {headerCell}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="mpr__slide-preview-constraint">
                <SlideComponents asSVG={true} components={components} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const key = Identity.key({ text, value });
      return {
        key,
        text,
        content,
        value
      };
    });
    const options = slidesAsOptions.filter(
      (options, index) => slideIndex !== index
    );
    const multiPathNetworkGraphModal = open ? (
      <MultiPathNetworkGraphModal
        onClose={onViewGraphClick}
        open={open}
        scenario={scenario}
      />
    ) : null;

    return slides.length ? (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            value={{ recallId }}
            slideIndex={slideIndex}
            scenario={scenario}
            onChange={onRecallChange}
          />

          <Form.TextArea
            label="Enter text content to display before the navigation buttons:"
            aria-label="Enter text content to display before the navigation buttons:"
            name="prompt"
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />

          <Table definition striped unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="mpr__thead-background" />
                <Table.HeaderCell>Button display</Table.HeaderCell>
                <Table.HeaderCell className="mpr__goto-slide-constraint">
                  Destination slide
                </Table.HeaderCell>
                <Table.HeaderCell collapsing>Button color</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Sortable
              tag="tbody"
              onChange={onPathOrderChange}
              options={{
                direction: 'vertical',
                swapThreshold: 0.5,
                animation: 150
              }}
            >
              {paths.map((path, index) => {
                const {
                  color = '#73b580',
                  display,
                  value: defaultValue
                } = path;
                const onBlurOrFocus = preventEmptyButtonField.bind(
                  this,
                  index,
                  options
                );

                const colorPickerProps = {
                  direction: 'right',
                  index,
                  name: 'color',
                  value: color,
                  onChange: onPathDetailChange,
                  position: 'fixed'
                };

                const baseKey = Identity.key({ id, index });
                const pathKey = Identity.key({ baseKey, path });
                return (
                  <Table.Row
                    className="mpr__cursor-grab"
                    key={`table-row-${baseKey}`}
                  >
                    <Table.Cell collapsing>
                      <EditorMenu
                        type="choice"
                        items={{
                          save: {
                            onClick: () => updateState()
                          },
                          delete: {
                            onConfirm: () => onPathDeleteClick(index)
                          }
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        fluid
                        name="display"
                        autoComplete="off"
                        aria-label={`Enter the display for choice ${index + 1}`}
                        index={index}
                        value={display}
                        onBlur={onBlurOrFocus}
                        onFocus={onBlurOrFocus}
                        onChange={onPathDetailChange}
                        options={options}
                        key={`path-display-${baseKey}`}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        closeOnChange
                        fluid
                        selection
                        name="value"
                        aria-label={`Select the destination slide for choice ${index +
                          1}`}
                        index={index}
                        defaultValue={defaultValue}
                        onBlur={onBlurOrFocus}
                        onFocus={onBlurOrFocus}
                        onChange={onPathDetailChange}
                        search={onPathSearchChange}
                        options={options}
                        key={`path-node-${pathKey}`}
                      />
                    </Table.Cell>
                    <Table.Cell collapsing>
                      <ColorPicker.Accessible {...colorPickerProps} />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Sortable>

            {!paths.length ? (
              <Table.Body>
                <Table.Row key={Identity.key({ id, ['empty']: true })} negative>
                  <Table.Cell colSpan={3}>
                    This prompt is empty! Please create at least one slide
                    choice, otherwise this prompt will not appear in the slide.
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ) : null}

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="3">
                  <Menu floated="right" borderless>
                    <Menu.Item.Tabbable
                      icon
                      aria-label="View slides sequence graph"
                      onClick={onViewGraphClick}
                    >
                      <Icon.Group
                        size="large"
                        className="em__icon-group-margin"
                      >
                        <Icon
                          name="fork"
                          style={{ transform: 'rotate(90deg)' }}
                        />
                      </Icon.Group>
                      View slides sequence graph
                    </Menu.Item.Tabbable>
                    <Menu.Item.Tabbable
                      icon
                      aria-label="Add another slide choice"
                      onClick={onPathAddClick}
                    >
                      <Icon.Group
                        size="large"
                        className="em__icon-group-margin"
                      >
                        <Icon name="hand pointer outline" />
                        <Icon corner="top right" name="add" color="green" />
                      </Icon.Group>
                      Add another slide choice
                    </Menu.Item.Tabbable>
                  </Menu>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
          <DataHeader
            content={header}
            onChange={onChange}
            onBlur={updateState}
          />
        </Container>
        {multiPathNetworkGraphModal}
      </Form>
    ) : null;
  }
}

MultiPathResponseEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    paths: PropTypes.array,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default MultiPathResponseEditor;
