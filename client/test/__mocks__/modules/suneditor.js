module.exports = {
  create() {
    return {
      appendContents() {},
      destroy() {},
      disabled() {},
      enabled() {},
      getContents() {},
      hide() {},
      setContents() {},
      show() {},
      toolbar: {
        show() {},
        hide() {},
        enabled() {},
        disabled() {}
      },
      core: {
        focusEdge() {},
        hasFocus: false,
        context: {
          element: {
            wysiwyg: {
              blur() {},
              focus() {}
            }
          }
        }
      }
    };
  }
};
