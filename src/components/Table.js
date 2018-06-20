import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import Row, { HeaderRow } from './Rows';

import { ColumnDisplayName } from './Constants';
import Errors from './Errors';

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
    const { fixed } = this.props;
    const { columns } = this.state;

    let left = 0;

    if (fixed) {
      if (cellIndex === 0) {
        return { left };
      } else if (cellIndex <= fixed - 1) {
        columns.forEach(({ width }, index) => {
          if (index < cellIndex) {
            left += width;
          } else {
            return;
          }
        });
      } else {
        left = 'auto';
      }
    }

    return { left };
  };

  isLastSticky = cellIndex => {
    const { fixed } = this.props;
    const isSticky = fixed && cellIndex <= fixed - 1;
    const isLastSticky = isSticky && cellIndex === fixed - 1;
    return { isSticky, isLastSticky };
  };

  headerRenderer = () => {
    const { columns } = this.state;

    return (
      <HeaderRow
        columns={columns}
        rowIndex={0}
        styleCalculator={this.getLeftStyle}
        stickyFunction={this.isLastSticky}
        onDragEnd={this.handleDragEnd}
      />
    );
  };

  bodyRenderer = () => {
    const { data } = this.props;
    const { columns } = this.state;

    return data.map((rowData, index) => (
      <Row
        columns={columns}
        rowData={rowData}
        rowIndex={index + 1}
        styleCalculator={this.getLeftStyle}
        stickyFunction={this.isLastSticky}
        onDragEnd={this.handleDragEnd}
        key={`sitcky-table-row-${index + 1}`}
      />
    ));
  };

  validateChild = child => {
    if (child.type.displayName === ColumnDisplayName) {
      return child;
    } else {
      throw new Error(Errors.invalidChildren);
    }
  };

  handleDragEnd = columnIndex => e => {
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

  handleDragHandlerRef = ref => {
    this.dragHandle = ref;
  };

  render() {
    return (
      <div className="React-Sticky-Table">
        {this.headerRenderer()}
        {this.bodyRenderer()}
        <div
          className="React-Sticky-Table-Global-Resize-Handler"
          ref={this.handleDragHandlerRef}
        />
      </div>
    );
  }
}

Table.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  fixed: PropTypes.number,
  data: PropTypes.array.isRequired
};
