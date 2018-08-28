import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { map } from 'lodash';

import { HeaderCell } from './Cells';

import { headerStyles } from '../../styles/row.styles';
import { RendererType } from '../../constants';

export default class HeaderRow extends PureComponent {
  renderColumns = () => {
    const {
      columns,
      rowIndex,
      styleCalculator,
      stickyFunction,
      onDragEnd,
      onSort,
      sortedColumn,
      checkedRows,
      onCheck,
      isAllSelected,
      data,
      checkboxRenderer,
      onFilterChange,
      filters
    } = this.props;

    return columns.map((column, cellIndex) => {
      const {
        title,
        width,
        dataKey,
        headerRenderer: renderer,
        isSortable,
        isCheckbox,
        filterRenderer
      } = column;
      const style = { width, ...styleCalculator(cellIndex) };
      const { isSticky, isLastSticky } = stickyFunction(cellIndex);

      return (
        <HeaderCell
          {...{
            title,
            width,
            dataKey,
            cellIndex,
            style,
            isSticky,
            isLastSticky,
            renderer,
            rowIndex,
            isSortable,
            onSort,
            sortedColumn,
            checkedRows,
            onCheck,
            isCheckbox,
            onFilterChange,
            isAllSelected,
            data,
            filters
          }}
          onDragEnd={onDragEnd(cellIndex)}
          key={`sitcky-table-header-${cellIndex}`}
          id="all"
          checkboxRenderer={isCheckbox ? checkboxRenderer : null}
          filterRenderer={filterRenderer ? filterRenderer : null}
        />
      );
    });
  };

  render() {
    const { className } = this.props;

    return (
      <div
        className={classNames(className, 'Sticky-React-Table--Header')}
        style={headerStyles}
      >
        {this.renderColumns()}
      </div>
    );
  }
}

HeaderRow.propTypes = {
  columns: PropTypes.array.isRequired,
  rowIndex: PropTypes.number.isRequired,
  styleCalculator: PropTypes.func.isRequired,
  stickyFunction: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  sortedColumn: PropTypes.object,
  onSort: PropTypes.func,
  isSortable: PropTypes.bool,
  checkedRows: PropTypes.array.isRequired,
  onCheck: PropTypes.func.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  className: PropTypes.string,
  checkboxRenderer: RendererType
};
