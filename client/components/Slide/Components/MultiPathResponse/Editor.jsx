import React from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import {
  Button,
  Container,
  Dropdown,
  Form,
  Icon,
  Input,
  Table
} from '@components/UI';
import { type } from './meta';
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
          display: "Text on button",
          id: Slide id,
      }
      */
      paths = [
        {
          display: `Go to...`,
          value: null
        }
      ],
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

    this.onChange = this.onChange.bind(this);
    this.onRecallChange = this.onRecallChange.bind(this);
    this.onViewGraphClick = this.onViewGraphClick.bind(this);

    this.updateState = this.updateState.bind(this);
    this.preventEmptyButtonField = this.preventEmptyButtonField.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
  }

  async componentDidMount() {
    const { scenarioId } = this.props;
    const { slides: unfiltered, status } = await (await fetch(
      `/api/scenarios/${scenarioId}/slides`
    )).json();
    if (status === 200) {
      this.slides = unfiltered.filter(({ is_finish }) => !is_finish);
      this.setState({
        isReady: true
      });
    }
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

    // if (hash(stateValue) !== hash(propsValue)) {
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

  onPathDetailChange(event, { index, name, value }) {
    if (value === -1) {
      return;
    }
    const { paths } = this.state;
    paths[index][name] = value;
    this.setState({ paths }, this.delayedUpdateState);
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
      onRecallChange,
      onChange,
      onViewGraphClick,
      preventEmptyButtonField,
      slides,
      updateState
    } = this;
    const {
      scenarioId,
      slideIndex,
      value: { id }
    } = this.props;
    const { header, prompt, paths, open, recallId } = this.state;

    const slidesAsOptions = slides.map((slide, index) => {
      const nonZeroIndex = index + 1;
      const quotedSlideTitle = slide.title ? ` "${slide.title}"` : ``;
      const text = `Slide #${nonZeroIndex} ${quotedSlideTitle}`.trim();
      const value = slide.id;
      const content = (
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="mpr__slide-preview-constraint mpr__goto-slide-title-constraint">
                Slide #{nonZeroIndex}
                {quotedSlideTitle}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              {/*
              <Table.Cell verticalAlign="top">
                Slide #{nonZeroIndex}
                {quotedSlideTitle}
              </Table.Cell>
            */}
              <Table.Cell className="mpr__slide-preview-constraint">
                <SlideComponents asSVG={true} components={slide.components} />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      );
      const key = hash({ text, value });
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
        header=""
        onClose={onViewGraphClick}
        open={open}
        scenarioId={scenarioId}
      />
    ) : null;

    const autoComplete = 'off';
    const fluid = true;
    const name = 'display';

    return slides.length ? (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            value={{ recallId }}
            slideIndex={slideIndex}
            scenarioId={scenarioId}
            onChange={onRecallChange}
          />

          <Form.TextArea
            label="Enter text content to display before the navigation buttons:"
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
                const { display, value: defaultValue } = path;
                const onBlurOrFocus = preventEmptyButtonField.bind(
                  this,
                  index,
                  options
                );
                const key = hash({ id, index });

                const inputProps = {
                  autoComplete,
                  fluid,
                  name,
                  index,
                  value: display,
                  onBlur: onBlurOrFocus,
                  onFocus: onBlurOrFocus,
                  onChange: onPathDetailChange,
                  key: `button-diplay-${key}`
                };

                if (index === paths.length - 1) {
                  inputProps.autoFocus = true;
                }

                return (
                  <Table.Row className="mpr__cursor-grab" key={`row-${key}`}>
                    <Table.Cell collapsing>
                      <EditorMenu
                        type="path"
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
                        index={index}
                        value={display}
                        onBlur={onBlurOrFocus}
                        onFocus={onBlurOrFocus}
                        onChange={onPathDetailChange}
                        key={`button-diplay-${key}`}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Dropdown
                        name="value"
                        closeOnChange
                        fluid
                        selection
                        index={index}
                        defaultValue={defaultValue}
                        onBlur={onBlurOrFocus}
                        onFocus={onBlurOrFocus}
                        onChange={onPathDetailChange}
                        options={options}
                        key={`dropdown-value-${key}`}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Sortable>

            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell colSpan="2">
                  <Button basic icon floated="right" onClick={onPathAddClick}>
                    <Icon.Group size="large" className="em__icon-group-margin">
                      <Icon name="hand pointer outline" />
                      <Icon corner="top right" name="add" color="green" />
                    </Icon.Group>
                    Add a path
                  </Button>
                  <Button basic icon floated="right" onClick={onViewGraphClick}>
                    <Icon.Group size="large" className="em__icon-group-margin">
                      <Icon
                        name="fork"
                        style={{ transform: 'rotate(90deg)' }}
                      />
                    </Icon.Group>
                    View slide graph
                  </Button>
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
  scenarioId: PropTypes.any,
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
