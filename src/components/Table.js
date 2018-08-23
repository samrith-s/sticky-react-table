import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { times, last } from 'lodash';

import { Row, HeaderRow } from './Rows';
import ColumnSwitcher from './ColumnSwitcher';

import { ColumnDisplayName, RendererType } from '../constants';
import Errors from './Errors';

import { sort } from '../util';

import {
  mainContainerStyle,
  innerContainerStyle
} from '../styles/container.styles';

export default class Table extends PureComponent {
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
    loadMoreTotalCount: PropTypes.number,
    loadMoreRows: PropTypes.func,
    loadMoreThreshold: PropTypes.number,
    loadMoreLoaderRowCount: PropTypes.number,
    loadMorePageSize: PropTypes.number,
    loadMoreCellRenderer: RendererType
  };

  static defaultProps = {
    rowSelection: true,
    idKey: 'id',
    loadMoreLoaderRowCount: 5,
    loadMorePageSize: 30,
    loadMoreThreshold: 50
  };

  constructor(props) {
    super(props);

    this.state.columns = this.extractColumns(props);
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
    const { sortedColumn } = this.state;
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
          className
        }}
        rowIndex={0}
        styleCalculator={this.getLeftStyle}
        stickyFunction={this.isLastSticky}
        onDragEnd={this.handleDragEnd}
        onSort={this.handleSort}
        onCheck={this.handleRowCheck}
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

  bodyRenderer = () => {
    const { data } = this.state;
    const {
      rowSelection,
      checkboxRenderer,
      idKey,
      rowClassName,
      rowRenderer: renderer,
      loadMoreLoaderRowCount,
      loadMoreCellRenderer
    } = this.props;

    const columns = this.getVisibleColumns();

    const getRows = (data, isLoaderRow) => {
      return data.map((rowData, index) => {
        const id = rowData[idKey];
        const isChecked = this.isRowSelected(id);
        const rowIndex = index + 1;

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
              loadMoreCellRenderer,
              isLoaderRow
            }}
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
      const loaderRowCount = Math.min(loadMoreLoaderRowCount, unloadedRowCount);

      // generate fake loader row data (we basically only need some distinct ids)
      const loaderRowsData = times(loaderRowCount, index => ({
        id: `sticky-react-loader-row-${index + 1}`
      }));

      return rows.concat(getRows(loaderRowsData, true));
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
    const { loadMoreRows, loadMoreTotalCount, data } = this.props;

    if (loadMoreRows && loadMoreTotalCount) {
      return loadMoreTotalCount - data.length;
    }

    return 0;
  };

  isInfiniteLoadingEnabled = () => {
    return this.getUnloadedRowCount();
  };

  handleScroll = ({ target }) => {
    const {
      loadMoreThreshold,
      loadMoreRows,
      loadMorePageSize,
      data
    } = this.props;

    if (this.isInfiniteLoadingEnabled()) {
      const scrollPercentage =
        (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;

      if (scrollPercentage > loadMoreThreshold) {
        const nextPage = data.length / loadMorePageSize + 1;

        if (!this.requestedPages[nextPage]) {
          this.requestedPages[nextPage] = true;

          loadMoreRows(nextPage * loadMorePageSize, last(data));
        }
      }
    }
  };

  render() {
    const { columns } = this.state;
    const { checkboxRenderer } = this.props;

    return (
      <div className="Sticky-React-Table" style={mainContainerStyle}>
        <div
          className="Sticky-React-Table-inner"
          style={innerContainerStyle}
          onScroll={this.handleScroll}
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
