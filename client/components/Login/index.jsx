import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, Message, Modal } from '@components/UI';
import { logIn, logOut } from '@actions';
import './Login.css';

const method = 'POST';

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

    this.onCreateAccountClick = this.onCreateAccountClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.doLogin = this.doLogin.bind(this);
    this.doLogout = this.doLogout.bind(this);

    if (mode === 'logout') {
      this.doLogout();
    }
  }

  onCreateAccountClick() {
    this.props.history.push('/login/create-account');
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.doLogin();
  }

  async doLogin() {
    let { from, username, password } = this.state;

    username = username.trim();

    const body = JSON.stringify({
      username,
      password
    });

    const { error, message } = await (await fetch('/api/auth/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method,
      body
    })).json();

    if (error) {
      this.setState({
        error: {
          message
        }
      });
    } else {
      // Step outside of react to force a real reload
      // after signup and session create
      //
      // TODO: assess whether this should be necessary or not.
      //
      location.href = from ? `${from.pathname}${from.search}` : '/';
    }
  }

  doLogout() {
    this.props.logOut();
  }

  render() {
    const { error, password, username } = this.state;
    const { onChange, onCreateAccountClick, onSubmit } = this;

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
      <Modal open role="dialog" aria-modal="true" size="small">
        <Header icon="user outline" content="Log In" />
        <Modal.Content>
          <Form onSubmit={onSubmit}>
            <Form.Field>
              <label htmlFor="username">Username</label>
              <Form.Input
                name="username"
                autoComplete="username"
                onChange={onChange}
                value={username}
              />
            </Form.Field>
            <Form.Field>
              <label htmlFor="password">Password</label>
              <Form.Input
                name="password"
                type="password"
                autoComplete="current-password"
                onChange={onChange}
                value={password}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions className="modal__action-height">
          <Grid columns={2}>
            <Grid.Column>
              <Message floating {...messageProps} style={{ textAlign: 'left' }}>
                {error.message}
              </Message>
            </Grid.Column>
            <Grid.Column>
              <Button.Group>
                <Button primary type="submit" onClick={onSubmit} size="large">
                  Log in
                </Button>
                <Button.Or />
                <Button size="large" onClick={onCreateAccountClick}>
                  Create an account
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Modal.Actions>
      </Modal>
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
  mode: PropTypes.string,
  username: PropTypes.string
};

const mapStateToProps = state => {
  const { isLoggedIn, username, permissions } = state.login;
  return { isLoggedIn, username, permissions };
};

const mapDispatchToProps = {
  logIn,
  logOut
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);
