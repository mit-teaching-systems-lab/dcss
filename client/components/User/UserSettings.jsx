import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Header,
  Menu,
  Message,
  Modal
} from '@components/UI';
import { getUser, setUser } from '@actions/user';
import './User.css';

const anonymousMode =
  'You are currently in anonymous mode. Set an email address and password to become a full user.';

class UserSettings extends Component {
  constructor(props) {
    super(props);

    const { email, username } = this.props.user;

    this.state = {
      open: false,
      username,
      email,
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

    this.timeout = null;
    this.validFormInput = this.validFormInput.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  validFormInput() {
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

    if (password) {
      if (!confirmPassword) {
        this.setState({
          error: {
            field: 'password',
            message: 'Please confirm your new password.'
          }
        });
        return false;
      } else {
        if (password !== confirmPassword) {
          this.setState({
            error: {
              field: 'password',
              message: 'Password confirmation does not match.'
            }
          });
          return false;
        }
      }
    }

    this.setState({
      error: {
        field: '',
        message: ''
      }
    });

    return true;
  }

  async onSubmit() {
    if (!this.validFormInput()) {
      return;
    }

    const { email, password, username } = this.state;
    const updates = {};

    if (email !== this.props.user.email) {
      updates.email = email;
    }

    if (username !== this.props.user.username) {
      updates.username = username;
    }

    if (password) {
      updates.password = password;
    }

    const result = await this.props.setUser(updates);

    if (!result) {
      return;
    }

    if (this.props.errors.user) {
      this.setState({
        error: {
          message: this.props.errors.user.message
        }
      });
    } else {
      this.setState({
        success: {
          message: 'User settings updated!'
        }
      });

      this.timeout = setTimeout(() => {
        this.setState({
          success: {
            message: ''
          }
        });
      }, 3000);
    }
  }

  onChange(event, { name, value }) {
    if (this.state.message) {
      this.setState({ error: { field: '', message: '' } });
    }
    this.setState({ [name]: value });
  }

  onCancel() {
    this.setState({ open: false });
  }

  onClick() {
    this.setState({ open: true });
  }

  render() {
    const { onChange, onCancel, onClick, onSubmit } = this;
    const {
      open,
      email,
      confirmPassword,
      error,
      password,
      username,
      success
    } = this.state;

    const { user } = this.props;

    const messageProps = {
      hidden: true
    };

    if (error.message) {
      messageProps.hidden = false;
      messageProps.color = 'red';
      messageProps.content = error.message;
    }

    if (success.message) {
      messageProps.hidden = false;
      messageProps.color = 'green';
      messageProps.content = success.message;
    }

    const anonymousModeFormProps = {
      className: user.is_anonymous ? 'us__anonymous-form' : 'us__reified-form'
    };

    const anonymousModeMessageProps = {
      className: user.is_anonymous
        ? 'us__anonymous-message'
        : 'us__reified-message'
    };

    return (
      <Fragment>
        <Menu.Item onClick={onClick}>Settings</Menu.Item>
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
                <label htmlFor="username">Username:</label>
                <Form.Input
                  name="username"
                  autoComplete="username"
                  placeholder="..."
                  defaultValue={username || ''}
                  onChange={onChange}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="email">Email address:</label>
                <Form.Input
                  name="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  defaultValue={email || ''}
                  onChange={onChange}
                />
              </Form.Field>
              <div {...anonymousModeFormProps}>
                <Form.Field>
                  <label htmlFor="password">New password:</label>
                  <Form.Input
                    name="password"
                    autoComplete="new-password"
                    type="password"
                    defaultValue={password || ''}
                    onChange={onChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label htmlFor="confirmPassword">Confirm new password:</label>
                  <Form.Input
                    name="confirmPassword"
                    autoComplete="new-password"
                    type="password"
                    defaultValue={confirmPassword || ''}
                    onChange={onChange}
                  />
                </Form.Field>
              </div>
              <div {...anonymousModeMessageProps}>
                <Message color="orange" content={anonymousMode} />
              </div>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Grid stackable columns={2}>
              <Grid.Column>
                <Message
                  floating
                  {...messageProps}
                  style={{ textAlign: 'left' }}
                />
              </Grid.Column>
              <Grid.Column>
                <Button.Group fluid>
                  <Button primary type="submit" onClick={onSubmit} size="large">
                    Save
                  </Button>
                  <Button.Or />
                  <Button onClick={onCancel} size="large">
                    Close
                  </Button>
                </Button.Group>
              </Grid.Column>
            </Grid>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

UserSettings.propTypes = {
  errors: PropTypes.object,
  getUser: PropTypes.func,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserSettings);
