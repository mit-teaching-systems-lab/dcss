const MOBILE_WIDTH = 767;

export function isForMobile() {
  return window.innerWidth < MOBILE_WIDTH;
}

export function isNotForMobile() {
  return window.innerWidth > MOBILE_WIDTH;
}

const NAV_HEIGHT = 40 + 7;
// height + border-top + border-bottom + margin-top + margin-bottom;
const MENU_HEIGHT = 43 + 1 + 1 + 14 + 14;
// height + padding-top + padding-bottom
const ITEMS_PER_ROW = 4;
// height + margin-bottom
const PAGINATOR_HEIGHT = 42 + 14 + 14;
const ITEMS_ROW_HEIGHT = 266;
const TOTAL_UNAVAILABLE_HEIGHT = NAV_HEIGHT + MENU_HEIGHT + PAGINATOR_HEIGHT;

export function computeItemsRowsPerPage(options) {
  const {
    defaultRowCount,
    totalUnavailableHeight,
    itemsPerRow,
    itemsRowHeight
  } = options;

  let availableHeight = totalUnavailableHeight
    ? window.innerHeight - totalUnavailableHeight
    : window.innerHeight - TOTAL_UNAVAILABLE_HEIGHT;

  // const boundaries = {
  //   top: document.getElementById('boundary-top'),
  //   bottom: document.getElementById('boundary-bottom')
  // };

  // // If a top boundary exists, override the const based available height.
  // if (boundaries.top) {
  //   availableHeight = window.innerHeight - boundaries.top.offsetTop;
  // }

  // if (boundaries.bottom) {
  //   // If a bottom boundary exists, subtract its vertical space from the
  //   // available height.
  //   availableHeight -= window.innerHeight - boundaries.bottom.offsetTop;
  // }

  let rowsPerPage = defaultRowCount;
  const countDownFrom = rowsPerPage * 2;
  const rowHeight = itemsRowHeight || ITEMS_ROW_HEIGHT;

  for (let i = countDownFrom; i > rowsPerPage; i--) {
    const checkRowHeight = availableHeight / i;
    if (checkRowHeight >= rowHeight) {
      rowsPerPage = i;
      break;
    }
  }

  let itemsPerPage = itemsPerRow
    ? rowsPerPage * itemsPerRow
    : rowsPerPage * ITEMS_PER_ROW;

  if (isForMobile()) {
    itemsPerPage = rowsPerPage;
  }
  return {
    itemsPerPage,
    rowsPerPage
  };
}

export function showContentMarker() {
  const div = document.createElement('div');
  div.style.backgroundColor = 'red';
  div.style.height = '1px';
  div.style.width = '100vw';
  div.style.position = 'absolute';
  div.style.top = '100px';
  div.style.zIndex = Number.MAX_SAFE_INTEGER;
  // document.body.appendChild(div);
  // eslint-disable-next-line no-console
  console.dir(div);
}

export default {
  computeItemsRowsPerPage,
  isForMobile,
  isNotForMobile,
  showContentMarker
};
