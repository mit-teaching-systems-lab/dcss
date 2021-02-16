import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Identity from '@utils/Identity';
import { v4 as uuid } from 'uuid';
import {
  Checkbox,
  Grid,
  Icon,
  Input,
  Menu,
  Message,
  Ref,
  Segment
} from '@components/UI';
import EditorMenu from '@components/EditorMenu';
import ScenarioPersonaSelect from '@components/ScenarioEditor/ScenarioPersonaSelect';
import Sortable, { Draggable } from '@components/Sortable';
import SlideComponentSelect from '@components/SlideComponentSelect';
import scrollIntoView from '@utils/scrollIntoView';
import Storage from '@utils/Storage';
import * as Components from '../Components';
import './SlideEditor.css';

const getDraggableStyle = (isDragging, draggableStyle) => {
  return {
    background: isDragging ? 'rgba(255, 215, 0, 0.75)' : '',
    opacity: isDragging ? '0.25' : '1',
    ...draggableStyle
  };
};

const MenuItemModeToggler = props => {
  const { disabled, mode, onToggle } = props;
  const isPreviewMode = mode === 'preview';
  const iconProps = isPreviewMode ? { name: 'edit outline' } : { name: 'eye' };
  const ariaLabel = isPreviewMode ? 'Edit slide' : 'Preview slide';
  const onClick = () => {
    onToggle({
      mode: isPreviewMode ? 'edit' : 'preview'
    });
  };

  return (
    <Menu.Item.Tabbable
      key="menu-item-slide-mode-toggle"
      aria-label={ariaLabel}
      name={ariaLabel}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon {...iconProps} />
    </Menu.Item.Tabbable>
  );
};

MenuItemModeToggler.propTypes = {
  disabled: PropTypes.bool,
  mode: PropTypes.string,
  onToggle: PropTypes.func,
  type: PropTypes.string
};

const MenuItemChatToggler = props => {
  const {
    disabled,
    onToggle,
    slide,
    slide: { has_chat_enabled: isChatEnabled }
  } = props;
  const color = isChatEnabled ? 'green' : 'black';
  const iconProps = {
    name: 'chat',
    color
  };

  const ariaLabel = `${
    isChatEnabled ? 'Disable' : 'Enable'
  } realtime chat on this slide`;
  const onClick = () => {
    onToggle({
      slide: {
        ...slide,
        has_chat_enabled: !isChatEnabled
      }
    });
  };

  return !disabled ? (
    <Menu.Item.Tabbable
      key="menu-item-slide-mode-toggle"
      aria-label={ariaLabel}
      popup={ariaLabel}
      onClick={onClick}
    >
      <Icon {...iconProps} />
    </Menu.Item.Tabbable>
  ) : null;
};

MenuItemChatToggler.propTypes = {
  disabled: PropTypes.bool,
  onToggle: PropTypes.func,
  slide: PropTypes.object
};

export default class SlideEditor extends Component {
  constructor(props) {
    super(props);
    const { title = '', components = [], has_chat_enabled } = props;

    this.sessionKey = `slideeditor/${props.id}`;

    const { activeComponentIndex, mode } = Storage.get(this.sessionKey, {
      activeComponentIndex: -1,
      mode: 'edit'
    });

    components.forEach(component => {
      if (!component.id) {
        component.id = uuid();
      }
    });

    this.state = {
      activeComponentIndex,
      mode,
      slide: {
        components,
        has_chat_enabled,
        title
      }
    };

    this.activateComponent = this.activateComponent.bind(this);
    this.updateSlide = this.updateSlide.bind(this);

    this.componentRefs = [];
    this.debouncers = {};

    this.onComponentChange = this.onComponentChange.bind(this);
    this.onComponentDelete = this.onComponentDelete.bind(this);
    this.onComponentDuplicate = this.onComponentDuplicate.bind(this);
    this.onComponentOrderChange = this.onComponentOrderChange.bind(this);
    this.onComponentSelectClick = this.onComponentSelectClick.bind(this);

    this.onSlideChange = this.onSlideChange.bind(this);
  }

