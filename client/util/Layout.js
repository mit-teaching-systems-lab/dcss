const ITEMS_ROW_HEIGHT = 266;
const ITEMS_PER_ROW = 4;
// height + margin-bottom
const NAV_HEIGHT = 40 + 7;
// height + border-top + border-bottom + margin-top + margin-bottom;
const MENU_HEIGHT = 43 + 1 + 1 + 14 + 14;
// height + padding-top + padding-bottom
const PAGINATOR_HEIGHT = 42 + 14 + 14;
const TOTAL_UNAVAILABLE_HEIGHT = NAV_HEIGHT + MENU_HEIGHT + PAGINATOR_HEIGHT;

export function computeItemsRowsPerPage(options) {
  const {
    defaultRowCount,
    totalUnavailableHeight,
    itemsPerRow,
    itemsRowHeight
  } = options;
  const availableHeight = totalUnavailableHeight
    ? window.innerHeight - totalUnavailableHeight
    : window.innerHeight - TOTAL_UNAVAILABLE_HEIGHT;

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

  const itemsPerPage = itemsPerRow
    ? rowsPerPage * itemsPerRow
    : rowsPerPage * ITEMS_PER_ROW;

  return {
    itemsPerPage,
    rowsPerPage
  };
}
