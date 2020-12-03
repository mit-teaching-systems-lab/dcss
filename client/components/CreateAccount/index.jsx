import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { notify } from '@components/Notification';
import { Button, Form, Grid, Header, Modal, Text } from '@components/UI';
import { signUp, getUser } from '@actions/user';

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

    let field = '';
    let message = '';

    if (!username) {
      field = 'username';
      message = 'Username must not be empty.';
    } else {
      if (password) {
        if (!confirmPassword) {
          field = 'confirmPassword';
          message = 'Please confirm your new password.';
        } else {
          if (password !== confirmPassword) {
            field = 'confirmPassword';
            message = 'Passwords do not match.';
          }
        }
      }
    }

    if (message) {
      notify({ message, color: 'red', time: 3000 });
      this.setState({
        error: {
          field,
          message
        }
      });
      return false;
    }
    return true;
  }

  async onSubmit() {
    if (!this.validFormInput()) {
      return;
    }

    const { email, from, password, username } = this.state;

    await this.props.signUp({ email, username, password });

    if (this.props.errors.user) {
      const { message } = this.props.errors.user;
      const field = message.includes('username') ? 'username' : 'email';
      this.setState({ error: { field, message } });
    } else {
      await notify({ message: 'User created!', color: 'green' });
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
    const { onCancel, onChange, onSubmit } = this;
    const { email, error, username } = this.state;

    return (
      <Modal.Accessible open={true}>
        <Modal
          closeIcon
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-a-new-user-account"
          size="small"
          onClose={onCancel}
          open={true}
        >
          <Header
            id="create-a-new-user-account"
            icon="user outline"
            content="Create a new user account"
          />
          <Modal.Content>
            <Form onSubmit={onSubmit}>
              <Form.Field>
                <label htmlFor="username">
                  Username:{' '}
                  {error.field === 'username' ? (
                    <Text right error>
                      {error.message}
                    </Text>
                  ) : null}
                </label>
                <Form.Input
                  aria-label="Username"
                  name="username"
                  autoComplete="off"
                  placeholder="..."
                  defaultValue={username || ''}
                  onChange={onChange}
                  {...(error.field === 'username' && { error: true })}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="email">
                  Email address:{' '}
                  {error.field === 'email' ? (
                    <Text error>{error.message}</Text>
                  ) : null}
                </label>
                <Form.Input
                  aria-label="Email address"
                  name="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  defaultValue={email || ''}
                  onChange={onChange}
                  {...(error.field === 'email' && { error: true })}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="password">
                  New password:{' '}
                  {error.field === 'password' ? (
                    <Text error>{error.message}</Text>
                  ) : null}
                </label>
                <Form.Input
                  aria-label="New password"
                  name="password"
                  autoComplete="new-password"
                  type="password"
                  defaultValue=""
                  onChange={onChange}
                  {...(error.field === 'password' && { error: true })}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="confirmPassword">
                  Confirm new password:{' '}
                  {error.field === 'confirmPassword' ? (
                    <Text error>{error.message}</Text>
                  ) : null}
                </label>
                <Form.Input
                  aria-label="Confirm new password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  type="password"
                  defaultValue=""
                  onChange={onChange}
                  {...(error.field === 'confirmPassword' && { error: true })}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Button.Group fluid>
                    <Button
                      primary
                      size="large"
                      type="submit"
                      onClick={onSubmit}
                    >
                      Submit
                    </Button>
                    <Button.Or />
                    <Button size="large" onClick={onCancel}>
                      Cancel
                    </Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Actions>
        </Modal>
      </Modal.Accessible>
    );
  }
}

CreateAccount.propTypes = {
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
  )(CreateAccount)
);