  async componentDidMount() {
    const { activeComponentIndex } = this.state;

    if (this.componentRefs[activeComponentIndex]) {
      scrollIntoView(this.componentRefs[activeComponentIndex], {
        block: 'start'
      });
    }
  }

  updateSlide() {
    if (this.props.onChange) {
      const { slide } = this.state;
      this.props.onChange(this.props.index, {
        ...slide
      });
    }
  }

  activateComponent(value, callback = () => {}) {
    let updatedState = value;

    /* istanbul ignore if */
    if (Array.isArray(value)) {
      // eslint-disable-next-line no-console
      console.log('TODO: determine when this path actually occurs.');
      updatedState = {
        slide: {
          components: value
        }
      };
    }

    if (typeof value === 'number') {
      updatedState = {
        activeComponentIndex: value
      };
    }

    /* istanbul ignore else */
    if (updatedState.activeComponentIndex !== -1) {
      this.setState(updatedState, () => {
        const { activeComponentIndex } = this.state;
        if (this.componentRefs[activeComponentIndex]) {
          scrollIntoView(this.componentRefs[activeComponentIndex], {
            block: 'start'
          });
        }
        callback();
      });
    } else {
      this.setState(updatedState, () => {
        callback();
      });
    }
  }

  onComponentChange(index, value) {
    const {
      slide,
      slide: { components }
    } = this.state;
    /* istanbul ignore else */
    if (components[index]) {
      Object.assign(components[index], value);
      const update = {
        slide: {
          ...slide,
          components
        }
      };
      this.setState(update, () => {
        this.updateSlide();
      });
    }
  }

  async onComponentDuplicate(index) {
    const { slide } = this.state;
    const id = uuid();
    const sourceComponents = slide.components;
    const sourceComponent = sourceComponents[index];
    const copy = Object.assign({}, sourceComponent, { id });

    if (copy.responseId) {
      copy.responseId = uuid();
      copy.header = `${sourceComponent.header} (COPY)`;
    }
    const components = [];

    for (let i = 0; i < sourceComponents.length; i++) {
      components.push(sourceComponents[i]);
      if (i === index) {
        components.push(copy);
      }
    }
    const activeComponentIndex = index + 1;
    const update = {
      activeComponentIndex,
      slide: {
        ...slide,
        components
      }
    };

    this.activateComponent(update, () => {
      this.updateSlide();
    });
  }

  onComponentOrderChange(fromIndex, activeComponentIndex) {
    const {
      slide,
      slide: { components }
    } = this.state;
    const moving = components[fromIndex];
    components.splice(fromIndex, 1);
    components.splice(activeComponentIndex, 0, moving);
    const update = {
      activeComponentIndex,
      slide: {
        ...slide,
        components
      }
    };

    this.activateComponent(update, () => {
      this.updateSlide();
    });
  }

  onComponentDelete(index) {
    const {
      slide,
      slide: { components }
    } = this.state;

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

    const update = {
      activeComponentIndex,
      slide: {
        ...slide,
        components
      }
    };

    this.activateComponent(update, () => {
      this.updateSlide();
    });
  }

  onComponentSelectClick(type) {
    const {
      activeComponentIndex: currentActiveComponentIndex,
      slide,
      slide: { components, title }
    } = this.state;

    const activeComponentIndex = currentActiveComponentIndex + 1;
    const component = Components[type].defaultValue({
      responseId: uuid()
    });

    component.id = uuid();

    if (component.responseId) {
      const prefix = title ? `${title}-` : '';
      component.header = `${prefix}${type}-${activeComponentIndex}`;
    }

    if (activeComponentIndex === components.length) {
      components.push(component);
    } else {
      components.splice(activeComponentIndex, 0, component);
    }

    const update = {
      activeComponentIndex,
      slide: {
        ...slide,
        components
      }
    };

    this.activateComponent(update, () => {
      this.updateSlide();
    });
  }

