import React from 'react';
import { orderBy, get } from 'lodash';

import { defaultCellStyle, stickyCellStyle } from '../styles/cell.styles';

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

export function filter(data, filters) {
  return data.filter(row => {
    let toFilter = true;
    Object.keys(filters).forEach(columnKey => {
      let isCurrentColumnFilterPresent = false;
      Object.keys(filters[columnKey]).forEach(filterKey => {
        if (get(row, columnKey) === filterKey) {
          isCurrentColumnFilterPresent = true;
        }
      });

      if (isCurrentColumnFilterPresent === false) {
        toFilter = false;
      }
    });
    return toFilter;
  });
}

export function getCellStyle(style, isSticky) {
  const cellStyle = {
    ...style,
    ...defaultCellStyle
  };

  if (isSticky) {
    return {
      ...cellStyle,
      ...stickyCellStyle
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
