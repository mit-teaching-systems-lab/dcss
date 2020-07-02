import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, Icon, Menu, Popup, Ref } from '@components/UI';

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

    const ariaLabel = `Delete ${itemType}`.trim();
    const content = itemType
      ? `Are you sure you want to delete this ${itemType}?`
      : `Are you sure you want to delete?`;

    const onConfirmClick = () => {
      onConfirm();
      onComplete();
    };

    const cancelButton = 'No thanks';
    const confirmButton = (
      <ConfirmButton onClick={onConfirmClick} content="Confirm delete" />
    );

    const trigger = (
      <Menu.Item disabled={disabled} onClick={onClick}>
        <Icon name="trash alternate outline" aria-label={ariaLabel} />
      </Menu.Item>
    );
    return (
      <React.Fragment>
        <Popup content={ariaLabel} trigger={trigger} />
        <Confirm
          open={this.state.open}
          content={content}
          cancelButton={cancelButton}
          confirmButton={confirmButton}
          onCancel={onCancel}
          onConfirm={() => {
            onConfirm();
            onComplete();
          }}
        />
      </React.Fragment>
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
