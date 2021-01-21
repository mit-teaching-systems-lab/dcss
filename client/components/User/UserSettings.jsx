import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { notify } from '@components/Notification';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Modal,
  Text
} from '@components/UI';
import { getUser, setUser } from '@actions/user';
import './User.css';

const anonymousMode =
  'You are currently in anonymous mode. Set an email address and password to become a full user.';

class UserSettings extends Component {
  constructor(props) {
    super(props);

    const { open } = this.props;
    const { email, personalname, username } = this.props.user;

    this.state = {
      open,
      username,
      email,
      personalname,
      password: '',
      confirmPassword: '',
      error: {
        field: '',
        message: ''
      },
      success: {
        message: ''
      }
    };

    this.validateFormInput = this.validateFormInput.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.user && this.props.user.username === null && this.props.id) {
      await this.props.getUser(this.props.id);
    }
  }

  validateFormInput() {
    const { confirmPassword, email, password, username } = this.state;
    let field = '';
    let message = '';

    if (!username) {
      field = 'username';
      message = 'Username must not be empty.';
    } else {
      if (this.props.user.email && !email) {
        field = 'email';
        message = 'Email must not be empty.';
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
    if (!this.validateFormInput()) {
      return;
    }

    const { email, personalname, password, username } = this.state;
    const updates = {};

    if (email !== this.props.user.email) {
      updates.email = email;
    }

    if (personalname !== this.props.user.personalname) {
      updates.personalname = personalname;
    }

    if (username !== this.props.user.username) {
      updates.username = username;
    }

    if (password) {
      updates.password = password;
    }

    await this.props.setUser(updates);

    if (this.props.errors.user) {
      const { message } = this.props.errors.user;

      if (message === 'Username is already in use.') {
        this.setState({
          error: {
            field: 'username',
            message
          }
        });
      }
    } else {
      notify({ message: 'Settings saved', color: 'green' });
    }
  }

  onCancel() {
    if (this.props.onCancel) {
      this.setState({ open: false });
      this.props.onCancel();
    } else {
      this.props.history.push('/scenarios');
    }
  }

  onChange(event, { name, value }) {
    if (this.state.error.message) {
      this.setState({ error: { field: '', message: '' } });
    }
    this.setState({ [name]: value });
  }

  render() {
    const { onCancel, onChange, onSubmit } = this;
    const { username, personalname, email, open, error } = this.state;

    const { user } = this.props;

    const anonymousModeFormProps = {
      className: user.is_anonymous ? 'us__anonymous-form' : 'us__reified-form'
    };

    const anonymousModeMessageProps = {
      className: user.is_anonymous
        ? 'us__anonymous-message'
        : 'us__reified-message'
    };

    return (
      <Modal.Accessible open={open}>
        <Modal
          closeIcon
          role="dialog"
          aria-modal="true"
          size="small"
          onClose={onCancel}
          open={open}
        >
          <Header icon="settings" content="Settings" />
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
                <label htmlFor="personalname">
                  Personal name (full name, or alias):{' '}
                  {error.field === 'personalname' ? (
                    <Text error>{error.message}</Text>
                  ) : null}
                </label>
                <Form.Input
                  aria-label="Personal name"
                  name="personalname"
                  placeholder="..."
                  defaultValue={personalname || ''}
                  onChange={onChange}
                  {...(error.field === 'personalname' && { error: true })}
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
              <div {...anonymousModeFormProps}>
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
              </div>
              <div {...anonymousModeMessageProps}>
                <Message color="orange" content={anonymousMode} />
              </div>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Button.Group fluid>
                    <Button
                      primary
                      type="submit"
                      size="large"
                      onClick={onSubmit}
                    >
                      Save
                    </Button>
                    <Button.Or />
                    <Button tabIndex="0" size="large" onClick={onCancel}>
                      Close
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

UserSettings.propTypes = {
  errors: PropTypes.object,
  getUser: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.node,
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  setUser: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { errors, user } = state;
  return { errors, user };
};

const mapDispatchToProps = dispatch => ({
  setUser: (id, params) => dispatch(setUser(id, params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserSettings)
);