  onSlideChange(event, { name, value, id = Identity.id() }) {
    const { slide } = this.state;
    this.setState({
      slide: {
        ...slide,
        [name]: value
      }
    });
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
      onComponentDuplicate,
      onComponentSelectClick,
      onSlideChange
    } = this;

    const { noSlide, promptToAddSlide, scenario, slides } = this.props;
    const { activeComponentIndex, mode, slide } = this.state;
    const noSlideComponents = slide.components.length === 0;
    const disabled = !!noSlide;
    const editorMenuItems = {
      left: [
        <Menu.Item.Tabbable
          key="menu-item-slide-number"
          name="Slide number"
          className="slideeditormenu__slide-number-width header"
        >
          {this.props.index + 1}
        </Menu.Item.Tabbable>,

        <Menu.Item key="menu-item-slide-title" name="Slide title">
          <Input
            id={`title-${this.props.index}`}
            disabled={disabled}
            name="title"
            placeholder="Slide title"
            defaultValue={slide.title}
            onChange={onSlideChange}
          />
        </Menu.Item>
      ],
      save: {
        disabled,
        onClick: updateSlide
      },
      delete: {
        disabled: slides.length <= 1,
        onConfirm: () => {
          this.props.onDelete(this.props.index);
        }
      },
      right: [
        <Menu.Item.Tabbable
          key="menu-item-slide-duplicate"
          name="Duplicate slide"
          aria-label="Duplicate slide"
          onClick={() => this.props.onDuplicate(this.props.index)}
        >
          <Icon name="copy outline" />
        </Menu.Item.Tabbable>,

        <MenuItemModeToggler
          key="menu-item-mode-toggler"
          type="Slide"
          disabled={disabled || noSlideComponents}
          mode={mode}
          onToggle={state => this.setState(state)}
        />,

        <MenuItemChatToggler
          key="menu-item-chat-toggler"
          name="has_chat_enabled"
          disabled={scenario.personas.length === 1}
          slide={slide}
          onToggle={state => {
            const index = state.slide.components.findIndex(({type}) =>
              type === 'ChatPrompt'
            );

            if (index !== -1) {
              onComponentDelete(index);
            } else {

              // this.setState({
              //   activeComponentIndex: -1
              // }, () => onComponentSelectClick('ChatPrompt'));

              onComponentSelectClick('ChatPrompt');
              onComponentOrderChange(1, 0);
              // this.activateComponent(-1, () =>
              //   onComponentSelectClick('ChatPrompt')
              // );
            }

            this.setState(state, () => {
              this.updateSlide();
            });
          }}
        />
      ]
    };

    const noSlideComponentsIcon = noSlideComponents ? (
      <Icon.Group size="huge" className="em__icon-group-margin">
        <Icon name="newspaper outline" />
        <Icon corner="top right" name="add" color="green" />
      </Icon.Group>
    ) : null;

    const noSlideComponentsMessage = noSlideComponents ? (
      <Message
        content="Select a content component from the menu to right."
        header="Add content to this slide!"
        floating
        icon={noSlideComponentsIcon}
      />
    ) : null;

    Storage.set(this.sessionKey, {
      activeComponentIndex,
      mode
    });

