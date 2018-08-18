import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Row, HeaderRow } from './Rows';
import ColumnSwitcher from './ColumnSwitcher';

import { ColumnDisplayName } from '../constants';
import Errors from './Errors';

import { sort } from '../util';

import {
  mainContainerStyle,
  innerContainerStyle
} from '../styles/container.styles';

export default class Table extends PureComponent {
  state = {
    columns: [],
    sortedColumn: null,
    data: [],
    checkedRows: []
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
    if (this.props.rowSelection) {
      columns.push({
        dataKey: 'checkbox',
        width: 30,
        title: '',
        index: 0,
        visible: true,
        isCheckbox: true,
        renderer: this.props.checkboxRenderer
      });
    }

    React.Children.forEach(this.props.children, (child, index) => {
      const { props } = this.validateChild(child);
      columns.push({ ...props, index: index + 1, visible: true });
    });

    this.setState({ columns });
  }

  getFixedCount = () => {
    const { fixed, rowSelection } = this.props;
    if (rowSelection) {
      return fixed + 1;
    }
    return fixed;
  };

  getLeftStyle = cellIndex => {
    const fixed = this.getFixedCount();
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
    const fixed = this.getFixedCount();
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

  handleRowCheck = id => {
    const { checkedRows, data } = this.state;
    const { onRowCheck, idKey } = this.props;
    let newCheckedRows = [...checkedRows];
    if (id === 'all') {
      if (newCheckedRows.length === data.length) {
        newCheckedRows = [];
      } else {
        newCheckedRows = data.map(row => row[idKey]);
      }
    } else {
      const ind = checkedRows.findIndex(rowId => rowId === id);
      if (ind !== -1) {
        newCheckedRows.splice(ind, 1);
      } else {
        newCheckedRows.push(id);
      }
    }
    this.setState(
      {
        checkedRows: newCheckedRows
      },
      () => onRowCheck && onRowCheck(newCheckedRows)
    );
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
    const { columns, sortedColumn, checkedRows, data } = this.state;
    const isAllSelected = data.length === checkedRows.length;
    const { checkboxRenderer, idKey, headerClassName } = this.props;
    return (
      <HeaderRow
        rowIndex={0}
        styleCalculator={this.getLeftStyle}
        stickyFunction={this.isLastSticky}
        onDragEnd={this.handleDragEnd}
        onSort={this.handleSort}
        sortedColumn={sortedColumn}
        columns={columns.filter(col => col.visible)}
        checkboxRenderer={checkboxRenderer}
        checkedRows={checkedRows}
        onCheck={this.handleRowCheck}
        idKey={idKey}
        isAllSelected={isAllSelected}
        className={headerClassName}
      />
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
    const { columns, data, checkedRows } = this.state;
    const { rowSelection, checkboxRenderer, idKey, rowClassName } = this.props;

    return data.map((rowData, index) => {
      const id = rowData[idKey];
      const isChecked = checkedRows.includes(id);

      return (
        <Row
          id={id}
          columns={columns.filter(col => col.visible)}
          rowData={rowData}
          rowIndex={index + 1}
          styleCalculator={this.getLeftStyle}
          stickyFunction={this.isLastSticky}
          onDragEnd={this.handleDragEnd}
          key={`sticky-table-row-${index + 1}`}
          rowSelection={rowSelection}
          checkboxRenderer={checkboxRenderer}
          isChecked={isChecked || false}
          onCheck={this.handleRowCheck}
          rowClassName={rowClassName}
        />
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
    const { columns } = this.state;

    return (
      <div className="Sticky-React-Table" style={mainContainerStyle}>
        <div className="Sticky-React-Table-inner" style={innerContainerStyle}>
          {this.headerRenderer()}
          {this.bodyRenderer()}
        </div>
        <ColumnSwitcher
          columns={columns}
          onChange={this.handleColumnVisibilityChange}
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
  data: PropTypes.array.isRequired,
  onSort: PropTypes.func,
  rowSelection: PropTypes.bool,
  checkboxRenderer: PropTypes.node,
  onRowCheck: PropTypes.func,
  idKey: PropTypes.string,
  rowClassName: PropTypes.func,
  headerClassName: PropTypes.string
};

Table.defaultProps = {
  rowSelection: true,
  idKey: 'id'
};
