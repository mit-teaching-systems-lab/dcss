import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Modal } from '@components/UI';
import './Lobby.css';

class LobbyConfirmationDialog extends Component {
  render() {
    const { header = '', content = '' } = this.props;

    const primary = {
      ...this.props?.buttons?.primary
    };

    const secondary = {
      ...this.props?.buttons?.secondary
    };

    const primaryButtonProps = {
      content: primary?.content,
      primary: true,
      onClick: () => {
        if (primary?.onClick) {
          primary?.onClick();
        }
      }
    };

    const secondaryButtonProps = {
      content: secondary?.content,
      onClick: () => {
        if (secondary?.onClick) {
          secondary?.onClick();
        }
      }
    };

    const showPrimaryButton = !!primaryButtonProps.content;
    const showSecondaryButton = !!secondaryButtonProps.content;
    const showOrButton = showPrimaryButton && showSecondaryButton;

    return (
      <Modal.Accessible open>
        <Modal
          closeIcon
          open
          aria-modal="true"
          role="dialog"
          size="tiny"
          onClose={secondaryButtonProps.onClick}
        >
          <Header icon="group" content={header} />
          <Modal.Content>{content}</Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              {showPrimaryButton ? <Button {...primaryButtonProps} /> : null}
              {showOrButton ? <Button.Or /> : null}
              {showSecondaryButton ? (
                <Button {...secondaryButtonProps} />
              ) : null}
            </Button.Group>
          </Modal.Actions>
          <div data-testid="lobby-confirmation-dialog" />
        </Modal>
      </Modal.Accessible>
    );
  }
}

LobbyConfirmationDialog.propTypes = {
  header: PropTypes.any,
  content: PropTypes.any,
  buttons: PropTypes.object
};

export default LobbyConfirmationDialog;
