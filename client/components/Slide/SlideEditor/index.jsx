import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Grid,
  Icon,
  Input,
  Menu,
  Message,
  Ref,
  Segment
} from 'semantic-ui-react';
import EditorMenu from '@components/EditorMenu';
// import notify from '@components/Notification';
// import Loading from '@components/Loading';
import Sortable from '@components/Sortable';
import SlideComponentSelect from '@components/SlideComponentSelect';
import generateResponseId from '@components/util/generateResponseId';
import scrollIntoView from '@components/util/scrollIntoView';
import * as Components from '../Components';
import './SlideEditor.css';

export default class SlideEditor extends Component {
  constructor(props) {
    super(props);
    const { title = '', components = [] } = props;
    const activeComponentIndex = -1;
    const mode = 'edit';

    this.state = {
      activeComponentIndex,
      components,
      mode,
      title
    };

    this.activateComponent = this.activateComponent.bind(this);
    this.updateSlide = this.updateSlide.bind(this);

    this.componentRefs = [];
    this.debouncers = {};

    this.onComponentChange = this.onComponentChange.bind(this);
    this.onComponentDelete = this.onComponentDelete.bind(this);
    this.onComponentOrderChange = this.onComponentOrderChange.bind(this);

    this.onComponentSelectClick = this.onComponentSelectClick.bind(this);

    this.onTitleChange = this.onTitleChange.bind(this);
  }

  updateSlide() {
    if (this.props.onChange) {
      const { components, title } = this.state;

      this.props.onChange(this.props.index, {
        components,
        title
      });
    }
  }

  activateComponent(value, callback = () => {}) {
    let updatedState = value;

    if (Array.isArray(value)) {
      updatedState = {
        components: value
      };
    }
    if (typeof value === 'number') {
      updatedState = {
        activeComponentIndex: value
      };
    }

    if (updatedState.activeComponentIndex !== -1) {
      this.setState(updatedState, () => {
        const { activeComponentIndex } = this.state;

        if (this.componentRefs[activeComponentIndex]) {
          scrollIntoView(this.componentRefs[activeComponentIndex]);
        }
        callback();
      });
    }
  }

  onComponentChange(index, value) {
    const { components } = this.state;
    Object.assign(components[index], value);
    this.setState({ components }, () => {
      this.updateSlide();
      // clearTimeout(this.debouncers[index]);
      // this.debouncers[index] = setTimeout(() => {
      //     this.updateSlide();
      // }, 5000);
    });
  }

  onComponentOrderChange(fromIndex, activeComponentIndex) {
    const { components } = this.state;
    const moving = components[fromIndex];
    components.splice(fromIndex, 1);
    components.splice(activeComponentIndex, 0, moving);
    this.activateComponent({ components, activeComponentIndex }, () => {
      this.updateSlide();
    });
  }

  onComponentDelete(index) {
    const { components } = this.state;

    components.splice(index, 1);

    let activeComponentIndex;

    // The components was at the end...
    if (index >= components.length) {
      activeComponentIndex = components.length - 1;
    }

    // The components was at the beginning...
    if (index === 0) {
      activeComponentIndex = 0;
    } else {
      // The components was somewhere in between...
      activeComponentIndex = index - 1;
    }
    this.activateComponent({ components, activeComponentIndex }, () => {
      this.updateSlide();
    });
  }

  onComponentSelectClick(type) {
    const {
      activeComponentIndex: currentActiveComponentIndex,
      components
    } = this.state;

    const activeComponentIndex = currentActiveComponentIndex + 1;
    const component = Components[type].defaultValue({
      responseId: generateResponseId(type)
    });

    if (activeComponentIndex === components.length) {
      components.push(component);
    } else {
      components.splice(activeComponentIndex, 0, component);
    }
    this.activateComponent({ components, activeComponentIndex }, () => {
      this.updateSlide();
    });
  }

  onTitleChange(event, { name, value, id }) {
    this.setState({ [name]: value });
    clearTimeout(this.debouncers[id]);
    this.debouncers[id] = setTimeout(() => {
      this.updateSlide();
    }, 200);
  }

