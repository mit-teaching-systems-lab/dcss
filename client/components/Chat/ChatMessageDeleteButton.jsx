import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Modal, Ref } from '@components/UI';

class ChatMessageDeleteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.onClick = this.onClick.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onClick() {
    this.setState({ open: true });
  }

  onCancel() {
    this.setState({ open: false });
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onConfirm() {
    this.setState({ open: false });
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  }

  render() {
    const { onCancel, onClick, onConfirm } = this;
    const { open } = this.state;

    const ariaLabel = this.props['aria-label'].trim();
    const content = 'Are you sure you want to delete this message?';

    const confirmButton = <ConfirmButton content="Yes" onClick={onConfirm} />;

    const deleteButton = (
      <Button
        size="mini"
        icon="trash alternate outline"
        aria-label={ariaLabel}
        onClick={onClick}
      />
    );

    return (
      <Fragment>
        {deleteButton}
        {open ? (
          <Modal.Accessible open={open}>
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
          </Modal.Accessible>
        ) : null}
      </Fragment>
    );
  }
}

ChatMessageDeleteButton.propTypes = {
  'aria-label': PropTypes.string,
  onCancel: PropTypes.func,
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

export default ChatMessageDeleteButton;
