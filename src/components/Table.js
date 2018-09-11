import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { times, last } from 'lodash';

import { Row, HeaderRow } from './Rows';
import ColumnSwitcher from './ColumnSwitcher';
import DefaultInfiniteScrollCellRenderer from './Rows/Cells/DefaultInfiniteScrollCellRenderer';

import { ColumnDisplayName, RendererType } from '../constants';
import Errors from './Errors';

import { sort } from '../util';

import {
  mainContainerStyle,
  innerContainerStyle
} from '../styles/container.styles';

export default class Table extends PureComponent {
  static validateProps({ infiniteScrollLoadMore, infiniteScrollTotalCount }) {
    if (
      (infiniteScrollLoadMore || infiniteScrollTotalCount) &&
      !(infiniteScrollLoadMore && infiniteScrollTotalCount)
    ) {
      throw new Error(
        `In order to infinite scroll functionality to work both infiniteScrollLoadMore and infiniteScrollTotalCount props must be provided`
      );
    }
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    fixed: PropTypes.number,
    data: PropTypes.array.isRequired,
    onSort: PropTypes.func,
    rowSelection: PropTypes.bool,
    checkboxRenderer: RendererType,
    onRowCheck: PropTypes.func,
    idKey: PropTypes.string,
    rowClassName: PropTypes.func,
    headerClassName: PropTypes.string,
    rowRenderer: PropTypes.func,
    selectedRows: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    ),
    infiniteScrollTotalCount: PropTypes.number,
    infiniteScrollLoadMore: PropTypes.func,
    infiniteScrollThreshold: PropTypes.number,
    infiniteScrollLoaderRowCount: PropTypes.number,
    infiniteScrollPageSize: PropTypes.number,
    infiniteScrollCellRenderer: RendererType,
    innerRef: PropTypes.func
  };

  static defaultProps = {
    rowSelection: true,
    idKey: 'id',
    infiniteScrollLoaderRowCount: 1,
    infiniteScrollPageSize: 30,
    infiniteScrollThreshold: 10,
    infiniteScrollCellRenderer: DefaultInfiniteScrollCellRenderer
  };

  constructor(props) {
    super(props);

    this.state.columns = this.extractColumns(props);

    Table.validateProps(props);
  }

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

  requestedPages = {};
  rowRefs = {};
  innerRef = {};

  extractColumns = props => {
    const columns = [];

    const { rowSelection, checkboxRenderer, children } = props;

    if (rowSelection) {
      columns.push({
        dataKey: 'checkbox',
        width: 30,
        title: '',
        index: 0,
        visible: true,
        isCheckbox: true,
        renderer: checkboxRenderer
      });
    }

    React.Children.forEach(children, (child, index) => {
      const { props } = this.validateChild(child);

      columns.push({ ...props, index: index + 1, visible: true });
    });

    return columns;
  };

  getFixedCount = () => {
    const { fixed, rowSelection } = this.props;
    if (rowSelection) {
      return fixed + 1;
    }
    return fixed;
  };

  getLeftStyle = cellIndex => {
    const fixed = this.getFixedCount();

    let left = 0;

    if (fixed) {
      if (cellIndex === 0) {
        return { left };
      } else if (cellIndex <= fixed - 1) {
        this.getVisibleColumns().forEach(({ width }, index) => {
          if (index < cellIndex) {
            left += width;
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
    const { data } = this.state;
    const { onRowCheck, idKey, selectedRows } = this.props;

    let checkedRows = [...this.getCheckedRows()];

    if (id === 'all') {
      if (checkedRows.length === data.length) {
        checkedRows = [];
      } else {
        checkedRows = data.map(row => row[idKey]);
      }
    } else {
      const index = checkedRows.findIndex(rowId => rowId === id);

      if (index !== -1) {
        checkedRows.splice(index, 1);
      } else {
        checkedRows.push(id);
      }
    }

    if (selectedRows && onRowCheck) {
      onRowCheck(checkedRows);
    } else {
      this.setState({
        checkedRows
      });
    }
  };

  getCheckedRows = () => {
    return this.props.selectedRows || this.state.checkedRows;
  };

  isRowSelected = rowId => {
    return this.getCheckedRows().includes(rowId);
  };

  isAllRowsSelected = () => {
    return this.props.data.length === this.getCheckedRows().length;
  };

  handleColumnVisibilityChange = dataKey => {
    this.setState(({ columns }) => ({
      columns: columns.map(column => {
        if (column.dataKey === dataKey) {
          return {
            ...column,
            visible: !column.visible
          };
        }

        return column;
      })
    }));
  };

  checkIfFirstColumnIsCheckbox = () => {
    return this.state.columns.length > 0 && this.state.columns[0].isCheckbox;
  };

  handleReorderColumn = (startIndex, endIndex) => {
    if (startIndex !== null && endIndex !== null) {
      if (
        startIndex === 0 ||
        (endIndex === 0 && this.checkIfFirstColumnIsCheckbox())
      ) {
        return;
      }
      const columns = [...this.state.columns];

      const removedColumns = columns.splice(startIndex, 1);
      columns.splice(endIndex, 0, removedColumns[0]);
      this.setState({
        columns
      });
    }
  };

  handleAutoResizeColumn = cellIndex => {
    const columnCells = this.innerRef.getElementsByClassName(
      `Sticky-React-Table--Row-Cell-${cellIndex}`
    );

    const columns = [...this.state.columns];
    let maxWidth = columns[cellIndex].width;

    const mainElement = document.createElement('div');
    mainElement.classList.add('main-div');
    this.innerRef.appendChild(mainElement);

    maxWidth = Array.prototype.reduce.call(
      columnCells,
      (maxWidth, cell) => {
        const dummyElement = document.createElement('div');
        dummyElement.classList.add('my-class');
        mainElement.appendChild(dummyElement);
        dummyElement.innerHTML = cell.outerHTML.replace(
          /width:\s*\d+\.*\d*px\s*;/,
          'width: max-content;'
        );

        maxWidth = Math.max(
          maxWidth,
          dummyElement.getBoundingClientRect().width
        );
        return maxWidth;
      },
      maxWidth
    );

    this.innerRef.removeChild(mainElement);

    columns[cellIndex].width = maxWidth;
    this.setState({
      columns
    });
  };

  headerRenderer = () => {
    const { sortedColumn, data } = this.state;
    const { checkboxRenderer, idKey, headerClassName: className } = this.props;

    const isAllSelected = this.isAllRowsSelected();
    const checkedRows = this.getCheckedRows();
    const columns = this.getVisibleColumns();

    return (
      <HeaderRow
        {...{
          sortedColumn,
          columns,
          checkboxRenderer,
          checkedRows,
          idKey,
          isAllSelected,
          className,
          data
        }}
        rowIndex={0}
        styleCalculator={this.getLeftStyle}
        stickyFunction={this.isLastSticky}
        onDragEnd={this.handleDragEnd}
        onSort={this.handleSort}
        onCheck={this.handleRowCheck}
        onReorderColumn={this.handleReorderColumn}
        onAutoResizeColumn={this.handleAutoResizeColumn}
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

  getVisibleColumns = () => {
    return this.state.columns.filter(column => column.visible);
  };

  saveRowRef = (ref, rowIndex) => {
    this.rowRefs[rowIndex] = ref;
  };

  bodyRenderer = () => {
    const { data } = this.state;
    const {
      rowSelection,
      checkboxRenderer,
      idKey,
      rowClassName,
      rowRenderer: renderer,
      infiniteScrollLoaderRowCount,
      infiniteScrollCellRenderer
    } = this.props;

    const columns = this.getVisibleColumns();

    const getRows = (data, isLoaderRow, startIndex = 0) => {
      return data.map((rowData, index) => {
        const id = rowData[idKey];
        const isChecked = this.isRowSelected(id);
        const rowIndex = startIndex + index + 1;

        return (
          <Row
            {...{
              id,
              columns,
              rowData,
              rowSelection,
              checkboxRenderer,
              rowClassName,
              isChecked,
              rowIndex,
              renderer,
              infiniteScrollCellRenderer,
              isLoaderRow
            }}
            getRef={this.saveRowRef}
            styleCalculator={this.getLeftStyle}
            stickyFunction={this.isLastSticky}
            onDragEnd={this.handleDragEnd}
            key={`sticky-table-row-${id || rowIndex}`}
            onCheck={this.handleRowCheck}
          />
        );
      });
    };

    const rows = getRows(data);

    const unloadedRowCount = this.getUnloadedRowCount();

    if (unloadedRowCount) {
      /**
       *  calculate how many rows to display as loader rows
       *  if almost all data is loaded - display only n remaining rows
       */
      const loaderRowCount = Math.min(
        infiniteScrollLoaderRowCount,
        unloadedRowCount
      );

      const rowCount = rows.length;

      // generate fake loader row data (we basically only need some distinct ids)
      const loaderRowsData = times(loaderRowCount, index => ({
        id: `sticky-react-loader-row-${rowCount + index + 1}`
      }));

      return rows.concat(getRows(loaderRowsData, true, rowCount));
    }

    return rows;
  };

  validateChild = child => {
    if (child.type.displayName === ColumnDisplayName) {
      return child;
    } else {
      throw new Error(Errors.invalidChildren);
    }
  };

  handleDragEnd = columnIndex => e => {
    e.stopPropagation();
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

  getUnloadedRowCount = () => {
    const {
      infiniteScrollLoadMore,
      infiniteScrollTotalCount,
      data
    } = this.props;

    if (infiniteScrollLoadMore && infiniteScrollTotalCount) {
      return infiniteScrollTotalCount - data.length;
    }

    return 0;
  };

  isInfiniteLoadingEnabled = () => {
    return !!this.getUnloadedRowCount();
  };

  handleScroll = () => {
    const {
      infiniteScrollThreshold,
      infiniteScrollLoadMore,
      infiniteScrollPageSize,
      data
    } = this.props;

    const dataCount = data.length;
    const nextPage = Math.floor(dataCount / infiniteScrollPageSize) + 1;

    if (!this.requestedPages[nextPage]) {
      const targetRow = this.rowRefs[dataCount - infiniteScrollThreshold];

      const {
        top: innerTop,
        height: viewPortHeight
      } = this.innerRef.getBoundingClientRect();

      const { top: rowTop } = targetRow.getBoundingClientRect();

      if (viewPortHeight - rowTop + innerTop > 0) {
        this.requestedPages[nextPage] = true;

        infiniteScrollLoadMore(nextPage * infiniteScrollPageSize, last(data));
      }
    }
  };

  saveInnerRef = ref => {
    const { innerRef } = this.props;

    this.innerRef = ref;
    innerRef && innerRef(ref);
  };

  render() {
    const { columns } = this.state;
    const { checkboxRenderer } = this.props;
    const infiniteLoadingEnabled = this.isInfiniteLoadingEnabled();

    return (
      <div className="Sticky-React-Table" style={mainContainerStyle}>
        <div
          ref={this.saveInnerRef}
          className="Sticky-React-Table-inner"
          style={innerContainerStyle}
          onScroll={infiniteLoadingEnabled ? this.handleScroll : null}
        >
          {this.headerRenderer()}
          {this.bodyRenderer()}
        </div>

        <ColumnSwitcher
          {...{ checkboxRenderer, columns }}
          onChange={this.handleColumnVisibilityChange}
        />
      </div>
    );
  }
}
