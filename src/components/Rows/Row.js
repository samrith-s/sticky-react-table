import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { get } from 'lodash';
import classNames from 'classnames';

import { Cell } from './Cells';

export default class Row extends PureComponent {
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
      isChecked
    } = this.props;

    return columns.map((column, index) => {
      const { width, dataKey, cellRenderer, isCheckbox, className } = column;
      const cellData = get(rowData, dataKey);
      const style = { width, ...styleCalculator(index) };
      const { isSticky, isLastSticky } = stickyFunction(index);

      return (
        <Cell
          dataKey={dataKey}
          cellData={cellData}
          rowData={rowData}
          style={style}
          renderer={cellRenderer}
          cellIndex={index}
          rowIndex={rowIndex}
          isSticky={isSticky}
          isLastSticky={isLastSticky}
          onDragEnd={onDragEnd(index)}
          key={`sitcky-table-row-${rowIndex}-${index}`}
          id={id}
          onCheck={onCheck}
          isCheckbox={isCheckbox}
          isChecked={isChecked}
          className={className}
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

  render() {
    const { isChecked } = this.props;

    return (
      <div
        className={classNames(
          'Sticky-React-Table--Row',
          this.getRowClassNames(),
          {
            'Sticky-React-Table--Row--is-Checked': isChecked
          }
        )}
      >
        {this.renderColumns()}
      </div>
    );
  }
}

Row.propTypes = {
  columns: PropTypes.array.isRequired,
  rowData: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  styleCalculator: PropTypes.func.isRequired,
  stickyFunction: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired,
  rowClassName: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
