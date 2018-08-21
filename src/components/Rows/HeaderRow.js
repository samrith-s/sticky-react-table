import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { map } from 'lodash';

import { HeaderCell } from './Cells';

import { headerStyles } from '../../styles/row.styles';

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
      data
    } = this.props;

    return columns.map((column, index) => {
      const {
        title,
        width,
        dataKey,
        headerRenderer,
        isSortable,
        isCheckbox
      } = column;
      const style = { width, ...styleCalculator(index) };
      const { isSticky, isLastSticky } = stickyFunction(index);

      const columnData = data.reduce((values, row) => {
        if (values[row[dataKey]]) {
          values[row[dataKey]].count++;
        } else {
          values[row[dataKey]] = {
            id: row.id,
            value: row[dataKey],
            count: 1
          };
        }
        return values;
      }, {});

      console.log(columnData);

      return (
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
          id="all"
          checkedRows={checkedRows}
          onCheck={onCheck}
          isCheckbox={isCheckbox}
          isAllSelected={isAllSelected}
          columnData={columnData}
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
  className: PropTypes.string
};
