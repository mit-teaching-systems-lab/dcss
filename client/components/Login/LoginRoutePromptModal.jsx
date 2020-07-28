import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Button, Grid, Header, Icon, Modal } from '@components/UI';
import './LoginRoutePromptModal.css';

class LoginRoutePromptModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(event, { name }) {
    const { location } = this.props;
    const state = { from: location };
    const redirect = {
      pathname: name,
      state
    };

    this.setState({ redirect });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={redirect} />;
    }

    const { onClick } = this;
    const actionLogin = 'Log in';
    const explainLogin = 'If you already have an account.';
    const ariaLabelLogin = `${actionLogin}. ${explainLogin}`;
    const buttonLogin = (
      <Button
        fluid
        size="large"
        name="/login"
        aria-label={ariaLabelLogin}
        onClick={onClick}
      >
        <Icon.Group className="loginroutepromptmodal__action-icon-spacing">
          <Icon name="user outline" />
          <Icon corner name="lock" />
        </Icon.Group>
        {actionLogin}
      </Button>
    );

    const actionCreateAccount = 'Create an account';
    const explainCreateAccount =
      'If you do not have an account, but wish to create one.';
    const ariaLabelCreateAccount = `${actionCreateAccount}. ${explainCreateAccount}`;
    const buttonCreateAccount = (
      <Button
        fluid
        size="large"
        name="/login/new"
        aria-label={ariaLabelCreateAccount}
        onClick={onClick}
      >
        <Icon.Group className="loginroutepromptmodal__action-icon-spacing">
          <Icon name="user outline" />
          <Icon corner name="plus" />
        </Icon.Group>
        {actionCreateAccount}
      </Button>
    );

    const actionContinueAnonymously = 'Continue anonymously';
    const explainContinueAnonymously =
      'If you do not have an account, and do not wish to create one.';
    const ariaLabelContinueAnonymously = `${actionContinueAnonymously}. ${explainContinueAnonymously}`;
    const buttonContinueAnonymously = (
      <Button
        fluid
        size="large"
        name="/login/anonymous"
        aria-label={ariaLabelContinueAnonymously}
        onClick={onClick}
      >
        <Icon.Group className="loginroutepromptmodal__action-icon-spacing">
          <Icon name="user outline" />
          <Icon corner name="question" />
        </Icon.Group>
        {actionContinueAnonymously}
      </Button>
    );
    return (
      <Modal.Accessible open>
        <Modal open role="dialog" aria-modal="true" size="small">
          <Header
            icon="user outline"
            content="Create an account, Continue anonymously, or Log in?"
            tabIndex="0"
          />
          <Modal.Content tabIndex="0">
            <p>Please choose one of the following options:</p>
            <Grid columns={2} divided>
              <Grid.Row>
                <Grid.Column>{buttonCreateAccount}</Grid.Column>
                <Grid.Column>
                  <p>{explainCreateAccount}</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>{buttonContinueAnonymously}</Grid.Column>
                <Grid.Column>
                  <p>{explainContinueAnonymously}</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>{buttonLogin}</Grid.Column>
                <Grid.Column>
                  <p>{explainLogin}</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </Modal.Accessible>
    );
  }
}

LoginRoutePromptModal.propTypes = {
  location: PropTypes.object
};

export default LoginRoutePromptModal;
