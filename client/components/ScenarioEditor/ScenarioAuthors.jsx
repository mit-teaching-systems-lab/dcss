import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import { Button, Container, Form, Grid, Popup } from '@components/UI';
import { getScenario, setScenario } from '@actions/scenario';
import { getUsers, getUsersByPermission } from '@actions/users';

// import { notify } from '@components/Notification';

class ScenarioAuthors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      authors: [],
      reviewers: []
    };

    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    const { getUsers, getUsersByPermission } = this.props;

    if (!this.props.users.length) {
      await getUsers();
    }

    const authors = await getUsersByPermission('edit_scenario');
    const reviewers = this.props.users.filter(({ id }) => {
      //
      //
      // TODO: what kind of users can be reviewers?
      //
      //
      return !authors.find(author => author.id === id);
    });

    this.setState({
      isReady: true,
      authors,
      reviewers
    });
  }

  async onChange(event, { name, value }) {
    // eslint-disable-next-line no-console
    console.log('onChange', event, { name, value });
  }

  render() {
    // const { onChange } = this;
    // const { scenario } = this.props;

    // const { isReady, authors, reviewers } = this.state;

    // if (!isReady) {
    //   return null;
    // }

    return <Fragment></Fragment>;
  }
}

ScenarioAuthors.propTypes = {
  scenario: PropTypes.object,
  getScenario: PropTypes.func.isRequired,
  setScenario: PropTypes.func.isRequired,
  user: PropTypes.object,
  users: PropTypes.array,
  getUsers: PropTypes.func.isRequired,
  getUsersByPermission: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const { user, users } = state;
  return {
    user,
    users
  };
};

const mapDispatchToProps = dispatch => ({
  getScenario: id => dispatch(getScenario(id)),
  setScenario: params => dispatch(setScenario(params)),
  getUsers: () => dispatch(getUsers()),
  getUsersByPermission: permission => dispatch(getUsersByPermission(permission))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioAuthors);
