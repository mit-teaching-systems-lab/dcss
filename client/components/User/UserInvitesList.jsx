import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setInvite } from '@actions/invite';
import { getScenariosByStatus } from '@actions/scenario';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import { Button, Comment, Text } from '@components/UI';
import Username from '@components/User/Username';

import Avatar from '@utils/Avatar';
import Identity from '@utils/Identity';
import Invites from '@utils/Invites';
import Moment from '@utils/Moment';

const Invite = Comment;

export const makeAcceptedInviteRedirectPath = invite => {
  const redirectCohortPart = invite.cohort_id
    ? `/cohort/${Identity.toHash(invite.cohort_id)}`
    : '';
  const redirectRunPart = `/run/${invite.scenario_id}`;
  const redirectChatPart = `/code/${invite.code}`;
  const redirectSlidePart = `/slide/0`;
  return [
    redirectCohortPart,
    redirectRunPart,
    redirectChatPart,
    redirectSlidePart
  ].join('');
};

export const makeInviteExplanation = parts => {
  const { isRecipient, user, scenario, persona, cohort = null } = parts;

  const asRole = persona ? (
    <Fragment>
      , as <strong>{persona.name}</strong>
    </Fragment>
  ) : null;

  const theScenario = (
    <Fragment>
      the scenario <strong>{scenario.title}</strong>
      {asRole}
    </Fragment>
  );

  const theScenarioInACohort = cohort ? (
    <Fragment>
      {theScenario}, which is part of the cohort <strong>{cohort.name}</strong>
    </Fragment>
  ) : null;

  const place = cohort ? theScenarioInACohort : theScenario;

  return isRecipient ? (
    <Fragment>
      <strong>
        <Username user={user} />
      </strong>{' '}
      invited you to join {place}
    </Fragment>
  ) : (
    <Fragment>
      You invited{' '}
      <strong>
        <Username user={user} />
      </strong>{' '}
      to {place}
    </Fragment>
  );
};

class UserInvitesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
    this.onInviteChange = this.onInviteChange.bind(this);
  }

  async componentDidMount() {
    for (const invite of this.props.invites) {
      if (!this.props.scenariosById[invite.scenario_id]) {
        await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
        break;
      }
    }

    this.setState({
      isReady: true
    });
  }

  onInviteChange(event, { value: invite }) {
    console.log("onInviteChange?", invite);

    if (invite.status === 'accepted') {
      const acceptUrl = `/invite/${Invites.INVITE_STATUS_ACCEPT}/${invite.code}`;
      const redirect = makeAcceptedInviteRedirectPath(invite);
      this.props.history.push(acceptUrl, {
        redirect
      });
    } else {
      this.props.setInvite(invite.id, {
        status: Invites.INVITE_STATUS_MAP[invite.status]
      });
    }
  }

  render() {
    if (!this.state.isReady) {
      return null;
    }
    const { onInviteChange } = this;
    const { cohortsById, invites, scenariosById, user, usersById } = this.props;
    return (
      <Invite.Group>
        {invites.length ? (
          invites.reduce((accum, invite) => {
            if (
              !invite.persona_id ||
              !invite.receiver_id ||
              !invite.scenario_id ||
              !invite.sender_id
            ) {
              return accum;
            }

            const key = Identity.key(invite);
            const isRecipient = invite.receiver_id === user.id;
            const other = isRecipient
              ? usersById[invite.sender_id]
              : usersById[invite.receiver_id];
            const avatar = new Avatar(other);

            const createdAgo = Moment(invite.created_at).fromNow();
            const cohort = cohortsById[invite.cohort_id];
            const scenario = scenariosById[invite.scenario_id];

            if (!scenario || !scenario.personas || !scenario.personas.length) {
              return accum;
            }

            const persona = scenario.personas.find(
              persona => persona.id === invite.persona_id
            );
            const explanation = makeInviteExplanation({
              isRecipient,
              user: other,
              scenario,
              persona,
              cohort
            });

            const cancel = {
              ...invite,
              status: Invites.INVITE_STATUS_CANCEL_NAME
            };

            const cancelButton = (
              <Button
                name="cancel"
                size="small"
                key={Identity.key({ key, cancel })}
                value={cancel}
                onClick={onInviteChange}
              >
                Cancel
              </Button>
            );

            const decline = {
              ...invite,
              status: Invites.INVITE_STATUS_DECLINE_NAME
            };

            const declineButton = (
              <Button
                name="decline"
                size="small"
                key={Identity.key({ key, decline })}
                value={decline}
                onClick={onInviteChange}
              >
                Decline
              </Button>
            );

            const accept = {
              ...invite,
              status: Invites.INVITE_STATUS_ACCEPT_NAME
            };

            const acceptButton = (
              <Button
                name="accept"
                className="primary"
                size="small"
                key={Identity.key({ key, accept })}
                value={accept}
                onClick={onInviteChange}
              >
                Accept
              </Button>
            );

            const orButton = (
              <Button.Or key={Identity.key({ key, or: true })} />
            );

            const buttons = isRecipient
              ? [acceptButton, orButton, declineButton]
              : [cancelButton];

            const shouldShowButtons =
              invite.status === Invites.INVITE_STATUS_PENDING_NAME;
            const type = isRecipient ? 'received' : 'sent';

            accum.push(
              <Invite data-testid="comment" key={key}>
                <Invite.Avatar src={avatar.src} />
                <Invite.Content>
                  <Invite.Text>
                    {explanation}{' '}
                    <Invite.Metadata>
                      <time className="sc__time" dateTime={invite.created_at}>
                        {createdAgo}
                      </time>
                    </Invite.Metadata>
                  </Invite.Text>
                  <Invite.Actions>
                    {shouldShowButtons ? (
                      <Button.Group size="small">{buttons}</Button.Group>
                    ) : (
                      <Text>
                        {
                          Invites.INVITE_STATUS_MESSAGES_MAP[
                            Invites.INVITE_STATUS_MAP[invite.status]
                          ][type]
                        }{' '}
                        {invite.status === 'accepted' ? (
                          <a
                            onClick={this.props.onClose}
                            href={makeAcceptedInviteRedirectPath(invite)}
                          >
                            Go to scenario
                          </a>
                        ) : null}
                      </Text>
                    )}
                  </Invite.Actions>
                </Invite.Content>
              </Invite>
            );

            return accum;
          }, [])
        ) : (
          <Invite>
            <Invite.Content>
              <Invite.Text>There are no invites here.</Invite.Text>
            </Invite.Content>
          </Invite>
        )}

        <div data-testid="user-invites-list" />
      </Invite.Group>
    );
  }
}

UserInvitesList.propTypes = {
  cohortsById: PropTypes.object,
  getScenariosByStatus: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  invites: PropTypes.array,
  onClose: PropTypes.func,
  scenariosById: PropTypes.object,
  setInvite: PropTypes.func,
  type: PropTypes.string,
  user: PropTypes.object,
  usersById: PropTypes.object
};

const mapStateToProps = state => {
  const {
    cohortsById,
    invites,
    scenarios,
    scenariosById,
    user,
    usersById
  } = state;
  const invitesByCode = invites.reduce(
    (accum, invite) => ({
      ...accum,
      [invite.code]: invite
    }),
    {}
  );

  return {
    invites,
    invitesByCode,
    cohortsById,
    scenarios,
    scenariosById,
    user,
    usersById
  };
};

const mapDispatchToProps = dispatch => ({
  setInvite: (id, params) => dispatch(setInvite(id, params)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserInvitesList)
);
