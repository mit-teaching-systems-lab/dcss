import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Menu, Segment, Title } from '@components/UI';

import { getUser } from '@actions/user';
import Loading from '@components/Loading';
import Activity from './Activity';
import Agents from './Agents';
import Users from './Users';
import './Admin.css';

class Admin extends Component {
  constructor(props) {
    super(props);

    const { activePage = 1, activeTab = 'access' } = this.props;

    this.state = {
      isReady: false,
      activePage,
      activeTab,
      tabs: {
        activity: this.getTab('activity'),
        agents: this.getTab('agents'),
        access: this.getTab('access')
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
    this.props.history.push(`/admin/${activeTab}?page=1`);
    this.setState({ activeTab });
  }

  getTab(name) {
    switch (name) {
      case 'access':
        return <Users {...this.props} />;
      case 'activity':
        return <Activity {...this.props} />;
      case 'agents':
        return <Agents {...this.props} />;
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
        <Menu attached="top" tabular className="admin__maxwidth">
          <Menu.Item.Tabbable
            content="Access Control"
            name="access"
            active={activeTab === 'access'}
            onClick={onClick}
          />
          <Menu.Item.Tabbable
            content="Agent Manager"
            name="agents"
            active={activeTab === 'agents'}
            onClick={onClick}
          />
          <Menu.Item.Tabbable
            content="Activity Viewer"
            name="activity"
            active={activeTab === 'activity'}
            onClick={onClick}
          />
        </Menu>
        <Segment attached="bottom" className="admin__maxwidth">
          {this.state.tabs[this.state.activeTab]}
        </Segment>
      </div>
    ) : (
      <Loading />
    );
  }
}

Admin.propTypes = {
  activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  activeTab: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
