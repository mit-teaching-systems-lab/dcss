import align from 'suneditor/src/plugins/submenu/align';
import math from 'suneditor/src/plugins/dialog/math';
import blockquote from 'suneditor/src/plugins/command/blockquote';
import font from 'suneditor/src/plugins/submenu/font';
import fontColor from 'suneditor/src/plugins/submenu/fontColor';
import fontSize from 'suneditor/src/plugins/submenu/fontSize';
import formatBlock from 'suneditor/src/plugins/submenu/formatBlock';
import hiliteColor from 'suneditor/src/plugins/submenu/hiliteColor';
import horizontalRule from 'suneditor/src/plugins/submenu/horizontalRule';
import lineHeight from 'suneditor/src/plugins/submenu/lineHeight';
import list from 'suneditor/src/plugins/submenu/list';
import paragraphStyle from 'suneditor/src/plugins/submenu/paragraphStyle';
import table from 'suneditor/src/plugins/submenu/table';
import template from 'suneditor/src/plugins/submenu/template';
import textStyle from 'suneditor/src/plugins/submenu/textStyle';
import image from 'suneditor/src/plugins/dialog/image';
import link from 'suneditor/src/plugins/dialog/link';
import video from 'suneditor/src/plugins/dialog/video';
import audio from 'suneditor/src/plugins/dialog/audio';

const plugins = {
  align,
  math,
  blockquote,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  lineHeight,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  image,
  link,
  video,
  audio,
};

export default (buttons) => {
  return buttons.flat().reduce((accum, name) => {
    if (plugins[name]) {
      accum.push(plugins[name]);
    } else {
      console.log(`SunEditor Plugin: ${name} was not present in loaded plugins.`);
    }
    return accum;
  }, []);
};
