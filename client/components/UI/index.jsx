export * from 'semantic-ui-react';

/**
 * Custom Extensions
 */
import { Table } from 'semantic-ui-react';
import ClickableTableCell from './ClickableTableCell';
Table.Cell.Clickable = ClickableTableCell;

/**
 * components
 * Supports migration to default export
 */
export * as default from 'semantic-ui-react';
