import React /*, { Component, Fragment }*/ from 'react';
import PropTypes from 'prop-types';
import Media from '@utils/Media';
import './AudioPrompt.css';

function AudioPlayer(props) {
  const audioProps = {
    ...props
  };

  if (audioProps.src) {
    audioProps.src = Media.fileToMediaURL(audioProps.src);
  }

  return <audio {...audioProps} />;
}

AudioPlayer.propTypes = {
  src: PropTypes.string
};

/*

TODO: Finish implementation of custom player:

import { Button, Menu, Icon, Progress, Ref } from '@components/UI';
import './AudioPlayer.css';
class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    const {
      autoPlay = false,
      src
    } = props;

    this.state = {
      active: null,
      playing: autoPlay,
      src: src ? Media.fileToMediaURL(src) : undefined,
    }

    this.audio = null;
    this.onClick = this.onClick.bind(this);
    // this.onPauseClick = this.onPauseClick.bind(this);
    // this.onPlayClick = this.onPlayClick.bind(this);
  }

  onClick(event, data) {
    console.log("onClick, event: ", event);
    console.log("onClick, data: ", data);

    const playing = data.name === 'play' ? true : false;
    this.setState({ playing });
  }

  // onPauseClick(event) {
  //   console.log("onPauseClick(event)", event);
  //   this.setState({ playing: false });
  // }

  // onPlayClick(event) {
  //   console.log("onPlayClick(event)", event);
  //   this.setState({ playing: true });
  // }

  render() {
    const {
      active,
      playing,
      src
    } = this.state;


    const {
      autoPlay,
      controls,
      controlsList,
      onPlay,
      onPause,
    } = this.props;

    const audioProps = {
      autoPlay,
      controls,
      controlsList,
      onPlay,
      onPause,
      src
    };

    const innerRef = (node) => {
      if (node) {
        this.audio = node;
      }
    };

    if (this.audio) {
      if (playing) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }

    return (
      <Fragment>
        <Ref innerRef={innerRef}>
          <audio {...audioProps} />
        </Ref>
        <Menu className="ap__container" size="tiny" borderless icon>
          {playing ? (
            <Menu.Item
              name="pause"
              active={active === 'pause'}
              onClick={this.onClick}
            >
              <Icon name="pause" />
            </Menu.Item>
          ) : (
            <Menu.Item
              name="play"
              active={active === 'play'}
              onClick={this.onClick}
            >
              <Icon name="play" />
            </Menu.Item>
          )}

          <Menu.Item
            onClick={this.onClick}
          >
            00:00 / 00:00
          </Menu.Item>

          <Menu.Item
            className="ap__progress-box"
            onClick={this.onClick}
          >
            <Progress className="ap__progress-bar" size="tiny" percent={10} />
          </Menu.Item>
        </Menu>
      </Fragment>
    );
  }

}


AudioPlayer.propTypes = {
  onClick: PropTypes.func,
  src: PropTypes.string,
};

*/

export default AudioPlayer;
