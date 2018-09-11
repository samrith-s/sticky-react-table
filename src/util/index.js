import React from 'react';
import { orderBy } from 'lodash';

import {
  defaultCellStyle,
  stickyCellStyle,
  reorderableHeaderCellStyle,
  sortableHeaderCellStyle
} from '../styles/cell.styles';

export function dragHandlerSizing(ref) {
  const { left } = ref.getBoundingClientRect();
  ref.style.left = left;
  ref.style.top = 0;
  ref.style.bottom = 0;
  ref.style.position = 'fixed';

  return ref;
}

export function sort(data, key, direction = 'asc') {
  return orderBy(data, key, direction);
}

export function getCellStyle(style, isSticky, isReorderableHeaderCell = false) {
  let cellStyle = {
    ...style,
    ...defaultCellStyle
  };

  if (isSticky) {
    cellStyle = {
      ...cellStyle,
      ...stickyCellStyle
    };
  }

  if (isReorderableHeaderCell) {
    cellStyle = {
      ...cellStyle,
      ...reorderableHeaderCellStyle
    };
  }

  return cellStyle;
}

export const renderElement = (element, props, defaultRenderer) => {
  if (!element) {
    return defaultRenderer;
  }

  return React.isValidElement(element)
    ? React.cloneElement(element, props)
    : React.createElement(element, props);
};

export const stopPropagation = e => e.stopPropagation();

export const getSortableCellStyle = isSortable => {
  if (isSortable) {
    return sortableHeaderCellStyle;
  }

  return {};
};
