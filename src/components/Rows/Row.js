import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { get, pick } from 'lodash';
import classNames from 'classnames';

import { Cell } from './Cells';

import { RendererType, rowPropKeys } from '../../constants';
import { RowId } from '../../types';

import { renderElement } from '../../util';

import { rowStyles } from '../../styles/row.styles';

export default class Row extends PureComponent {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    rowData: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    styleCalculator: PropTypes.func.isRequired,
    stickyFunction: PropTypes.func.isRequired,
    onDragEnd: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
    onCheck: PropTypes.func.isRequired,
    rowClassName: PropTypes.func,
    renderer: PropTypes.func,
    id: RowId.isRequired,
    checkboxRenderer: RendererType,
    isLoaderRow: PropTypes.bool,
    infiniteScrollCellRenderer: RendererType,
    getRef: PropTypes.func.isRequired
  };

  static defaultProps = {
    isLoaderRow: false
  };

  renderColumns = () => {
    const {
      columns,
      rowData,
      rowIndex,
      styleCalculator,
      stickyFunction,
      onDragEnd,
      onCheck,
      id,
      isChecked,
      checkboxRenderer,
      infiniteScrollCellRenderer,
      isLoaderRow
    } = this.props;

    return columns.map((column, cellIndex) => {
      const { width, dataKey, cellRenderer, isCheckbox, className } = column;

      const cellData = get(rowData, dataKey);
      const style = { width, ...styleCalculator(cellIndex) };
      const { isSticky, isLastSticky } = stickyFunction(cellIndex);
      const renderer = isLoaderRow ? infiniteScrollCellRenderer : cellRenderer;

      return (
        <Cell
          {...{
            id,
            dataKey,
            cellData,
            rowData,
            rowIndex,
            style,
            isSticky,
            isLastSticky,
            onCheck,
            isCheckbox: isCheckbox && !isLoaderRow,
            isChecked,
            className,
            renderer,
            cellIndex
          }}
          onDragEnd={onDragEnd(cellIndex)}
          key={`sitcky-table-row-${rowIndex}-${cellIndex}`}
          checkboxRenderer={isCheckbox ? checkboxRenderer : null}
        />
      );
    });
  };

  getRowClassNames = () => {
    const { rowClassName, rowData, rowIndex } = this.props;
    if (typeof rowClassName === 'function') {
      return rowClassName(rowData, rowIndex);
    }
    return '';
  };

  getRef = ref => {
    const { getRef, rowIndex } = this.props;

    getRef(ref, rowIndex);
  };

  defaultRowRenderer = () => {
    const { isChecked } = this.props;

    return (
      <div
        ref={this.getRef}
        className={classNames(
          'Sticky-React-Table--Row',
          this.getRowClassNames(),
          {
            'Sticky-React-Table--Row--is-Checked': isChecked
          }
        )}
        style={rowStyles}
      >
        {this.renderColumns()}
      </div>
    );
  };

  render() {
    const { renderer } = this.props;

    if (renderer) {
      const row = renderElement(renderer, {
        ...pick(this.props, rowPropKeys),
        renderColumns: this.renderColumns,
        defaultRowRenderer: this.defaultRowRenderer
      });

      if (row) {
        return row;
      }
    }

    return this.defaultRowRenderer();
  }
}
