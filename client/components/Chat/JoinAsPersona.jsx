import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { joinChat, linkRunToChat } from '@actions/chat';
import { linkRunToCohort } from '@actions/cohort';
import { getUser } from '@actions/user';
import JoinAsButton from '@components/Chat/JoinAsButton.jsx';
import { Form } from '@components/UI';
import Identity from '@utils/Identity';

// export const makeCohortScenarioChatJoinPath = (cohort, scenario, chat) => {
//   const redirectCohortPart = `/cohort/${Identity.toHash(cohort.id)}`;
//   const redirectRunPart = `/run/${Identity.toHash(scenario.id)}`;
//   const redirectChatPart = `/chat/${Identity.toHash(chat.id)}`;
//   const redirectSlidePart = `/slide/0`;

//   return [
//     redirectCohortPart,
//     redirectRunPart,
//     redirectChatPart,
//     redirectSlidePart
//   ].join('');
// };

class JoinAsPersona extends Component {
  constructor(props) {
    super(props);

    this.state = {
      persona: null,
      isOpen: true
    };

    this.onRoomAccessChange = this.onRoomAccessChange.bind(this);
  }

  componentWillUnmount() {}

  componentDidMount() {}

  onRoomAccessChange(event) {
    const { value } = event.target;
    const isOpen = value === 'yes';
    this.setState({
      isOpen
    });
  }

  render() {
    const { cohort, onClick, scenario, user } = this.props;
    const { isOpen } = this.state;
    const { onRoomAccessChange } = this;

    return (
      <Fragment>
        {scenario.personas.map(persona => {
          return (
            <Fragment key={Identity.key(persona)}>
              <div>
                <JoinAsButton
                  className="c__join-persona-button"
                  cohort={cohort}
                  isOpen={isOpen}
                  persona={persona}
                  scenario={scenario}
                  onClick={onClick}
                />
              </div>
              <div>
                <p>
                  <strong>{persona.name}</strong>
                </p>
                <p>{persona.description}</p>
              </div>
            </Fragment>
          );
        })}
        <p tabIndex="0">Is your room open to anyone in your cohort?</p>
        <Form>
          <Form.Field>
            <div className="ui checked radio checkbox">
              <input
                tabIndex="0"
                type="radio"
                name="isOpen"
                id="yes"
                value="yes"
                checked={isOpen === true}
                onChange={onRoomAccessChange}
              />
              <label htmlFor="yes">Yes, let anyone in my cohort join.</label>
            </div>
          </Form.Field>

          <Form.Field>
            <div className="ui checked radio checkbox">
              <input
                tabIndex="0"
                type="radio"
                name="isOpen"
                id="no"
                value="no"
                checked={isOpen === false}
                onChange={onRoomAccessChange}
              />
              <label htmlFor="no">No, I will invite participants.</label>
            </div>
          </Form.Field>
        </Form>
      </Fragment>
    );
  }
}

JoinAsPersona.propTypes = {
  onClick: PropTypes.func,
  cohort: PropTypes.object,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }),
  joinChat: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortId: PropTypes.node,
      personaId: PropTypes.node,
      scenarioId: PropTypes.node
    }).isRequired,
    url: PropTypes.string
  }),
  scenario: PropTypes.object,
  getRun: PropTypes.func,
  setRun: PropTypes.func,
  socket: PropTypes.object,
  user: PropTypes.object
};

const mapStateToProps = (_state, ownProps) => {
  const { cohort, scenario, user } = ownProps;
  return { cohort, scenario, user };
};

const mapDispatchToProps = dispatch => ({
  setRun: (...params) => dispatch(setRun(...params)),
  joinChat: (...params) => dispatch(joinChat(...params)),
  linkRunToChat: (...params) => dispatch(linkRunToChat(...params)),
  linkRunToCohort: (...params) => dispatch(linkRunToCohort(...params)),
  getScenario: params => dispatch(getScenario(params)),
  getUser: params => dispatch(getUser(params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(JoinAsPersona)
);
