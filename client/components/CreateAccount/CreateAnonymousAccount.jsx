import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { LiveAnnouncer, LiveMessage } from 'react-aria-live';
import { Button, Container, Header, Modal } from '@components/UI';
import { notify } from '@components/Notification';
import { signUp, getUser } from '@actions/user';
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
      `/api/session/usernames/${username}/exists`
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

    await this.props.signUp({ username });

    if (this.props.errors.user) {
      const { message } = this.props.errors.user;
      await notify({ message, color: 'red' });
    } else {
      await notify({ message: 'User created!', color: 'green' });
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
  errors: PropTypes.object,
  getUser: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  signUp: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { errors, user } = state;
  return { errors, user };
};

const mapDispatchToProps = dispatch => ({
  getUser: (id, params) => dispatch(getUser(id, params)),
  signUp: params => dispatch(signUp(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateAnonymousAccount)
);
