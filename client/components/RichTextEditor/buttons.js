export const small = [
  ['font', 'fontSize'],
  ['bold', 'underline', 'italic', 'strike'],
  ['fontColor'],
  ['link', 'image']
];

export const medium = [
  ['font', 'fontSize', 'formatBlock'],
  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
  ['removeFormat'],
  ['outdent', 'indent'],
  ['fullScreen', 'codeView'],
  ['undo', 'redo']
];

export const large = [
  ['font', 'fontSize', 'formatBlock'],
  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
  ['removeFormat'],
  '/',
  ['fontColor', 'hiliteColor'],
  ['align', 'outdent', 'indent'],
  ['horizontalRule', 'list', 'table'],
  ['link', 'image', 'video'],
  ['fullScreen', 'codeView'],
  ['undo', 'redo'],
  ['template']
];

export default { small, medium, large };
