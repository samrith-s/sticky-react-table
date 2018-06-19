import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import { get } from "lodash";

import { HeaderCell, RowCell } from "./Cells";

import { ColumnDisplayName } from "./Constants";
import Errors from "./Errors";

export default class Table extends PureComponent {
  state = {
    columns: []
  };

  componentDidMount() {
    const columns = [];
    React.Children.forEach(this.props.children, (child, index) => {
      const { props } = this.validateChild(child);
      columns.push({ ...props, index });
    });

    this.setState({ columns });
  }

  getLeftStyle = cellIndex => {
    const { children, fixed } = this.props;
    const { columns } = this.state;

    let left = 0;
    let zIndex = 1;

    if (fixed) {
      if (cellIndex === 0) {
        return { left, zIndex };
      } else if (cellIndex <= fixed - 1) {
        columns.forEach(({ width }, index) => {
          if (index < cellIndex) {
            left += width;
          } else {
            return;
          }
        });
      } else {
        zIndex = 0;
        left = "auto";
      }
    }

    return { left, zIndex };
  };

  isLastSticky = index => {
    const { fixed } = this.props;
    return fixed && index === fixed - 1;
  };

  headerRenderer = child => {
    const { columns } = this.state;

    return (
      <div className="React-Sticky-Table--Header">
        {columns.map((column, index) => {
          const { title, width, dataKey, headerRenderer } = column;
          const style = { width, ...this.getLeftStyle(index) };
          return (
            <HeaderCell
              title={title}
              width={width}
              dataKey={dataKey}
              index={index}
              style={style}
              isLastSticky={this.isLastSticky(index)}
              renderer={headerRenderer}
              cellIndex={index}
              key={`sitcky-table-header-${index}`}
              onDragEnd={this.handleDragEnd(index)}
            />
          );
        })}
      </div>
    );
  };

  rowRenderer = (rowData, rowIndex) => {
    const { columns } = this.state;

    return columns.map((column, index) => {
      const { width, dataKey, rowRenderer } = column;
      const cellData = get(rowData, dataKey);
      const style = { width, ...this.getLeftStyle(index) };
      return (
        <RowCell
          dataKey={dataKey}
          cellData={cellData}
          rowData={rowData}
          style={style}
          isLastSticky={this.isLastSticky(index)}
          renderer={rowRenderer}
          cellIndex={index}
          rowIndex={rowIndex}
          key={`sitcky-table-row-${rowIndex}-${index}`}
          onDragEnd={this.handleDragEnd(index)}
        />
      );
    });
  };

  rowsRenderer = () => {
    const { data } = this.props;

    return data.map((rowData, index) => {
      return (
        <div
          className="React-Sticky-Table--Row"
          key={`react-sticky-table-row-${index}`}
        >
          {this.rowRenderer(rowData, index)}
        </div>
      );
    });
  };

  validateChild = child => {
    if (child.type.displayName === ColumnDisplayName) {
      return child;
    } else {
      throw new Error(Errors.invalidChildren);
    }
  };

  handleDragEnd = columnIndex => e => {
    console.log("drag ended!");
    const widthDiff = e.clientX - e.target.getBoundingClientRect().left;
    const newColumns = [...this.state.columns];
    newColumns[columnIndex] = {
      ...newColumns[columnIndex],
      width: newColumns[columnIndex].width + widthDiff
    };
    this.setState({
      columns: newColumns
    });
  };

  render() {
    return (
      <div className="React-Sticky-Table">
        {this.headerRenderer()}
        {this.rowsRenderer()}
      </div>
    );
  }
}

Table.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired
};
