import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { camelCase } from 'change-case';

import katex from 'katex';
import 'katex/dist/katex.min.css';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/htmlmixed/htmlmixed';

import SunEditor from 'suneditor';
import 'suneditor/src/assets/css/suneditor-contents.css';
import 'suneditor/src/assets/css/suneditor.css';

import buttons from './buttons';
import icons from './icons';
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
  minHeight: '100px',
  height: 'auto',
  width: '100%',
  youtubeQuery: 'autoplay=0&controls=1&rel=0&modestbranding=1',
  resizingBar: true
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
        customPlugins = [],
        defaultValue = '',
        focusEdge = false,
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

      let buttonList =
        typeof options.buttons === 'string'
          ? buttons[camelCase(options.buttons)]
          : options.buttons;

      if (!buttonList) {
        buttonList = buttons.small.slice();
      }

      delete options.buttons;

      options = Object.assign({}, defaultOptions, options, { buttonList });
      options.plugins = plugins(buttonList || []);

      if (customPlugins.length) {
        options.plugins.push(...customPlugins);

        options.buttonList[options.buttonList.length - 1].push(
          ...customPlugins.map(customPlugin => customPlugin.name)
        );
      }

      // Enables image upload and storage
      options.imageMultipleFile = false;
      options.imageUploadUrl = '/api/media/image';
      options.imageGalleryUrl = '/api/media/gallery/images';

      if (options.buttonList.flat().includes('math')) {
        options.katex = katex;
      }

      const onContentChange = content => {
        if (name) {
          this.ref.current.value = content;
        }
        onChange(content);
      };

      this[SymbolEditor] = SunEditor.create(this.ref.current, options, {
        icons
      });

      this[SymbolEditor].onChange = content => {
        onContentChange(content);
      };

      this[SymbolEditor].toggleCodeView = (isCodeView, core) => {
        onContentChange(core.getContents());
      };

      this[SymbolEditor].toggleFullScreen = (isFullScreen, core) => {
        onContentChange(core.getContents());
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

      if (focusEdge) {
        this[SymbolEditor].core.focusEdge();
      }
    }

    if (this.props.onMount) {
      this.props.onMount(this[SymbolEditor]);
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
      if (this.props.onUnmount) {
        this.props.onUnmount(this[SymbolEditor]);
      }
      this[SymbolEditor].destroy();
    }
  }

  render() {
    const { ref } = this;
    const { defaultValue: __html, mode = 'editor', style } = this.props;

    let className = 'sun-editor-editable rt__container';

    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return mode === 'editor' ? (
      <textarea ref={ref} style={style} />
    ) : (
      <div className={className} dangerouslySetInnerHTML={{ __html }} />
    );
  }
}

RichTextEditor.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  customPlugins: PropTypes.array,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool,
  enable: PropTypes.bool,
  focusEdge: PropTypes.bool,
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
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onMouseDown: PropTypes.func,
  onPaste: PropTypes.func,
  onResize: PropTypes.func,
  onScroll: PropTypes.func,
  onVideoUpload: PropTypes.func,
  onVideoUploadBefore: PropTypes.func,
  onVideoUploadError: PropTypes.func,
  options: PropTypes.object,
  show: PropTypes.bool,
  style: PropTypes.object,
  toolbar: PropTypes.shape({
    enable: PropTypes.bool,
    show: PropTypes.bool
  }),
  value: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default RichTextEditor;
