/**
 * Third Party UI & Add-ons
 */
export * from 'semantic-ui-react';
export * from 'react-semantic-ui-range';

/**
 * Custom Elements, Semantic UI React Extensions
 */
import { Card, Form, Menu, Modal, Table } from 'semantic-ui-react';

import CardGroupStackable from './CardGroupStackable';
Card.Group.Stackable = CardGroupStackable;

import FormFieldLabelled from './FormFieldLabelled';
Form.Field.Labelled = FormFieldLabelled;

import MenuItemTabbable from './MenuItemTabbable';
Menu.Item.Tabbable = MenuItemTabbable;

import ModalAccessible from './ModalAccessible';
Modal.Accessible = ModalAccessible;

import TableCellClickable from './TableCellClickable';
Table.Cell.Clickable = TableCellClickable;

/**
 * Custom Elements, non-extension
 * (Fomantic)
 */
export * from './Text';
import { Text, Truncate } from './Text';
Text.Truncate = Truncate;


/**
 * Custom Elements
 */
export * from './ColorPickerAccessible';
export * from './Title';
