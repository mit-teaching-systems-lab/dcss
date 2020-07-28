const noOp = () => {};

export const onKeyUp = (...args) => {
  let event;
  let data;
  let delegateTo;

  if (args.length === 3) {
    [event, data, delegateTo] = args;
  }
  if (args.length === 2) {
    [event, delegateTo] = args;

    if (typeof delegateTo !== 'function') {
      data = delegateTo;
      delegateTo = noOp;
    } else {
      data = {};
    }
  }
  const key = event.which || event.keyCode;
  const target = event.target;
  if (key === 13 || key === 32) {
    if (delegateTo === noOp) {
      target.click();
    } else {
      delegateTo(event, data);
    }
  }
};

export default {
  onKeyUp
};
