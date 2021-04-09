import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from '@components/UI';
import './Chat.css';

const minAriaLabel = 'Click to minimize the chat window';
const maxAriaLabel = 'Click to maximize the chat window';

const maxIcon = 'discussions';
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
  const className = isMinimized
    ? `close c__container-modal-minmax ${props.className}`
    : 'close c__container-modal-minmax';
  const icon = isMinimized ? maxIcon : minIcon;
  const size = props.size || 'medium';
  const minMaxAriaLabel = isMinimized ? maxAriaLabel : minAriaLabel;

  const triggerProps = {
    'aria-label': minMaxAriaLabel,
    className,
    icon,
    onClick,
    size
  };

  const trigger = <Button {...triggerProps} />;

  return (
    <Popup
      inverted
      aria-label={minMaxAriaLabel}
      content={minMaxAriaLabel}
      open={isMinimized}
      trigger={trigger}
    />
  );
}

ChatMinMax.propTypes = {
  className: PropTypes.string,
  isMinimized: PropTypes.bool,
  onChange: PropTypes.func,
  size: PropTypes.string,
};

export default ChatMinMax;
