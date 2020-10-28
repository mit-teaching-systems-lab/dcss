import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Grid, Header, Message, Modal } from '@components/UI';
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

    this.timeout = null;
    this.validFormInput = this.validFormInput.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChange = this.onChange.bind(this);
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
    if (this.props.onCancel) {
      this.setState({ open: false });
      this.props.onCancel();
    } else {
      this.props.history.push('/scenarios');
    }
  }

  render() {
    const { onChange, onCancel, onSubmit } = this;
    const {
      username,
      personalname,
      email,
      confirmPassword,
      password,
      open,
      error,
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
                <label htmlFor="personalname">
                  Personal name (full name, or alias):
                </label>
                <Form.Input
                  name="personalname"
                  autoComplete="personalname"
                  placeholder="..."
                  defaultValue={personalname || ''}
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
                  <Message
                    floating
                    {...messageProps}
                    style={{ textAlign: 'left' }}
                  />
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  errors: PropTypes.object,
  getUser: PropTypes.func,
  setUser: PropTypes.func,
  user: PropTypes.object,
  open: PropTypes.bool,
  onCancel: PropTypes.func
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
