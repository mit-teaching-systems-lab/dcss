import { type } from './meta';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Message, Segment } from '@components/UI';
import Username from '@components/User/Username';
import AudioPlayer from '../AudioPrompt/AudioPlayer';
import Transcript from '../AudioPrompt/Transcript';
import { connect } from 'react-redux';
import { getChatUsersSharedResponses } from '@actions/chat';
import { getResponse } from '@actions/response';
import '../AudioPrompt/AudioPrompt.css';
import Identity from '@utils/Identity';
import Payload from '@utils/Payload';
import {
  AUDIO_PLAYBACK_MANUAL_PAUSE,
  AUDIO_PLAYBACK_MANUAL_PLAY
} from '@hoc/withRunEventCapturing';
import withSocket, {
  SHARED_RESPONSE_CREATED,
  CREATE_SHARED_RESPONSE_CHANNEL
} from '@hoc/withSocket';

const style = {
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word'
};

class Display extends Component {
  constructor(props) {
    super(props);

    const response = this.props.responsesById[this.props.recallId];

    this.state = {
      responses: response ? [response] : []
    };
    this.roleToUserMap = {};
    this.refresh = this.refresh.bind(this);
  }

  get isScenarioRun() {
    return window.location.pathname.includes('/run/');
  }

  async refresh() {
    if (!this.isScenarioRun) {
      return;
    }
    let {
      recallId,
      // eslint-disable-next-line no-unused-vars
      responsesById,
      run
    } = this.props;

    if (
      this.props.recallSharedWithRoles &&
      this.props.recallSharedWithRoles.length
    ) {
      const list = this.props.chat.users.reduce((accum, { id, persona_id }) => {
        if (this.props.recallSharedWithRoles.includes(persona_id)) {
          this.roleToUserMap[persona_id] = id;
          return [...accum, id];
        }
        return accum;
      }, []);

      if (list.length) {
        const responses = await this.props.getChatUsersSharedResponses(
          this.props.chat.id,
          recallId,
          list
        );

        this.setState({
          responses
        });
      }
    } else {
      if (!recallId || recallId === -1) {
        return;
      }

      const { response } = await this.props.getResponse(run.id, recallId);

      if (!response) {
        return;
      }

      this.setState({
        responses: [response || this.state.response]
      });
    }
  }

  async componentDidMount() {
    await this.refresh();

    if (
      this.props.recallSharedWithRoles &&
      this.props.recallSharedWithRoles.length
    ) {
      const response = {
        id: this.props.recallId
      };
      const basePayload = Payload.compose(this.props);
      const responsePayload = {
        ...basePayload,
        response
      };

      this.props.socket.on(SHARED_RESPONSE_CREATED, this.refresh);
      this.props.socket.emit(CREATE_SHARED_RESPONSE_CHANNEL, responsePayload);
    }
  }

