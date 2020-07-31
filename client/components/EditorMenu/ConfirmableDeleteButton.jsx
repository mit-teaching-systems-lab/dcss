import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Icon, Menu, Modal, Popup, Ref } from '@components/UI';

class ConfirmableDeleteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.onClick = this.onClick.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onComplete = this.onCancel;
  }

  onClick() {
    this.setState({ open: true });
  }

  onCancel() {
    this.setState({ open: false });
  }

  render() {
    const {
      onCancel,
      onClick,
      onComplete,
      props: { disabled, itemType, onConfirm }
    } = this;

    const { open } = this.state;

    const ariaLabel = `Delete this ${itemType}`.trim();
    const content = itemType
      ? `Are you sure you want to delete this ${itemType}?`
      : `Are you sure you want to delete?`;

    const onConfirmClick = () => {
      onConfirm();
      onComplete();
    };

    const confirmButton = (
      <ConfirmButton onClick={onConfirmClick} content="Yes" />
    );

    const trigger = (
      <Menu.Item.Tabbable disabled={disabled} onClick={onClick}>
        <Icon name="trash alternate outline" aria-label={ariaLabel} />
      </Menu.Item.Tabbable>
    );
    return (
      <Fragment>
        <Popup size="small" content={ariaLabel} trigger={trigger} />
        <Modal role="dialog" aria-modal="true" size="small" open={open}>
          <Header
            icon="trash alternate outline"
            content="Delete confirmation"
          />
          <Modal.Content>{content}</Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              {confirmButton}
              <Button.Or />
              <Button onClick={onCancel} size="large">
                No
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

ConfirmableDeleteButton.propTypes = {
  disabled: PropTypes.bool,
  itemType: PropTypes.string,
  onConfirm: PropTypes.func.isRequired
};

class ConfirmButton extends Component {
  render() {
    return (
      <Ref
        innerRef={node => {
          this.ref = node;
          if (this.ref) {
            this.ref.focus();
          }
        }}
      >
        <Button
          content={this.props.content}
          onClick={this.props.onClick}
          primary
        />
      </Ref>
    );
  }
}

ConfirmButton.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.node
};

export default ConfirmableDeleteButton;
