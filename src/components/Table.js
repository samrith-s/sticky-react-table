import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';

import { Row, HeaderRow } from './Rows';
import ColumnSwitcher from './ColumnSwitcher';

import { ColumnDisplayName } from './Constants';
import Errors from './Errors';

import { sort } from '../utils';

export default class Table extends PureComponent {
  state = {
    columns: [],
    sortedColumn: null,
    data: []
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.onSort || prevState.sortedColumn === null) {
      return { data: nextProps.data };
    } else {
      return {
        data: sort(
          nextProps.data,
          prevState.sortedColumn.dataKey,
          prevState.sortedColumn.dir.toLowerCase()
        )
      };
    }
  };

  componentDidMount() {
    const columns = [];
    React.Children.forEach(this.props.children, (child, index) => {
      const { props } = this.validateChild(child);
      columns.push({ ...props, index, visible: true });
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
        columns.filter(col => col.visible).forEach(({ width }, index) => {
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

  handleSort = column => {
    const { onSort } = this.props;

    if (typeof onSort === 'function') {
      onSort(column);
    } else {
      this.defaultSort(column);
    }
  };

  handleColumnVisibilityChange = ({ target: { id } }) => {
    const ind = this.state.columns.findIndex(col => col.dataKey === id);
    if (ind !== -1) {
      const oldVisibility = this.state.columns[ind].visible;
      const newColumns = [
        ...this.state.columns.slice(0, ind),
        {
          ...this.state.columns[ind],
          visible: !oldVisibility
        },
        ...this.state.columns.slice(ind + 1)
      ];

      this.setState({
        columns: newColumns
      });
    }
  };

  headerRenderer = () => {
    const { columns, sortedColumn } = this.state;
    return (
      <Fragment>
        <ColumnSwitcher
          columns={columns}
          onChange={this.handleColumnVisibilityChange}
        />
        <HeaderRow
          rowIndex={0}
          styleCalculator={this.getLeftStyle}
          stickyFunction={this.isLastSticky}
          onDragEnd={this.handleDragEnd}
          onSort={this.handleSort}
          sortedColumn={sortedColumn}
          columns={columns.filter(col => col.visible)}
        />
      </Fragment>
    );
  };

  defaultSort = column => {
    const { sortedColumn } = this.state;

    if (!sortedColumn || sortedColumn.dataKey !== column.dataKey) {
      this.setState({
        sortedColumn: {
          ...column,
          dir: 'ASC'
        }
      });
    } else {
      let newSortDir = 'DESC';
      if (!sortedColumn.dir || sortedColumn.dir === 'DESC') {
        newSortDir = 'ASC';
      }
      const newSortedColumn = {
        ...sortedColumn,
        dir: newSortDir
      };
      this.setState({
        sortedColumn: newSortedColumn
      });
    }
  };

  bodyRenderer = () => {
    const { columns, data } = this.state;
    const { rowSelection, checkboxRenderer } = this.props;

    return data.map((rowData, index) => (
      <Row
        columns={columns.filter(col => col.visible)}
        rowData={rowData}
        rowIndex={index + 1}
        styleCalculator={this.getLeftStyle}
        stickyFunction={this.isLastSticky}
        onDragEnd={this.handleDragEnd}
        key={`sticky-table-row-${index + 1}`}
        rowSelection={rowSelection}
        checkboxRenderer={checkboxRenderer}
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
  data: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  rowSelection: PropTypes.bool,
  checkboxRenderer: PropTypes.node
};

Table.defaulProps = {
  rowSelection: true
};