  render() {
    const { responses } = this.state;
    const {
      isEmbeddedInSVG,
      recallId,
      run,
      scenario: { slides }
    } = this.props;

    const component = slides.reduce((accum, slide) => {
      const component = slide.components.find(
        ({ responseId }) => responseId === recallId
      );
      if (component) {
        accum = component;
      }
      return accum;
    }, undefined);

    const prompt = (component && component.prompt) || null;

    // If the scenario is an active "Run":
    //      If there is a response object, but
    //      the response was skipped,
    //      display:
    //      "Prompt skipped"
    //
    //      Otherwise, display the value
    //      that was entered by the participant
    //
    //      In case we're waiting for the response
    //      to load from the server, display:
    //      "Loading your previous response"
    //
    // Otherwise, we're in a preview, so there
    // won't actually be a participant response
    // to display, so display:
    // "Participant response transcriptions will appear here."
    //

    if (!this.isScenarioRun || isEmbeddedInSVG) {
      return (
        <Message
          floating
          header={prompt}
          style={style}
          content="Participant response will appear here during scenario run."
        />
      );
    }

    const roleToUserMapMissing = {
      ...this.roleToUserMap
    };

    const rendered = responses.reduce((accum, response) => {
      let rvalue = this.isScenarioRun
        ? response
          ? response.isSkip
            ? 'Prompt skipped'
            : response.value
          : false
        : 'Participant response transcriptions will appear here.';

      if (!rvalue) {
        return accum;
      }

      let content = rvalue;

      // The fallback value of an AudioPrompt or ConversationPrompt
      // will not be an mp3 file path.
      if (Object.prototype.hasOwnProperty.call(response, 'transcript')) {
        const { transcript } = response;
        const src = rvalue;
        const audioSrc = src ? { src } : {};
        const eventContext = {
          ...audioSrc,
          recallId: this.props.recallId
        };

        const onPlayOrPause = event => {
          const which =
            event.type === 'play'
              ? AUDIO_PLAYBACK_MANUAL_PLAY
              : AUDIO_PLAYBACK_MANUAL_PAUSE;

          this.props.saveRunEvent(which, eventContext);
        };

        const audioProps = {
          controlsList: 'nodownload',
          controls: true,
          onPlay: onPlayOrPause,
          onPause: onPlayOrPause,
          ...audioSrc
        };
        content = (
          <Fragment>
            <AudioPlayer {...audioProps} />
            <Transcript
              responseId={recallId}
              run={run}
              transcript={transcript}
            />
          </Fragment>
        );
      }

      if (
        component &&
        (component.type === 'MultiButtonResponse' ||
          component.type === 'MultiPathResponse')
      ) {
        const property =
          component.type === 'MultiButtonResponse' ? 'buttons' : 'paths';

        const selected = component[property].find(
          ({ value }) => value === rvalue
        );
        content = <Fragment>{selected ? selected.display : null}</Fragment>;
      }

      const key = Identity.key(response);

      const messageProps = {
        tabIndex: '0',
        content,
        header: prompt,
        style
      };

      if (
        this.props.chat &&
        this.props.chat.id &&
        this.props.recallSharedWithRoles &&
        this.props.recallSharedWithRoles.length
      ) {
        const chatUser = this.props.chat.usersById[response.user_id];
        const persona = this.props.scenario.personas.find(
          persona => persona.id === chatUser.persona_id
        );

        messageProps.attached = 'bottom';
        messageProps.header = messageProps.content;
        messageProps.content = null;
        const personaName = persona ? (
          <Fragment>({persona.name})</Fragment>
        ) : null;

        if (persona) {
          delete roleToUserMapMissing[persona.id];
        }

        accum.push(
          <Fragment key={key}>
            <Segment attached="top" size="large">
              <Username user={chatUser} /> {personaName}:
            </Segment>
            <Message {...messageProps} />
          </Fragment>
        );
      } else {
        accum.push(<Message key={key} {...messageProps} />);
      }

      return accum;
    }, []);

    const missing = Object.values(roleToUserMapMissing);

    for (const id of missing) {
      const chatUser = this.props.chat.usersById[id];
      const persona = this.props.scenario.personas.find(
        persona => persona.id === chatUser.persona_id
      );

      const personaName = persona ? (
        <Fragment>({persona.name})</Fragment>
      ) : null;

      rendered.push(
        <Segment key={Identity.key(id)}>
          Awaiting a response from <Username user={chatUser} /> {personaName}
        </Segment>
      );
    }

    return <Fragment>{rendered}</Fragment>;
  }
}

Display.defaultProps = {
  isEmbeddedInSVG: false
};

Display.propTypes = {
  isEmbeddedInSVG: PropTypes.bool,
  getChatUsersSharedResponses: PropTypes.func,
  getResponse: PropTypes.func,
  responsesById: PropTypes.object,
  // This is named `recallId`, instead of `responseId`
  // to prevent the serialized form of this component
  // from being mis-indentified as a "Response" component.
  recallId: PropTypes.string,
  recallSharedWithRoles: PropTypes.array,
  chat: PropTypes.object,
  run: PropTypes.object,
  saveRunEvent: PropTypes.func,
  scenario: PropTypes.object,
  type: PropTypes.oneOf([type])
};

const mapStateToProps = state => {
  const { chat, scenario, run, responsesById, user } = state;
  return { chat, scenario, run, responsesById, user };
};

const mapDispatchToProps = dispatch => ({
  getResponse: (...params) => dispatch(getResponse(...params)),
  getChatUsersSharedResponses: (...params) =>
    dispatch(getChatUsersSharedResponses(...params))
});

export default withSocket(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Display)
);
