import PropTypes from 'prop-types';

export const ColumnDisplayName = 'Column';

export const cellPropKeys = [
  'id',
  'rowData',
  'dataKey',
  'cellData',
  'isChecked',
  'isCheckbox',
  'style',
  'title',
  'isAllSelected',
  'checkboxRenderer'
];

export const headerCellPropKeys = [...cellPropKeys, 'isSortable'];

export const rowPropKeys = [
  'id',
  'rowData',
  'rowIndex',
  'columns',
  'isChecked'
];

export const RendererType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func
]);
