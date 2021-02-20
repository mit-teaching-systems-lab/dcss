import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@components/UI';
import './Chat.css';

const minAriaLabel = 'Click to minimize the chat window';
const maxAriaLabel = 'Click to maximize the chat window';

const maxIcon = 'window maximize';
const minIcon = 'window minimize';

function ChatMinMax(props) {
  const [isMinimized, setIsMinimized] = useState(props.isMinimized);
  const onClick = () => {
    const newIsMinimized = !isMinimized;
    setIsMinimized(newIsMinimized);
    if (props.onChange) {
      props.onChange({ isMinimized: newIsMinimized });
    }
  };
  const minMaxIcon = isMinimized ? maxIcon : minIcon;
  const minMaxAriaLabel = isMinimized ? maxAriaLabel : minAriaLabel;
  const className = isMinimized
    ? `close c__container-modal-minmax ${props.className}`
    : 'close c__container-modal-minmax';

  return (
    <Button
      className={className}
      aria-label={minMaxAriaLabel}
      icon={minMaxIcon}
      onClick={onClick}
    />
  );
}

ChatMinMax.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func
};

export default ChatMinMax;
