import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, Modal } from '@components/UI';
import { getUser, resetPassword } from '@actions/user';
import { logOut } from '@actions/session';
import './LoginRoutePromptModal.css';

class ResetRoutePromptModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      email: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onBlurOrFocus = this.onBlurOrFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (this.props.user.id) {
      await this.props.logOut();
    }

    this.setState({
      isReady: true
    });
  }

  onBlurOrFocus(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value });
  }

  onSubmit() {
    if (!confirm('Are you sure you want to reset your password?')) {
      this.props.history.push('/login');
      return;
    }

    (async () => {
      const { email } = this.state;
      const result = await this.props.resetPassword({ email });
      if (result) {
        this.props.history.push('/login');
      }
    })();
  }

  render() {
    const { isReady } = this.state;

    if (!isReady) {
      return null;
    }

    const { onChange, onBlurOrFocus, onSubmit } = this;

    return (
      <Modal.Accessible open>
        <Modal open role="dialog" aria-modal="true" size="small">
          <Header
            icon="user outline"
            content="Reset your password"
            tabIndex="0"
          />
          <Modal.Content tabIndex="0">
            <p>
              Enter the email that you used to create your account and hit
              &quot;Reset&quot;. If there is an account associated with that
              email, a single-use password will be sent to the email address
              provided.
            </p>
            <p>
              <b>Be sure to check your spam folder!</b>
            </p>
            <Form onSubmit={onSubmit}>
              <Form.Field>
                <label htmlFor="email">Email</label>
                <Form.Input
                  autoComplete="email"
                  id="email"
                  name="email"
                  type="email"
                  onBlur={onBlurOrFocus}
                  onFocus={onBlurOrFocus}
                  onChange={onChange}
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
                      aria-label="Click to reset your password and recieve a single-use password by email."
                      size="large"
                      type="submit"
                      onClick={onSubmit}
                    >
                      Reset
                    </Button>
                    <Button.Or />
                    <Button
                      aria-label="Click to go back to log in."
                      to="/login"
                      size="large"
                      as={NavLink}
                    >
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

ResetRoutePromptModal.propTypes = {
  getUser: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  logOut: PropTypes.func,
  resetPassword: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  getUser: () => dispatch(getUser()),
  resetPassword: params => dispatch(resetPassword(params))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResetRoutePromptModal)
);
