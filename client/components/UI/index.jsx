export * from 'semantic-ui-react';

/**
 * Custom Extensions
 */
import { Form, Modal, Table } from 'semantic-ui-react';

import FormFieldLabelled from './FormFieldLabelled';
Form.Field.Labelled = FormFieldLabelled;

import ModalAccessible from './ModalAccessible';
Modal.Accessible = ModalAccessible;

import TableCellClickable from './TableCellClickable';
Table.Cell.Clickable = TableCellClickable;

/**
 * Supports migration to default export
 */
// export * as default from 'semantic-ui-react';
