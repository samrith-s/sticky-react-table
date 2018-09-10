import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { HeaderCell } from './Cells';

import { headerStyles } from '../../styles/row.styles';
import { RendererType } from '../../constants';

export default class HeaderRow extends PureComponent {
  state = {
    draggingColumn: null,
    dragOverColumn: null
  };

  onHeaderDragOver = cellIndex => {
    this.setState({
      dragOverColumn: cellIndex
    });
  };

  onHeaderDragStart = cellIndex => {
    this.setState({
      draggingColumn: cellIndex
    });
  };

  onHeaderDragEnd = () => {
    const { draggingColumn, dragOverColumn } = this.state;
    this.props.onReorderColumn(draggingColumn, dragOverColumn);
  };

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
      checkboxRenderer,
      data,
      onAutoResizeColumn
    } = this.props;

    return columns.map((column, cellIndex) => {
      const {
        title,
        width,
        dataKey,
        headerRenderer: renderer,
        isSortable,
        isCheckbox,
        filterRenderer,
        filterTrigger,
        filterAlignment
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
            isAllSelected,
            filterRenderer,
            filterTrigger,
            filterAlignment,
            data
          }}
          onDragEnd={onDragEnd(cellIndex)}
          key={`sitcky-table-header-${cellIndex}`}
          id="all"
          checkboxRenderer={isCheckbox ? checkboxRenderer : null}
          onHeaderDragStart={this.onHeaderDragStart}
          onHeaderDragEnd={this.onHeaderDragEnd}
          onHeaderDragOver={this.onHeaderDragOver}
          onAutoResizeColumn={onAutoResizeColumn}
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
  data: PropTypes.array,
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
  checkboxRenderer: RendererType,
  onAutoResizeColumn: PropTypes.func.isRequired,
  onReorderColumn: PropTypes.func
};
