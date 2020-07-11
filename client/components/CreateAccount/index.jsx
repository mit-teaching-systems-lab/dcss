import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, Message, Modal } from '@components/UI';
import { logIn } from '@actions';

class CreateAccount extends Component {
  constructor(props) {
    super(props);

    const from = this.props.location.state && this.props.location.state.from;

    this.state = {
      from,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: {
        field: '',
        message: ''
      }
    };

    this.validFormInput = this.validFormInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  validFormInput(event) {
    const error = {
      field: '',
      message: ''
    };

    if (event) {
      const {
        type,
        target: { name: field, value }
      } = event;
      if (type === 'blur') {
        if (!value) {
          let message = `Please enter a ${field}.`;

          if (field === 'confirmPassword') {
            message = !this.state.password
              ? 'Please enter and confirm your password.'
              : 'Password fields do not match.';
          }

          this.setState({
            error: {
              field,
              message
            }
          });
          return false;
        }
        this.setState({ error });
        return true;
      }
    }

    const { confirmPassword, password, username } = this.state;

    if (!username) {
      this.setState({
        error: {
          field: 'username',
          message: 'Please enter a username.'
        }
      });
      return false;
    }

    if (!password) {
      this.setState({
        error: {
          field: 'password',
          message: 'Please enter a password.'
        }
      });
      return false;
    }

    if (password !== confirmPassword) {
      this.setState({
        error: {
          field: 'confirmPassword',
          message: 'Password fields do not match.'
        }
      });
      return false;
    }

    this.setState({ error });
    return true;
  }

  async onSubmit() {
    if (!this.validFormInput()) {
      return;
    }

    const { email, from, password, username } = this.state;

    const body = JSON.stringify({
      email,
      password,
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
      const field = message.includes('username') ? 'username' : 'email';
      this.setState({ error: { field, message } });
    } else {
      // Step outside of react to force a real reload
      // after signup and session create
      location.href = from ? `${from.pathname}${from.search}` : '/';
    }
  }

  onChange(event, { name, value }) {
    if (this.state.message) {
      this.setState({ error: { field: '', message: '' } });
    }
    this.setState({ [name]: value });
  }

  onCancel(event) {
    event.preventDefault();
    this.props.history.push('/login');
  }

  render() {
    const { email, confirmPassword, error, password, username } = this.state;
    const { onChange, onCancel, onSubmit, validFormInput } = this;
    const messageProps = {
      hidden: true,
      color: 'red'
    };

    if (error.message) {
      messageProps.hidden = false;
    }

    return (
      <Modal
        closeIcon
        role="dialog"
        aria-modal="true"
        size="small"
        onClose={onCancel}
        open={true}
      >
        <Header icon="user outline" content="Create a new user account" />
        <Modal.Content>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <Form.Input
                required
                label="Username:"
                name="username"
                autoComplete="off"
                onChange={onChange}
                onBlur={validFormInput}
                value={username}
                {...(error && error.field === 'username'
                  ? { error: true }
                  : {})}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                name="email"
                label="Email address:"
                autoComplete="email"
                placeholder="(Optional)"
                onChange={onChange}
                value={email}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                required
                label="Password:"
                name="password"
                type="password"
                autoComplete="new-password"
                onChange={onChange}
                onBlur={validFormInput}
                value={password}
                {...(error && error.field === 'password'
                  ? { error: true }
                  : {})}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                required
                label="Confirm password:"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                onChange={onChange}
                onBlur={validFormInput}
                value={confirmPassword}
                {...(error && error.field === 'confirmPassword'
                  ? { error: true }
                  : {})}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Button.Group fluid>
                  <Button primary type="submit" onClick={onSubmit} size="large">
                    Submit
                  </Button>
                  <Button.Or />
                  <Button onClick={onCancel} size="large">
                    Cancel
                  </Button>
                </Button.Group>
                <Message
                  floating
                  {...messageProps}
                  style={{ textAlign: 'left' }}
                >
                  {error.message}
                </Message>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      </Modal>
    );
  }
}

CreateAccount.propTypes = {
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
  )(CreateAccount)
);
