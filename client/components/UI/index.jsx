export * from 'semantic-ui-react';

/**
 * Custom Extensions
 */
import { Table } from 'semantic-ui-react';
import ClickableTableCell from './ClickableTableCell';
Table.Cell.Clickable = ClickableTableCell;

/**
 * Wrap in single object export
 */
// export {
//   Button,
//   Card,
//   Checkbox,
//   Confirm,
//   Container,
//   Dimmer,
//   Dropdown,
//   Form,
//   Grid,
//   Header,
//   Icon,
//   Image,
//   Input,
//   Label,
//   List,
//   Menu,
//   Message,
//   Modal,
//   Pagination,
//   Placeholder,
//   Popup,
//   Ref,
//   Segment,
//   Tab,
//   Table,
// };

/**
 * components
 * Supports migration to default export
 */
// const components = {
//   Button,
//   Card,
//   Checkbox,
//   Confirm,
//   Container,
//   Dimmer,
//   Dropdown,
//   Form,
//   Grid,
//   Header,
//   Icon,
//   Image,
//   Input,
//   Label,
//   List,
//   Menu,
//   Message,
//   Modal,
//   Pagination,
//   Placeholder,
//   Popup,
//   Ref,
//   Segment,
//   Tab,
//   Table,
// };
export * as default from 'semantic-ui-react';