    return (
      <Grid>
        <Grid.Column stretched>
          <Grid.Row>
            <EditorMenu
              key="slide-editor-menu"
              type="slide"
              items={editorMenuItems}
              mode={mode}
            />
          </Grid.Row>
          <Grid.Row>
            {noSlide ? (
              <Grid>
                <Grid.Row className="ser__component-pane">
                  <Grid.Column className="ser__component-layout-pane-outer">
                    <Segment className="ser__component-layout-pane">
                      {promptToAddSlide}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            ) : (
              <Grid columns={2}>
                <Grid.Row className="ser__component-pane">
                  <Grid.Column className="ser__component-layout-pane-outer">
                    <Segment className="ser__component-layout-pane">
                      {noSlideComponents ? noSlideComponentsMessage : null}
                      <Sortable
                        hasOwnDraggables={true}
                        onChange={onComponentOrderChange}
                        type="component"
                      >
                        {slide.components.map((value, index) => {
                          const { type } = value;
                          if (!Components[type]) return;

                          const {
                            Card: ComponentCard,
                            Display: ComponentDisplay,
                            Editor: ComponentEditor
                          } = Components[type];

                          const {
                            disableDelete = false,
                            disableDuplicate = false,
                            disableEmbed = false,
                            disableOrdering = false,
                            disablePersona = false
                          } = value;

                          const onConfirm = () => onComponentDelete(index);
                          const isActiveComponent =
                            activeComponentIndex === index;
                          const description = `${index + 1}, `;

                          // "Duplicate Component" appears on every component,
                          // so is the next left most item after "Delete Component"
                          const menuItemComponentDuplicate = !disableDuplicate ? (
                            <Menu.Item.Tabbable
                              name="Duplicate this component"
                              aria-label="Duplicate this component"
                              onClick={() => {
                                onComponentDuplicate(index);
                              }}
                            >
                              <Icon name="copy outline" />
                            </Menu.Item.Tabbable>
                          ) : null;

                          const right = [menuItemComponentDuplicate];

                          // "Persona Select" either always appears on every component,
                          // or not at all, so it is the next left most item after
                          // "Duplicate Component"
                          const persona = {};

                          if (scenario.personas.length > 1) {
                            const personaSelectProps = {
                              defaultValue:
                                (value.persona && value.persona.id) || null,
                              emptyText: 'No persona restriction',
                              fluid: false,
                              item: true,
                              onSelect: personaOrNull => {
                                const persona = personaOrNull
                                  ? { id: personaOrNull.id }
                                  : null;

                                onComponentChange(index, {
                                  ...value,
                                  persona
                                });
                              },
                              personas: scenario.personas,
                              placeholder: 'Select a persona'
                            };

                            if (value.persona) {
                              Object.assign(
                                persona,
                                scenario.personas.find(
                                  ({ id }) => value.persona.id === id
                                )
                              );
                            }

                            // eslint-disable-next-line no-unused-vars
                            const ariaLabel =
                              'Select which persona sees this content. Leave unselected if this content is for all scenario participants.';

                            const personaSelectMenu = !disablePersona ? (
                              <ScenarioPersonaSelect
                                key={Identity.key({
                                  personaSelectProps,
                                  index
                                })}
                                {...personaSelectProps}
                              />
                            ) : null;

                            right.push(personaSelectMenu);
                          }

                          // "Require Component" is only present when the component is
                          // a prompt.
                          if (value.responseId) {
                            const id = Identity.key({ index });
                            const props = {
                              'aria-labelledby': id,
                              name: 'required',
                              label: value.disableRequireCheckbox
                                ? 'Required'
                                : 'Required?',
                              checked: value.required
                            };

                            let menuItemTip = value.required
                              ? 'Make this prompt optional.'
                              : 'Make this prompt required.';

                            if (value.disableRequireCheckbox) {
                              props.disabled = true;
                              menuItemTip =
                                'This prompt component cannot be made optional';
                            }

                            right.push(
                              <Menu.Item.Tabbable
                                id={id}
                                key={Identity.key(props)}
                                name={menuItemTip}
                              >
                                <Checkbox
                                  {...props}
                                  onChange={(event, { checked }) =>
                                    onComponentChange(index, {
                                      ...value,
                                      required: checked
                                    })
                                  }
                                />
                              </Menu.Item.Tabbable>
                            );
                          }

                          const onComponentClick = () => {
                            if (activeComponentIndex !== index) {
                              activateComponent(index);
                            }
                          };

                          /* istanbul ignore if */
                          if (!value.id) {
                            value.id = uuid();
                          }

                          if (isActiveComponent && !disableOrdering) {
                            right.push(
                              <Menu.Menu
                                className="movers"
                                name="Move component"
                                position="right"
                              >
                                <Menu.Item.Tabbable
                                  icon="move"
                                  aria-label="Move component"
                                  disabled={slide.components.length <= 1}
                                />
                                <Menu.Item.Tabbable
                                  icon="caret up"
                                  aria-label={`Move component ${description} up`}
                                  disabled={index === 0}
                                  onClick={() => {
                                    onComponentOrderChange(index, index - 1);
                                  }}
                                />
                                <Menu.Item.Tabbable
                                  icon="caret down"
                                  aria-label={`Move component ${description} down`}
                                  disabled={
                                    index === slide.components.length - 1
                                  }
                                  onClick={() => {
                                    onComponentOrderChange(index, index + 1);
                                  }}
                                />
                              </Menu.Menu>
                            );
                          }

                          const componentEditorMenuItems = {
                            left: [
                              <Menu.Item.Tabbable
                                className="ser__component-card"
                                key={`menu-item-component-card-${index}`}
                              >
                                <ComponentCard />
                              </Menu.Item.Tabbable>
                            ],
                            right
                          };

                          if (!disableDelete) {
                            componentEditorMenuItems.delete = {
                              onConfirm
                            };
                            componentEditorMenuItems.save = {
                              onClick: updateSlide
                            };
                          }

                          const draggableOrNot = !disableOrdering ? (
                            <Draggable
                              key={`draggable-key-${value.id}`}
                              draggableId={`draggable-id-${index}`}
                              index={index}
                            >
                              {(provided, { isDragging }) => {
                                const {
                                  draggableProps,
                                  dragHandleProps,
                                  innerRef
                                } = provided;
                                return (
                                  <div
                                    {...draggableProps}
                                    ref={innerRef}
                                    style={getDraggableStyle(
                                      isDragging,
                                      draggableProps.style
                                    )}
                                  >
                                    <Ref
                                      key={`component-ref-${index}`}
                                      innerRef={node =>
                                        (this.componentRefs[index] = node)
                                      }
                                    >
                                      <Segment
                                        data-testid="on-component-click"
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
                                          isDragging={isDragging}
                                          draghandle={dragHandleProps}
                                          index={index}
                                          items={componentEditorMenuItems}
                                        />

                                        <ComponentEditor
                                          key={value.id}
                                          id={value.id}
                                          slideId={this.props.id}
                                          slideIndex={this.props.index}
                                          scenario={scenario}
                                          value={value}
                                          onChange={v =>
                                            onComponentChange(index, v)
                                          }
                                        />
                                      </Segment>
                                    </Ref>
                                  </div>
                                );
                              }}
                            </Draggable>
                          ) : (
                            <Ref
                              key={`component-ref-${index}`}
                              innerRef={node =>
                                (this.componentRefs[index] = node)
                              }
                            >
                              <Segment
                                data-testid="on-component-click"
                                key={`component-edit-${index}`}
                                className={
                                  index === activeComponentIndex
                                    ? 'sortable__selected sortable__component'
                                    : 'sortable__component'
                                }
                                onClick={onComponentClick}
                              >
                                <EditorMenu
                                  type="component"
                                  index={index}
                                  items={componentEditorMenuItems}
                                />

                                <ComponentEditor
                                  key={value.id}
                                  id={value.id}
                                  slideId={this.props.id}
                                  slideIndex={this.props.index}
                                  scenario={scenario}
                                  value={value}
                                  onChange={v => onComponentChange(index, v)}
                                />
                              </Segment>
                            </Ref>
                          );

                          return mode === 'edit' ? (
                            draggableOrNot
                          ) : (
                            <Fragment key={`component-fragment-${value.id}`}>
                              <ComponentDisplay
                                key={`component-preview-${value.id}`}
                                {...value}
                              />
                            </Fragment>
                          );
                        })}
                      </Sortable>
                    </Segment>
                  </Grid.Column>
                  <Grid.Column className="ser__component-select-pane-outer">
                    <SlideComponentSelect
                      className="ser__component-select"
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
  components: PropTypes.arrayOf(PropTypes.object),
  has_chat_enabled: PropTypes.bool,
  id: PropTypes.number,
  index: PropTypes.number,
  noSlide: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  promptToAddSlide: PropTypes.node,
  scenario: PropTypes.object,
  slides: PropTypes.array,
  title: PropTypes.string,
  user: PropTypes.object
};
