import React from 'react';
import PropTypes from 'prop-types';
import './AudioResponse.css';

function makeMediaURL(file) {
  return file.startsWith('blob:') ? file : `/api/media/${file}`;
}

function AudioPlayer({ src }) {
  if (!src) {
    return <audio disabled controls="controls" />;
  }
  return <audio controls="controls" src={makeMediaURL(src)} />;
}

AudioPlayer.propTypes = {
  src: PropTypes.string
};

export default AudioPlayer;
