import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { get } from 'lodash';

import { Cell } from './Cells';

export default class Row extends PureComponent {
  renderColumns = () => {
    const {
      columns,
      rowData,
      rowIndex,
      styleCalculator,
      stickyFunction,
      onDragEnd
    } = this.props;

    return columns.map((column, index) => {
      const { width, dataKey, cellRenderer } = column;
      const cellData = get(rowData, dataKey);
      const style = { width, ...styleCalculator(index) };

      return (
        <Cell
          dataKey={dataKey}
          cellData={cellData}
          rowData={rowData}
          style={style}
          renderer={cellRenderer}
          cellIndex={index}
          rowIndex={rowIndex}
          isLastSticky={stickyFunction(index)}
          onDragEnd={onDragEnd(index)}
          key={`sitcky-table-row-${rowIndex}-${index}`}
        />
      );
    });
  };

  render() {
    return (
      <div className="React-Sticky-Table--Row">{this.renderColumns()}</div>
    );
  }
}
