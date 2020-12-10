export const small = [
  ['font', 'fontSize'],
  ['bold', 'underline', 'italic', 'strike'],
  ['fontColor'],
  ['link', 'image', 'imageGallery']
];

export const medium = [
  ['font', 'fontSize', 'formatBlock', 'lineHeight'],
  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
  ['removeFormat'],
  ['outdent', 'indent'],
  ['fullScreen', 'codeView'],
  ['undo', 'redo']
];

export const large = [
  ['font', 'fontSize', 'formatBlock', 'lineHeight'],
  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
  ['removeFormat'],
  ['fontColor', 'hiliteColor'],
  ['align', 'outdent', 'indent'],
  ['horizontalRule', 'list', 'table'],
  ['link', 'image', 'imageGallery', 'video'],
  ['fullScreen', 'codeView'],
  ['undo', 'redo'],
  ['template']
];

export const component = [
  [
    'fullScreen',
    'codeView',
    'undo',
    'redo',
    'removeFormat',
    'font',
    'fontSize',
    'formatBlock',
    'lineHeight',
    'fontColor',
    'hiliteColor',
    'bold',
    'underline',
    'italic',
    'strike',
    'subscript',
    'superscript',
    'align',
    'outdent',
    'indent',
    'horizontalRule',
    'list',
    'table',
    'link',
    'image',
    'imageGallery',
    'video'
  ]
];

export const suggestion = [
  [
    'undo',
    'redo',
    'removeFormat',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
    'image',
    'imageGallery',
    'video'
  ]
];

export const chat = [
  [
    'undo',
    'redo',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'link',
    'blockquote',
    'math',
    'image',
    'imageGallery'
  ]
];

export default { small, medium, large, component, suggestion, chat };
