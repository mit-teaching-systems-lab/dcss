import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Segment, Title } from '@components/UI';

import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import Users from './Users';
import Activity from './Activity';
import './Admin.css';

const IS_LOCAL_DEV = location.href.includes('localhost');

class Admin extends Component {
  constructor(props) {
    super(props);

    const { activeTab = 'users' } = this.props;

    this.state = {
      isReady: false,
      activeTab,
      tabs: {
        activity: this.getTab('activity'),
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
      case 'activity':
        return <Activity {...this.props} />;
      default:
        return null;
    }
  }

  render() {
    const { isReady, activeTab } = this.state;
    const { onClick } = this;
    return isReady ? (
      <div>
        <Title content="Administration" />
        <Menu attached="top" tabular>
          <Menu.Item.Tabbable
            content="Access Control"
            name="users"
            active={activeTab === 'users'}
            onClick={onClick}
          />
          {IS_LOCAL_DEV ? (
            <Menu.Item.Tabbable
              content="Activity Viewer"
              name="activity"
              active={activeTab === 'activity'}
              onClick={onClick}
            />
          ) : null}
        </Menu>
        <Segment attached="bottom" className="facilitator__content-pane">
          {this.state.tabs[this.state.activeTab]}
        </Segment>
      </div>
    ) : (
      <Loading />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Admin));
