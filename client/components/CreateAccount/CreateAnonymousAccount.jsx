import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Header, Modal, Popup } from 'semantic-ui-react';
import { logIn } from '@actions';
import Loading from '@components/Loading';
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
    const header = username
      ? 'Do you like this anonymous user name?'
      : 'Find an anonymous user name for you.';
    return (
      <Modal open size="small">
        <Header icon="user outline" content={header} />
        <Modal.Content>
          {username ? (
            <Header as="h1" className="createanonymousaccount__header-centered">
              <code>{username}</code>
            </Header>
          ) : (
            <Loading />
          )}
        </Modal.Content>
        <Modal.Actions style={{ height: '75px' }}>
          <Button.Group fluid size="large">
            <Popup
              content="Go back"
              position="bottom center"
              trigger={
                <Button
                  content="Nevermind, go back"
                  name="nvm"
                  onClick={onClick}
                />
              }
            />
            <Button.Or />
            <Popup
              content="Show me another available user name."
              position="bottom center"
              trigger={
                <Button
                  color="orange"
                  content="No, see another"
                  name="no"
                  onClick={onClick}
                />
              }
            />
            <Button.Or />
            <Popup
              content="Select this user name to continue."
              position="bottom center"
              trigger={
                <Button
                  color="green"
                  content="Yes, continue"
                  name="yes"
                  onClick={onSubmit}
                />
              }
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}

CreateAnonymousAccount.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string
};

const mapStateToProps = state => {
  const { isLoggedIn, username } = state.login;
  return { isLoggedIn, username };
};

const mapDispatchToProps = {
  logIn
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateAnonymousAccount)
);
