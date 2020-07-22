import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import hash from 'object-hash';
import path from 'object-path';
import { Container, Form, Message, Ref, Slider } from '@components/UI';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import Media from '@utils/Media';
import '@components/Slide/Components/AudioPrompt/AudioPrompt.css';
import '@components/Slide/SlideEditor/SlideEditor.css';
import './ConversationPrompt.css';

import Hls from 'hls.js';
import Player from 'react-player';

import { YOUTUBE_PLAYER_EDITOR_VARS } from './constants';
window.Hls = Hls;

class ConversationPromptEditor extends Component {
  constructor(props) {
    super(props);
    const {
      header = '',
      player,
      prompt = '',
      configuration,
      recallId = '',
      responseId,
      url
    } = props.value;

    this.state = {
      header,
      player,
      prompt,
      configuration,
      recallId,
      responseId,
      url
    };

    this.onChange = this.onChange.bind(this);
    this.onRecallChange = this.onRecallChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
    this.player = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    const {
      header,
      player,
      prompt,
      configuration,
      recallId,
      responseId,
      url
    } = this.props.value;

    const lastProps = {
      header,
      player,
      prompt,
      configuration,
      recallId,
      responseId,
      url
    };

    if (hash(this.state) !== hash(lastProps)) {
      this.updateState();
    }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(this.updateState, 500);
  }

  updateState() {
    const {
      header,
      player,
      prompt,
      configuration,
      recallId,
      responseId,
      url
    } = this.state;

    this.props.onChange({
      header,
      player,
      prompt,
      configuration,
      recallId,
      responseId,
      type,
      url
    });
  }

  onChange(event, { name, value }) {
    const state = {
      ...this.state
    };

    let newValue = value;

    if ((name === 'configuration.start' || name === 'configuration.end') &&
        typeof value === 'string') {
      newValue = Media.timeToSec(value);
    }

    path.set(state, name, newValue);

    this.setState(state, this.delayedUpdateState);
  }

  onRecallChange({ recallId }) {
    this.setState({ recallId }, this.updateState);
  }

  render() {
    const { scenario, slideIndex } = this.props;
    const { onChange, onRecallChange, updateState } = this;
    const { header, prompt, configuration, recallId, url } = this.state;
    const options = [
      {
        key: 'whole',
        text: 'Play the entire video and prompt for a response at the end',
        value: 'whole'
      },
      {
        key: 'slice',
        text:
          'Play a section of the video, prompt for a response at the end of the section',
        value: 'slice'
      }
    ];

    const config = {
      youtube: YOUTUBE_PLAYER_EDITOR_VARS
    };

    const controls = true;
    const height = '100%';
    const width = '100%';

    const onDuration = duration => {
      this.onChange(
        {},
        {
          name: 'configuration.duration',
          value: duration
        }
      );
    };

    // const onProgress = ({playedSeconds}) => {
    //   // console.log(played, playedSeconds);
    //   console.log(this.player, this.endTimeInput);
    //   if (this.endTimeInput && this.player) {
    //     console.log(this.player.getCurrentTime(), playedSeconds);
    //     this.endTimeInput.value = Media.secToTime(playedSeconds);
    //   }
    // };

    // const onSeek = seconds => {
    //   console.log(seconds);
    //   if (this.endTimeInput) {
    //     console.log(seconds);
    //     this.endTimeInput.value = Media.secToTime(seconds);
    //   }
    //   if (this.endTimeInput) {
    //     console.log(seconds);
    //     this.endTimeInput.value = Media.secToTime(seconds);
    //   }
    // };

    const ref = player => {
      this.player = player;
    };

    const playerProps = {
      className: 'cp__video-player',
      config,
      controls,
      onDuration,
      // onProgress,
      // onSeek,
      width,
      height,
      ref,
      url
    };

    const startTimeInput = node => {
      if (node) {
        this.startTimeInput = node.querySelector('input');
      }
    };
    const endTimeInput = node => {
      if (node) {
        this.endTimeInput = node.querySelector('input');
      }
    };

    const onSliderChange = ([start, end]) => {
      const state = {
        ...this.state
      };

      path.set(state, 'configuration.start', start);
      path.set(state, 'configuration.end', end);

      this.setState(state, this.delayedUpdateState);

      if (this.startTimeInput) {
        this.startTimeInput.value = Media.secToTime(start);
      }

      if (this.endTimeInput) {
        this.endTimeInput.value = Media.secToTime(end);
      }
    };

    const start = configuration.start || 0;
    const end = configuration.end || configuration.duration || 0;
    const settings = {
      start: [start, end],
      min: 0,
      max: configuration.duration,
      step: 1,
      onChange: onSliderChange
    };

    const style = {
      trackFill: {
        backgroundColor: '#3498db'
      }
    };

    const sliderProps = {
      multiple: true,
      settings,
      style
    };

    const startTimeValue = Media.secToTime(start);
    const endTimeValue = Media.secToTime(end);

    return (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            value={{ recallId }}
            scenario={scenario}
            slideIndex={slideIndex}
            onChange={onRecallChange}
          />

          <Form.Input
            label="Enter url of the video you want to play:"
            name="url"
            value={url}
            onChange={onChange}
            onBlur={updateState}
          />

          <Container className="cp__video-wrapper">
            <Player {...playerProps} />
          </Container>

          <Form.Select
            fluid
            label="Prompt configuration: "
            name="configuration.kind"
            options={options}
            defaultValue={configuration.kind}
            onChange={onChange}
            onBlur={updateState}
          />

          {configuration.kind === 'slice' ? (
            <Fragment>
              <Slider {...sliderProps} />

              <Form.Group style={{ marginTop: '1em' }}>
                <Ref innerRef={startTimeInput}>
                  <Form.Input
                    inline
                    label="Start:"
                    name="configuration.start"
                    placeholder="00:00:00"
                    defaultValue={startTimeValue}
                    onChange={onChange}
                    style={{ width: '6.5em' }}
                  />
                </Ref>
                <Ref innerRef={endTimeInput}>
                  <Form.Input
                    inline
                    label="End:"
                    name="configuration.end"
                    placeholder="00:00:00"
                    defaultValue={endTimeValue}
                    onChange={onChange}
                    style={{ width: '6.5em' }}
                  />
                </Ref>
              </Form.Group>
            </Fragment>
          ) : null}

          <Form.TextArea
            label="Enter text content to display before the audio recording controls:"
            name="prompt"
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />

          <DataHeader
            content={header}
            onChange={onChange}
            onBlur={updateState}
          />

          <Message
            icon="warning sign"
            color="orange"
            content="This component will fallback to a text input prompt when the participant's browser or device does not support audio recording."
          />
        </Container>
      </Form>
    );
  }
}

ConversationPromptEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  slideIndex: PropTypes.any,
  value: PropTypes.shape({
    id: PropTypes.string,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type]),
    player: PropTypes.shape({
      playing: PropTypes.bool,
      controls: PropTypes.bool,
      light: PropTypes.bool,
      volume: PropTypes.number,
      muted: PropTypes.bool,
      playbackRate: PropTypes.number,
      progressInterval: PropTypes.number,
      playsinline: PropTypes.bool
    }),
    configuration: PropTypes.shape({
      kind: PropTypes.string,
      time: PropTypes.string
    }),
    url: PropTypes.string
  })
};

export default ConversationPromptEditor;
