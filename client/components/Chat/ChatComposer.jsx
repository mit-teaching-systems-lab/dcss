import React from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import { Ref } from '@components/UI';
import Layout from '@utils/Layout';
import './Chat.css';

function makeSendButtonPlugin(sendNewMessage) {
  return {
    name: 'sendButtonPlugin',
    display: 'command',
    title: 'Send',
    buttonClass: '',
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 20 500 500"><g><path id="c__send-icon" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"></path></g></svg>`,
    add(core, targetElement) {
      const context = core.context;
      context.sendButtonPlugin = {
        targetButton: targetElement
      };
    },
    active(element) {
      if (!element) {
        this.util.removeClass(
          this.context.sendButtonPlugin.targetButton,
          'active'
        );
      } else if (
        /^mark$/i.test(element.nodeName) &&
        element.style.backgroundColor.length > 0
      ) {
        this.util.addClass(
          this.context.sendButtonPlugin.targetButton,
          'active'
        );
        return true;
      }
      return false;
    },
    action() {
      sendNewMessage();
    }
  };
}

const autoFocus = true;
const defaultStyle = `
  font-family:Lato,"Helvetica Neue",Arial,Helvetica,sans-serif;font-size:1.14285714rem;line-height:1.14285714rem;
`.trim();
const mediaAutoSelect = false;
const resizingBar = false;
const showPathLabel = false;

function ChatComposer(props) {
  const [ref, setRef] = React.useState(null);
  const customPlugins = [makeSendButtonPlugin(props.sendNewMessage)];

  let width = '100%';
  let minWidth = null;
  let maxWidth = null;

  // let height = `${BASE_HEIGHT}px`;
  // let minHeight = height;
  // let maxHeight = height;

  if (ref?.parentNode) {
    ({ width } = window.getComputedStyle(ref.parentNode));
    maxWidth = width;
  }

  const buttons = Layout.isForMobile() ? 'chat-mobile' : 'chat-desktop';
  const options = {
    ...props.options,
    autoFocus,
    buttons,
    // This is used to match suneditor to the site's fonts
    defaultStyle,
    width,
    // height,
    // minHeight,
    // maxHeight,
    mediaAutoSelect,
    resizingBar,
    showPathLabel
  };

  /* istanbul ignore next */
  if (maxWidth) {
    options.width = width;
    options.minWidth = minWidth;
    options.maxWidth = maxWidth;
  }

  const rteProps = {
    ...props,
    customPlugins,
    options
  };

  return (
    <Ref innerRef={setRef}>
      <RichTextEditor {...rteProps} />
    </Ref>
  );
}

ChatComposer.propTypes = {
  id: PropTypes.any,
  name: PropTypes.any,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  onKeyDown: PropTypes.func,
  onMount: PropTypes.func,
  sendNewMessage: PropTypes.func,
  options: PropTypes.object
};

ChatComposer.defaultProps = {
  options: {}
};

export default ChatComposer;
