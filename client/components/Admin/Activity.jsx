import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import escapeRegExp from 'lodash.escaperegexp';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';
import Identity from '@utils/Identity';
import {
  Grid,
  Header,
  Icon,
  Input,
  List,
  Menu,
  Message,
  Pagination
  // Table
} from '@components/UI';

import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import Username from '@components/User/Username';
import { computeItemsRowsPerPage } from '@utils/Layout';
import Moment from '@utils/Moment';
import { getLogs } from '@actions/logs';
// import { SITE_ROLE_GROUPS } from './constants';

// const { super_admin, admin, facilitator, researcher } = SITE_ROLE_GROUPS;

const ActivityListItem = props => {
  const { active, item, onClick } = props;
  const { capture, created_at, id } = item;
  const {
    request: {
      method,
      session: { user },
      url
    }
  } = capture;

  if (!user) {
    return null;
  }

  const description = (
    <Fragment>
      {<Username {...user} />}
      made a <code>{method}</code> request to <code>{url}</code>{' '}
      {Moment(created_at).calendar()}
    </Fragment>
  );

  const ariaLabel = `${user.personalname ||
    user.username} made a ${method} request to ${url} ${Moment(
    created_at
  ).calendar()}`;

  return (
    <List.Item
      as="a"
      aria-label={ariaLabel}
      active={active}
      id={id}
      onClick={onClick}
    >
      <List.Content>
        <List.Description>{description}</List.Description>
      </List.Content>
    </List.Item>
  );
};

ActivityListItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
  onClick: PropTypes.func
};

class Activity extends Component {
  constructor(props) {
    super(props);

    const { logs } = this.props;

    this.state = {
      isReady: false,
      activePage: 1,
      id: null,
      logs
    };

    // This is used as a back up copy of
    // logs when the list is filtered
    // by searching.
    this.logs = [];
    this.onPageChange = this.onPageChange.bind(this);
    this.onActivitySearchChange = this.onActivitySearchChange.bind(this);
    this.onActivityRecordClick = this.onActivityRecordClick.bind(this);
  }

  async componentDidMount() {
    let { logs } = this.state;

    if (!logs.length) {
      logs = await this.props.getLogs({});
    }

    this.logs = logs.slice();
    this.setState({
      isReady: true,
      logs
    });
  }

  onPageChange(event, { activePage }) {
    this.setState({
      ...this.state,
      activePage
    });
  }

  onActivityRecordClick(event, { id }) {
    this.setState({ id });
  }

  onActivitySearchChange(event, { value }) {
    const logs = this.logs.slice();

    if (value === '') {
      this.setState({
        logs
      });
      return;
    }

    if (value.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const results = logs.filter(({ created_at, capture }) => {
      // TODO: use moment to match dates here.
      if (escapedRegExp.test(created_at)) {
        return true;
      }

      if (escapedRegExp.test(JSON.stringify(capture))) {
        return true;
      }

      return false;
    });

    if (results.length === 0) {
      results.push(...logs);
    }

    this.setState({
      activePage: 1,
      logs: results
    });
  }

  render() {
    const {
      onPageChange,
      onActivityRecordClick,
      onActivitySearchChange
    } = this;
    // const { user } = this.props;
    const { isReady, activePage, id } = this.state;

    const defaultRowCount = 10;
    // known total height of all ui that is not a table row
    const totalUnavailableHeight = 459;
    const itemsRowHeight = 44;
    const itemsPerRow = 1;

    const { rowsPerPage } = computeItemsRowsPerPage({
      defaultRowCount,
      totalUnavailableHeight,
      itemsPerRow,
      itemsRowHeight
    });

    const totalLogsCount = this.state.logs.length;
    const pages = Math.ceil(totalLogsCount / rowsPerPage);
    const index = (activePage - 1) * rowsPerPage;
    const logs = this.state.logs.slice(index, index + rowsPerPage);

    const json = id ? this.props.logsById[id] : null;

    let request = json ? json.capture.request : null;

    let response = json ? json.capture.response : null;

    if (Array.isArray(response)) {
      [response] = response;
    }

    if (typeof response === 'string') {
      response = JSON.parse(response);
    }

    return (
      <Fragment>
        <EditorMenu
          type="administration"
          items={{
            left: [
              <Menu.Item.Tabbable key="menu-item-activity-administration">
                <Icon.Group className="em__icon-group-margin">
                  <Icon className="history" />
                </Icon.Group>
                Activity
              </Menu.Item.Tabbable>
            ],
            right: [
              <Menu.Menu key="menu-item-activity-search" position="right">
                <Menu.Item.Tabbable
                  key="menu-item-search-accounts"
                  name="Search activity logs"
                >
                  <Input
                    icon="search"
                    placeholder="Search..."
                    onChange={onActivitySearchChange}
                  />
                </Menu.Item.Tabbable>
              </Menu.Menu>
            ]
          }}
        />

        {!isReady ? (
          <Loading />
        ) : (
          <Grid celled>
            <Grid.Row>
              <Grid.Column width={4}>
                <List selection divided relaxed>
                  {logs
                    .map(item => (
                      <ActivityListItem
                        onClick={onActivityRecordClick}
                        active={item.id === id}
                        item={item}
                        key={Identity.key(item)}
                      />
                    ))
                    .filter(Boolean)}
                </List>
              </Grid.Column>
              <Grid.Column width={12}>
                {json ? (
                  <Fragment>
                    <Header as="h3">Request</Header>
                    <JSONTree
                      theme="monokai"
                      data={request}
                      invertTheme={true}
                    />
                    <Header as="h3">Response</Header>
                    <JSONTree
                      theme="monokai"
                      data={response}
                      invertTheme={true}
                    />
                  </Fragment>
                ) : (
                  <Message
                    icon="arrow left"
                    header="Activity viewer"
                    content="Select an activity entry from the log on the left to explore the details here."
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        <Pagination
          borderless
          name="logs"
          activePage={activePage}
          siblingRange={1}
          boundaryRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          onPageChange={onPageChange}
          totalPages={pages}
        />
      </Fragment>
    );
  }
}

Activity.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object,
  logs: PropTypes.array,
  logsById: PropTypes.object,
  getLogs: PropTypes.func
};

const mapStateToProps = state => {
  const { user, logs, logsById } = state;
  return { user, logs, logsById };
};

const mapDispatchToProps = dispatch => ({
  getLogs: params => dispatch(getLogs(params))
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Activity)
);
