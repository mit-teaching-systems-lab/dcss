import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, Container, Header, Icon, Modal, Popup } from '@components/UI';
import copy from 'copy-text-to-clipboard';
import './ConfirmableLogout.css';
import './Login.css';

class ConfirmableLogout extends Component {
  constructor(props) {
    super(props);
    const { open } = this.props;
    this.state = {
      open,
      name: 'clipboard outline'
    };
    this.onCancel = this.onCancel.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }
  onCancel() {
    this.setState({ open: false });
    this.props.onCancel();
  }
  onConfirm() {
    this.setState({ open: false });
    this.props.history.push('/logout');
  }
  render() {
    const { onCancel, onConfirm } = this;
    const { open, name } = this.state;
    const {
      user: { username }
    } = this.props;

    return (
      <Modal.Accessible open={open}>
        <Modal role="dialog" aria-modal="true" size="small" open={open}>
          <Header icon="log out" content="Log out confirmation" />
          <Modal.Content>
            <Container style={{ textAlign: 'center' }}>
              <p>You are currently logged in as: </p>
              <Popup
                inverted
                size="tiny"
                content="Copy user name to clipboard"
                trigger={
                  <Button
                    icon
                    className="clmi__button"
                    content={
                      <React.Fragment>
                        <code>{username}</code>
                        <Icon name={name} />
                      </React.Fragment>
                    }
                    onClick={() => {
                      copy(username);
                      this.setState({
                        name: 'clipboard'
                      });
                    }}
                  />
                }
              />
              <p>Are you sure you want to log out?</p>
            </Container>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group fluid>
              <Button onClick={onConfirm} primary size="large">
                Yes, log me out
              </Button>
              <Button.Or />
              <Button onClick={onCancel} size="large">
                Cancel
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    );
  }
}

ConfirmableLogout.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object,
  open: PropTypes.bool,
  onCancel: PropTypes.func
};

export default withRouter(ConfirmableLogout);
