import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Card, Grid, List } from '@components/UI';
import Username from '@components/User/Username';
import Identity from '@utils/Identity';
import './Lobby.css';

class LobbyUserWaiting extends Component {
  constructor(props) {
    super(props);
    this.renderListItems = this.renderListItems.bind(this);
  }

  renderListItems(list) {
    const { scenario, usersById } = this.props;

    return list.map((chatUser, index) => {
      const waitingUser = usersById[chatUser.id];
      const key = Identity.key({ chatUser, index, waiting: 1 });
      // const isSelectedNotHost = chatUser.id !== user.id;
      // const content = 'You are the host';
      const persona = scenario.personas.find(
        persona => persona.id === chatUser.persona_id
      );

      const asPersona = persona ? (
        <Fragment>
          as <strong>{persona.name}</strong>
        </Fragment>
      ) : null;

      return (
        <List.Item key={key}>
          <List.Content>
            <Username user={waitingUser} /> {asPersona}
          </List.Content>
        </List.Item>
      );
    });
  }

  render() {
    const usersPresentWithAssignedRoles = this.props.chat.users.filter(
      user => user.persona_id
    );

    const usersAbsent = this.props.chat.users.filter(
      user => !user.persona_id && !user.is_present
    );

    const totalPresent = usersPresentWithAssignedRoles.length;
    const totalAbsent = usersAbsent.length;
    return (
      <Fragment>
        <Grid padded className="l__waiting not-modal">
          <Grid.Row>
            <Grid.Column>
              <p>
                Who is in <strong>this scenario</strong> room?
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <List
                    divided
                    selection
                    data-testid="lobby-user-waiting-invitees"
                  >
                    {totalPresent ? (
                      this.renderListItems(usersPresentWithAssignedRoles)
                    ) : (
                      <List.Item style={{ cursor: 'default' }}>
                        <List.Content>
                          <p>No one has entered the scenario room yet</p>
                        </List.Content>
                      </List.Item>
                    )}
                  </List>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          {/*totalAbsent ? (
            <Fragment>
              <Grid.Row>
                <Grid.Column>
                  <p>Who has left the scenario?</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Card fluid>
                    <Card.Content>
                      <List
                        divided
                        selection
                        data-testid="lobby-user-absent-invitees"
                      >
                        {this.renderListItems(usersAbsent)}
                      </List>
                    </Card.Content>
                  </Card>
                </Grid.Column>
              </Grid.Row>
            </Fragment>
          ) : null*/}
        </Grid>
      </Fragment>
    );
  }
}

LobbyUserWaiting.propTypes = {
  chat: PropTypes.object,
  cohort: PropTypes.object,
  onSetRolesAndInvites: PropTypes.func,
  scenario: PropTypes.object,
  user: PropTypes.object,
  users: PropTypes.array,
  usersById: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const { user } = state;

  const chat = state.chat && state.chat.id ? state.chat : ownProps.chat || null;

  const cohort =
    state.cohort && state.cohort.id ? state.cohort : ownProps.cohort || null;

  const scenario =
    state.scenario && state.scenario.id
      ? state.scenario
      : ownProps.scenario || null;

  const users = cohort ? cohort.users : state.users;
  const usersById = users.reduce(
    (accum, user) => ({
      ...accum,
      [user.id]: user
    }),
    {}
  );

  return { chat, cohort, scenario, user, users, usersById };
};

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(LobbyUserWaiting)
);
