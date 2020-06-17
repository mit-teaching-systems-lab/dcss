import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react';

import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import Users from './Users';
import './Admin.css';

class Admin extends Component {
  constructor(props) {
    super(props);

    const { activeTab = 'users' } = this.props;

    this.state = {
      isReady: false,
      activeTab,
      tabs: {
        users: this.getTab('users')
      }
    };
    this.onClick = this.onClick.bind(this);
    this.getTab = this.getTab.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      this.setState({
        isReady: true
      });
    }
  }

  onClick(e, { name: activeTab }) {
    this.setState({ activeTab });
  }

  getTab(name) {
    switch (name) {
      case 'users':
        return <Users {...this.props} />;
      default:
        return null;
    }
  }

  render() {
    const { isReady, activeTab } = this.state;
    const { onClick } = this;

    if (!isReady) {
      return <Loading />;
    }
    return (
      <div>
        <Menu attached="top" tabular>
          <Menu.Item
            content="Users"
            name="users"
            active={activeTab === 'users'}
            onClick={onClick}
          />
        </Menu>
        <Segment attached="bottom" className="facilitator__content-pane">
          {this.state.tabs[this.state.activeTab]}
        </Segment>
      </div>
    );
  }
}

Admin.propTypes = {
  activeTab: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  getUser: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = state => {
  const { user } = state;
  return { user };
};

const mapDispatchToProps = dispatch => ({
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Admin)
);
