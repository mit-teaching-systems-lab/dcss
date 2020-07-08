import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
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
// import { notify } from '@components/Notification';
// import Loading from '@components/Loading';
import Sortable, { Draggable } from '@components/Sortable';
import SlideComponentSelect from '@components/SlideComponentSelect';
import scrollIntoView from '@components/util/scrollIntoView';
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

export default class SlideEditor extends Component {
  constructor(props) {
    super(props);
    const { title = '', components = [] } = props;

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
    this.onComponentDuplicate = this.onComponentDuplicate.bind(this);
    this.onComponentOrderChange = this.onComponentOrderChange.bind(this);
    this.onComponentSelectClick = this.onComponentSelectClick.bind(this);

    this.onTitleChange = this.onTitleChange.bind(this);
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
          scrollIntoView(this.componentRefs[activeComponentIndex], {
            block: 'start'
          });
        }
        callback();
      });
    }
  }

  onComponentChange(index, value) {
    const { components } = this.state;
    if (components[index]) {
      Object.assign(components[index], value);
      this.setState({ components }, () => {
        this.updateSlide();
        // clearTimeout(this.debouncers[index]);
        // this.debouncers[index] = setTimeout(() => {
        //     this.updateSlide();
        // }, 5000);
      });
    }
  }

  async onComponentDuplicate(index) {
    const { components: sourceComponents, title } = this.state;
    const id = uuid();
    const sourceComponent = sourceComponents[index];
    const copy = Object.assign({}, sourceComponent, { id });

    if (copy.responseId) {
      copy.responseId = uuid();
      copy.header = `${sourceComponent.header} (COPY)`;
    }
    const components = [];

    for (let i = 0; i > sourceComponents.length; i++) {
      components.push(sourceComponents[i]);
      if (i === index) {
        components.push(copy);
      }
    }
    const activeComponentIndex = index + 1;

    this.activateComponent({ components, activeComponentIndex }, () => {
      this.updateSlide();
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
      components,
      title
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
      onComponentDuplicate,
      onComponentSelectClick,
      onTitleChange
    } = this;

    const { noSlide, scenarioId } = this.props;
    const { activeComponentIndex, components, mode, title } = this.state;
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
                              className="em__icon-group-margin"
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

                      <Sortable
                        hasOwnDraggables={true}
                        onChange={onComponentOrderChange}
                        type="component"
                      >
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
                          const menuItemComponentDuplicate = (
                            <Menu.Item
                              name="Duplicate this component"
                              aria-label="Duplicate this component"
                              onClick={() => {
                                onComponentDuplicate(index);
                              }}
                            >
                              <Icon name="copy outline" />
                            </Menu.Item>
                          );
                          const menuItemComponentMovers = (
                            <Menu.Menu name="Move component" position="right">
                              <Menu.Item
                                icon="move"
                                aria-label="Move component"
                                disabled={components.length <= 1}
                              />
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
                          const right = isActiveComponent
                            ? [menuItemComponentMovers]
                            : [];

                          if (value.responseId) {
                            const props = {
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

                            const menuItemRequiredCheckbox = (
                              <Menu.Item key={hash(props)} name={menuItemTip}>
                                <Checkbox
                                  {...props}
                                  onChange={(event, { checked }) =>
                                    onComponentChange(index, {
                                      ...value,
                                      required: checked
                                    })
                                  }
                                />
                              </Menu.Item>
                            );

                            right.unshift(menuItemRequiredCheckbox);
                          }

                          // Always put the duplicate button just to the
                          // right of the delete button.
                          right.unshift(menuItemComponentDuplicate);

                          const onComponentClick = () => {
                            if (activeComponentIndex !== index) {
                              activateComponent(index);
                            }
                          };

                          if (!value.id) {
                            value.id = uuid();
                          }

                          return mode === 'edit' ? (
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
                                        key={`component-edit-${index}`}
                                        className={
                                          index === activeComponentIndex
                                            ? 'sortable__selected sortable__component draggable'
                                            : 'sortable__component draggable'
                                        }
                                        onClick={onComponentClick}
                                      >
                                        <EditorMenu
                                          isDragging={isDragging}
                                          draghandle={dragHandleProps}
                                          type="component"
                                          index={index}
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
                                          key={value.id}
                                          id={value.id}
                                          slideIndex={this.props.index}
                                          scenarioId={scenarioId}
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