  render() {
    const {
      activateComponent,
      updateSlide,
      onComponentChange,
      onComponentDelete,
      onComponentOrderChange,
      onComponentSelectClick,
      onTitleChange
    } = this;

    const { noSlide, scenarioId } = this.props;

    const { activeComponentIndex, components, title } = this.state;

    const noSlideComponents = components.length === 0;
    const disabled = !!noSlide;
    const editorMenuItems = {
      left: [
        <Menu.Item
          key="menu-item-slide-number"
          name="Slide number"
          className="slideeditormenu__slide-number-width header"
        >
          {this.props.index + 1}
        </Menu.Item>,

        <Menu.Item key="menu-item-slide-title" name="Slide title">
          <Input
            id={`title-${this.props.index}`}
            disabled={disabled}
            name="title"
            placeholder="Slide title (optional)"
            defaultValue={title}
            onChange={onTitleChange}
          />
        </Menu.Item>
      ],
      save: {
        disabled,
        onClick: updateSlide
      },
      delete: {
        disabled,
        onConfirm: () => {
          this.props.onDelete(this.props.index);
        }
      },
      editable: {
        disabled: disabled || noSlideComponents,
        onToggle: (event, data, { mode }) => {
          this.setState({ mode });
        }
      }
    };

    return (
      <Grid>
        <Grid.Column stretched>
          <Grid.Row>
            <EditorMenu
              key="slide-editor-menu"
              type="slide"
              items={editorMenuItems}
            />
          </Grid.Row>
          <Grid.Row>
            {noSlide ? (
              <Grid>
                <Grid.Row className="slideeditor__component-pane">
                  <Grid.Column className="slideeditor__component-layout-pane-outer">
                    <Segment className="slideeditor__component-layout-pane">
                      {noSlide}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ) : (
              <Grid columns={2}>
                <Grid.Row className="slideeditor__component-pane">
                  <Grid.Column className="slideeditor__component-layout-pane-outer">
                    <Segment className="slideeditor__component-layout-pane">
                      {noSlideComponents && (
                        <Message
                          floating
                          icon={
                            <Icon.Group
                              size="huge"
                              className="editormenu__icon-group"
                            >
                              <Icon name="newspaper outline" />
                              <Icon
                                corner="top right"
                                name="add"
                                color="green"
                              />
                            </Icon.Group>
                          }
                          header="Add content to this slide!"
                          content="Select a content component from the menu to right."
                        />
                      )}

                      <Sortable onChange={onComponentOrderChange}>
                        {components.map((value, index) => {
                          const { type } = value;
                          if (!Components[type]) return;

                          const {
                            Editor: ComponentEditor,
                            Display: ComponentDisplay
                          } = Components[type];

                          const onConfirm = () => onComponentDelete(index);
                          const isActiveComponent =
                            activeComponentIndex === index;
                          const description = `${index + 1}, `;
                          const movers = (
                            <Menu.Menu
                              name="Move component up or down"
                              position="right"
                            >
                              <Menu.Item
                                icon="caret up"
                                aria-label={`Move component ${description} up`}
                                disabled={index === 0}
                                onClick={() => {
                                  onComponentOrderChange(index, index - 1);
                                }}
                              />
                              <Menu.Item
                                icon="caret down"
                                aria-label={`Move component ${description} down`}
                                disabled={index === components.length - 1}
                                onClick={() => {
                                  onComponentOrderChange(index, index + 1);
                                }}
                              />
                            </Menu.Menu>
                          );
                          const right = isActiveComponent ? [movers] : [];

                          if (value.responseId) {
                            const requiredCheckbox = (
                              <Menu.Item
                                key="menu-item-prompt-required"
                                name="Set this prompt to 'required'"
                              >
                                <Checkbox
                                  name="required"
                                  label="Required?"
                                  checked={value.required}
                                  onChange={(event, { checked }) =>
                                    onComponentChange(index, {
                                      ...value,
                                      required: checked
                                    })
                                  }
                                />
                              </Menu.Item>
                            );

                            right.unshift(requiredCheckbox);
                          }

                          const onComponentClick = () => {
                            if (activeComponentIndex !== index) {
                              activateComponent(index);
                            }
                          };

                          return this.state.mode === 'edit' ? (
                            <Ref
                              key={`component-ref-${index}`}
                              innerRef={node =>
                                (this.componentRefs[index] = node)
                              }
                            >
                              <Segment
                                key={`component-edit-${index}`}
                                className={
                                  index === activeComponentIndex
                                    ? 'sortable__selected sortable__component draggable'
                                    : 'sortable__component draggable'
                                }
                                onClick={onComponentClick}
                              >
                                <EditorMenu
                                  type="component"
                                  items={{
                                    save: {
                                      onClick: updateSlide
                                    },
                                    delete: {
                                      onConfirm
                                    },
                                    right
                                  }}
                                />

                                <ComponentEditor
                                  slideIndex={this.props.index}
                                  scenarioId={scenarioId}
                                  value={value}
                                  onChange={v => onComponentChange(index, v)}
                                />
                              </Segment>
                            </Ref>
                          ) : (
                            <Fragment key={`component-fragment-${index}`}>
                              <ComponentDisplay
                                key={`component-preview-${index}`}
                                {...value}
                              />
                            </Fragment>
                          );
                        })}
                      </Sortable>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column className="slideeditor__component-select-pane-outer">
                    <SlideComponentSelect
                      className="slideeditor__component-select"
                      mode="menu"
                      onClick={onComponentSelectClick}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

SlideEditor.propTypes = {
  scenarioId: PropTypes.any,
  index: PropTypes.number,
  id: PropTypes.number,
  title: PropTypes.string,
  components: PropTypes.arrayOf(PropTypes.object),
  noSlide: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func
};
