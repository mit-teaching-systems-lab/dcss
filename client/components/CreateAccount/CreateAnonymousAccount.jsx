import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import { Button, Container, Header, Modal } from '@components/UI';
import anonymousUsername from './anonymousUsername';
import './CreateAnonymousAccount.css';

class CreateAnonymousAccount extends Component {
  constructor(props) {
    super(props);

    const from = this.props.location.state && this.props.location.state.from;

    this.state = {
      from,
      username: ''
    };

    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.generateUnusedAnonymousUsername();
  }

  async generateUnusedAnonymousUsername() {
    const username = anonymousUsername();
    // TODO: Move to own async action
    const { status } = await (await fetch(
      `/api/auth/signup/usernames/${username}/exists`
    )).json();

    if (status === 409) {
      return await this.generateUnusedAnonymousUsername();
    }

    if (username) {
      this.setState({ username });
    }
  }

  async onSubmit() {
    const { from, username } = this.state;
    const body = JSON.stringify({
      username
    });

    // TODO: move this to async action
    const { error, message } = await (await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    })).json();

    if (error) {
      this.setState({ message });
    } else {
      // Step outside of react to force a real reload
      // after signup and session create
      location.href = from ? `${from.pathname}${from.search}` : '/';
    }
  }

  onClick(event, { name }) {
    if (name === 'no') {
      this.generateUnusedAnonymousUsername();
    }
    if (name === 'nvm') {
      this.props.history.push('/login/create-account');
    }
  }

  render() {
    const { username } = this.state;
    const { onClick, onSubmit } = this;
    const header = 'Pick an anonymous username.';
    const content = 'Do you like this anonymous username?';

    const ariaLabelAnonymousUsername = `${content} ${username}`;
    const ariaLabelledby = 'dialog-anonymous-username-labelled';

    return (
      <Modal.Accessible open>
        <Modal
          open
          role="dialog"
          size="small"
          aria-modal="true"
          aria-labelledby={ariaLabelledby}
        >
          <Header
            icon="user outline"
            tabIndex="0"
            id={ariaLabelledby}
            content={header}
          />
          <LiveAnnouncer>
            <Modal.Content className="caa__centered" tabIndex="0">
              <LiveMessage
                aria-live="polite"
                message={ariaLabelAnonymousUsername}
              />
              <Container>{content}</Container>
              <Container>
                <code>{username}</code>
              </Container>
            </Modal.Content>
          </LiveAnnouncer>
          <Modal.Actions>
            <Button.Group fluid>
              <Button
                color="green"
                content="Yes, continue"
                name="yes"
                onClick={onSubmit}
              />
              <Button.Or />
              <Button
                color="orange"
                content="No, see another"
                name="no"
                onClick={onClick}
              />
              <Button.Or />
              <Button
                content="Go back to log in"
                name="nvm"
                onClick={onClick}
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    );
  }
}

CreateAnonymousAccount.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string
};

const mapStateToProps = state => {
  const { isLoggedIn, username } = state.login;
  return { isLoggedIn, username };
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(CreateAnonymousAccount)
);
