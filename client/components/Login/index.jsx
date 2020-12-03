import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, Message, Modal } from '@components/UI';
import { logIn, logOut } from '@actions/session';
import Messages from './messages';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    const from = this.props.location.state && this.props.location.state.from;
    const mode =
      this.props.mode || this.props.location.pathname.includes('logout')
        ? 'logout'
        : 'login';
    const isLoggedIn = false;
    const message = '';
    const username = '';
    const password = '';

    this.state = {
      error: {
        message
      },
      from,
      isLoggedIn,
      mode,
      username,
      password
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);

    if (mode === 'logout') {
      this.doLogout();
    }

    if (mode === 'reset') {
      this.doLogout();
    }
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.doLogin();
  }

  async doLogin() {
    const { error, message } = await this.props.logIn(this.state);

    if (error) {
      if (Messages[message]) {
        this.setState({
          error: {
            message: Messages[message]
          }
        });
      } else {
        this.setState({
          error: {
            message
          }
        });
      }
    } else {
      const { from } = this.state;
      // Step outside of react to force a real reload
      location.href = from ? `${from.pathname}${from.search}` : '/';
    }
  }

  async doLogout() {
    await this.props.logOut();
    this.props.history.push('/scenarios');
  }

  render() {
    const { error, password, username } = this.state;
    const { onChange, onSubmit } = this;

    // Previously, we would not render anything here and
    // allow the action handler to set location.href.
    // if (mode === 'logout') {
    //   return null;
    // }
    //
    const messageProps = {
      hidden: true,
      color: 'red'
    };

    if (error.message) {
      messageProps.hidden = false;
    }

    return (
      <Modal.Accessible open>
        <Modal open role="dialog" aria-modal="true" size="small">
          <Header tabIndex="0" icon="user outline" content="Log In" />
          <Modal.Content>
            <Form onSubmit={onSubmit}>
              <Form.Field>
                <label htmlFor="username">Username</label>
                <Form.Input
                  autoComplete="username"
                  id="username"
                  name="username"
                  onChange={onChange}
                  value={username}
                />
              </Form.Field>
              <Form.Field>
                <label htmlFor="password">Password</label>
                <Form.Input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  type="password"
                  onChange={onChange}
                  value={password}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Button
                    primary
                    size="large"
                    type="submit"
                    onClick={onSubmit}
                    style={{ width: '100%' }}
                  >
                    Log in
                  </Button>
                  <Button.Group fluid>
                    <Button
                      className="login__buttons"
                      to="/login/reset"
                      size="large"
                      as={NavLink}
                    >
                      Reset Password
                    </Button>
                    <Button.Or />
                    <Button
                      className="login__buttons"
                      to="/login/create-account"
                      size="large"
                      as={NavLink}
                    >
                      Create an account
                    </Button>
                    <Button.Or />
                    <Button
                      className="login__buttons"
                      to="/scenarios/"
                      size="large"
                      as={NavLink}
                    >
                      Go back to scenarios
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
      </Modal.Accessible>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object,
  logIn: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
  mode: PropTypes.string
};

const mapStateToProps = state => {
  const { isLoggedIn } = state.session;
  return { isLoggedIn };
};

const mapDispatchToProps = dispatch => ({
  logIn: params => dispatch(logIn(params)),
  logOut: () => dispatch(logOut())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
