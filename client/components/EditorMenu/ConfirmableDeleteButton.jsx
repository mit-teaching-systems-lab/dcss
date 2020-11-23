import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Header,
  Icon,
  Menu,
  Modal,
  Popup,
  Ref
} from '@components/UI';

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
      onConfirm && onConfirm();
      onComplete && onComplete();
    };

    const confirmButton = (
      <ConfirmButton content="Yes" onClick={onConfirmClick} />
    );

    const trigger = (
      <Menu.Item.Tabbable
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={onClick}
      >
        <Icon name="trash alternate outline" />
      </Menu.Item.Tabbable>
    );
    return (
      <Fragment>
        <Popup inverted size="tiny" content={ariaLabel} trigger={trigger} />
        <Modal role="dialog" aria-modal="true" size="small" open={open}>
          <Header
            icon="trash alternate outline"
            aria-label={content}
            content={content}
          />
          <Modal.Actions style={{ borderTop: '0px' }}>
            <Button.Group size="large" fluid>
              {confirmButton}
              <Button.Or />
              <Button onClick={onCancel}>No</Button>
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
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  onConfirm: PropTypes.func
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
