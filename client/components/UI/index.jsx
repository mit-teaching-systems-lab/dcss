/**
 * Third Party UI & Add-ons
 */
export * from 'semantic-ui-react';
export * from 'react-semantic-ui-range';

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
 * Custom Elements, non-extension
 * (Fomantic)
 */
export * from './Text';
