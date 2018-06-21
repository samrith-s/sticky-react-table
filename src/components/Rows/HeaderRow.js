import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { HeaderCell } from './Cells';

export default class HeaderRow extends PureComponent {
  renderColumns = () => {
    const {
      columns,
      rowIndex,
      styleCalculator,
      stickyFunction,
      onDragEnd,
      onSort,
      sortedColumn
    } = this.props;

    return columns.map((column, index) => {
      const {
        title,
        width,
        dataKey,
        headerRenderer,
        isSortable,
        visible = true
      } = column;
      const style = { width, ...styleCalculator(index) };
      const { isSticky, isLastSticky } = stickyFunction(index);

      return visible ? (
        <HeaderCell
          title={title}
          width={width}
          dataKey={dataKey}
          index={index}
          style={style}
          isSticky={isSticky}
          isLastSticky={isLastSticky}
          renderer={headerRenderer}
          cellIndex={index}
          rowIndex={rowIndex}
          onDragEnd={onDragEnd(index)}
          key={`sitcky-table-header-${index}`}
          isSortable={isSortable}
          onSort={onSort}
          sortedColumn={sortedColumn}
        />
      ) : null;
    });
  };

  render() {
    return (
      <div className="React-Sticky-Table--Header">{this.renderColumns()}</div>
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
  isSortable: PropTypes.bool
};
