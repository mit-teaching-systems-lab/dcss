import React, { Component, createRef } from 'react';
import SunEditor from 'suneditor';
import buttons from './buttons';
import plugins from './plugins';
import language from './language';
import PropTypes from 'prop-types';
import 'suneditor/dist/css/suneditor.min.css';


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
  buttonList: buttons.large,
  lang: en,
  width: '100%'
};

const SymbolEditor = Symbol('@@editor');

class RichTextEditor extends Component {
  constructor(props) {
    super(props);
    this.ref = createRef();
  }
  componentDidMount() {
    if (this.ref.current) {
      let {
        autoFocus = false,
        defaultValue = '',
        disable = false,
        enable = true,
        hide = false,
        insertHTML,
        name = '',
        onChange = () => {},
        options = {},
        placeholder = '',
        show = true,
        toolbar = {
          enable: true,
          show: true
        },
        value = ''
      } = this.props;

      options = Object.assign({}, defaultOptions, options);
      options.plugins = plugins(options.buttonList || []);

      this[SymbolEditor] = SunEditor.create(this.ref.current);
      this[SymbolEditor].setOptions(options);

      this[SymbolEditor].onChange = content => {
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
    const {
      mode = 'editor',
      name = '',
      defaultValue = '',
      defaultValue: __html
    } = this.props;
    return mode === 'editor' ? (
      <div style={{cursor: 'text'}}>
        <textarea ref={ref} />
      </div>
    ) : (
      <div dangerouslySetInnerHTML={{ __html }}></div>
    );
  }
}

RichTextEditor.propTypes = {
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
  disable: PropTypes.bool,
  enable: PropTypes.bool,
  hide: PropTypes.bool,
  lang: PropTypes.string,
  mode: PropTypes.string,
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
  toolbar: PropTypes.shape({
    enable: PropTypes.bool,
    show: PropTypes.bool
  }),
  value: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default RichTextEditor;
