import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

// import katex from 'katex';
// import 'katex/dist/katex.min.css';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';

import SunEditor from 'suneditor';
import 'suneditor/src/assets/css/suneditor-contents.css';
import 'suneditor/src/assets/css/suneditor.css';

import buttons from './buttons';
import plugins from './plugins';
import language from './language';
import './RichTextEditor.css';

const en = language('en');
const MiscEventNames = [
  'onAudioUpload',
  'onAudioUploadBefore',
  'onAudioUploadError',
  'onBlur',
  'onClick',
  'onDrop',
  'onFocus',
  'onImageUpload',
  'onImageUploadBefore',
  'onImageUploadError',
  'onInput',
  'onKeyDown',
  'onKeyUp',
  'onLoad',
  'onMouseDown',
  'onPaste',
  'onScroll',
  'onVideoUpload',
  'onVideoUploadBefore',
  'onVideoUploadError'
];

const defaultOptions = {
  codeMirror: CodeMirror,
  buttons: buttons.large,
  lang: en,
  showPathLabel: false,
  width: '100%',
  youtubeQuery:
    'autoplay=0&mute=1&enablejsapi=1&controls=0&rel=0&modestbranding=1'
};

const SymbolEditor = Symbol('@@editor');

class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
  }

  shouldComponentUpdate(newProps) {
    return newProps.id !== this.props.id;
  }

  componentDidMount() {
    if (this.ref.current) {
      let {
        autoFocus = false,
        defaultValue = '',
        disable = false,
        enable = true,
        hide = false,
        name = '',
        onChange = () => {},
        options = {},
        show = true,
        toolbar = {
          enable: true,
          show: true
        },
        value = ''
      } = this.props;

      const buttonList =
        typeof options.buttons === 'string'
          ? buttons[options.buttons]
          : options.buttons;

      delete options.buttons;

      options = Object.assign({}, defaultOptions, options, { buttonList });
      options.plugins = plugins(buttonList || []);

      // if (options.buttonList.flat().includes('math')) {
      //   options.katex = katex;
      // }

      this[SymbolEditor] = SunEditor.create(this.ref.current);
      this[SymbolEditor].setOptions(options);

      this[SymbolEditor].onChange = content => {
        if (name) {
          this.ref.current.value = content;
        }
        onChange(content);
      };

      this[SymbolEditor].toggleCodeView = (isCodeView, core) => {
        const content = core.getContents();
        if (name) {
          this.ref.current.value = content;
        }
        onChange(content);
      };

      MiscEventNames.forEach(eventName => {
        if (this.props[eventName]) {
          this[SymbolEditor][eventName] = (...args) => {
            this.props[eventName](...args, this[SymbolEditor].getContents());
          };
        }
      });

      if (defaultValue) {
        this[SymbolEditor].setContents(defaultValue);
        this[SymbolEditor].core.focusEdge();
      }

      if (value) {
        this[SymbolEditor].appendContents(value);
      }

      if (toolbar.show === true) {
        this[SymbolEditor].toolbar.show();
      } else {
        this[SymbolEditor].toolbar.hide();
      }

      if (toolbar.enable === true) {
        this[SymbolEditor].toolbar.enabled();
      } else {
        this[SymbolEditor].toolbar.disabled();
      }

      // These are explicit value checks
      if (enable === true) {
        this[SymbolEditor].enabled();
      }

      if (disable === true) {
        this[SymbolEditor].disabled();
      }

      if (hide === true) {
        this[SymbolEditor].hide();
      }

      if (show === true) {
        this[SymbolEditor].show();
      }

      if (autoFocus === false) {
        this[SymbolEditor].core.context.element.wysiwyg.blur();
      }

      if (autoFocus === true) {
        this[SymbolEditor].core.context.element.wysiwyg.focus();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.defaultValue !== this.props.defaultValue) {
      if (!this[SymbolEditor].core.hasFocus) {
        this[SymbolEditor].setContents(this.props.defaultValue);
      }
    }
  }

  componentWillUnmount() {
    if (this[SymbolEditor]) {
      this[SymbolEditor].destroy();
    }
  }

  render() {
    const { ref } = this;
    const { defaultValue: __html, mode = 'editor' } = this.props;

    let className = 'sun-editor-editable rt__container';

    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return mode === 'editor' ? (
      <textarea ref={ref} />
    ) : (
      <div className={className} dangerouslySetInnerHTML={{ __html }} />
    );
  }
}

RichTextEditor.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool,
  enable: PropTypes.bool,
  hide: PropTypes.bool,
  id: PropTypes.node,
  lang: PropTypes.string,
  mode: PropTypes.oneOf(['editor', 'display']),
  name: PropTypes.string,
  onAudioUpload: PropTypes.func,
  onAudioUploadBefore: PropTypes.func,
  onAudioUploadError: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onDrop: PropTypes.func,
  onFocus: PropTypes.func,
  onImageUpload: PropTypes.func,
  onImageUploadBefore: PropTypes.func,
  onImageUploadError: PropTypes.func,
  onInput: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onLoad: PropTypes.func,
  onMouseDown: PropTypes.func,
  onPaste: PropTypes.func,
  onScroll: PropTypes.func,
  onVideoUpload: PropTypes.func,
  onVideoUploadBefore: PropTypes.func,
  onVideoUploadError: PropTypes.func,
  options: PropTypes.object,
  show: PropTypes.bool,
  toolbar: PropTypes.shape({
    enable: PropTypes.bool,
    show: PropTypes.bool
  }),
  value: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default RichTextEditor;
