import React from 'react';
import PropTypes from 'prop-types';
import { Confirm, Icon, Menu, Popup } from 'semantic-ui-react';

class ConfirmableDeleteButton extends React.Component {
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

    return (
      <React.Fragment>
        <Popup
          content={ariaLabel}
          trigger={
            <Menu.Item disabled={disabled} onClick={onClick}>
              <Icon name="trash alternate outline" aria-label={ariaLabel} />
            </Menu.Item>
          }
        />
        <Confirm
          open={this.state.open}
          content={content}
          cancelButton="No Thanks"
          confirmButton="Confirm Delete"
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
export default ConfirmableDeleteButton;
