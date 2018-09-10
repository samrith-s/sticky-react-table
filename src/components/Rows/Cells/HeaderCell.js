import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { pick } from 'lodash';
import classNames from 'classnames';

import CheckboxCell from '../../CheckboxCell';

import { headerCellPropKeys, RendererType } from '../../../constants';

import { getCellStyle, renderElement, stopPropagation } from '../../../util';
import Filter from '../../Filter';

export default class HeaderCell extends PureComponent {
  handleDragHandleRef = ref => {
    this.dragHadle = ref;
  };

  handleSort = () => {
    this.props.onSort(this.getRequiredProps());
  };

  onAutoResizeColumn = () => {
    this.props.onAutoResizeColumn(this.props.cellIndex);
  };

  getRequiredProps = () => pick(this.props, headerCellPropKeys);

  onHeaderDragOver = e => {
    stopPropagation(e);
    this.props.onHeaderDragOver(this.props.cellIndex);
  };

  onHeaderDragStart = e => {
    stopPropagation(e);
    this.props.onHeaderDragStart(this.props.cellIndex);
  };

  render() {
    const {
      title,
      style,
      renderer,
      onDragEnd,
      isSortable,
      sortedColumn,
      dataKey,
      isSticky,
      isLastSticky,
      id,
      checkedRows,
      onCheck,
      isCheckbox,
      isAllSelected,
      checkboxRenderer,
      filterRenderer,
      filterTrigger,
      data,
      onHeaderDragEnd
    } = this.props;
    const isSorted = sortedColumn && sortedColumn.dataKey === dataKey;
    const sortDir = sortedColumn ? sortedColumn.dir : '';

    const { width, ...cellStyle } = style;
    return (
      <div
        className={classNames('Sticky-React-Table--Header-Cell-Wrapper', {
          'Sticky-React-Table--is-Sticky--is-Last': isLastSticky,
          'Sticky-React-Table--Header-Cell-Checkbox-Wrapper': isCheckbox
        })}
        style={getCellStyle(cellStyle, isSticky, !isCheckbox)}
        draggable
        onDragOver={this.onHeaderDragOver}
        onDragEnter={stopPropagation}
        onDragStart={this.onHeaderDragStart}
        onDragEnd={onHeaderDragEnd}
      >
        <div
          className={classNames('Sticky-React-Table--Header-Cell', {
            'Sticky-React-Table--Header-Cell-Checkbox': isCheckbox
          })}
          style={{ width }}
        >
          {isCheckbox ? (
            <CheckboxCell
              id={id}
              renderer={checkboxRenderer}
              checkedRows={checkedRows}
              onCheck={onCheck}
              isChecked={isAllSelected}
            />
          ) : (
            <Fragment>
              <span onClick={this.handleSort}>
                {renderElement(renderer, this.getRequiredProps(), title)}
              </span>
              {filterRenderer && (
                <Filter
                  data={data}
                  dataKey={dataKey}
                  filterRenderer={filterRenderer}
                  filterTrigger={filterTrigger}
                />
              )}
              <div
                className="Sticky-React-Table-Resize-Handler"
                draggable={true}
                onDragEnd={onDragEnd}
                ref={this.handleDragHandleRef}
                onDoubleClick={this.onAutoResizeColumn}
              />

              {isSortable &&
                isSorted && (
                  <div className="Sticky-React-Table-Sort-Icon">
                    {sortDir === 'ASC' ? (
                      <Fragment>&uarr;</Fragment>
                    ) : (
                      <Fragment>&darr;</Fragment>
                    )}
                  </div>
                )}
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

HeaderCell.defaultProps = {
  isSortable: true
};

HeaderCell.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object.isRequired,
  isSticky: PropTypes.bool,
  isLastSticky: PropTypes.bool,
  renderer: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  isSortable: PropTypes.bool,
  sortedColumn: PropTypes.object,
  dataKey: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  checkedRows: PropTypes.array.isRequired,
  onCheck: PropTypes.func.isRequired,
  isCheckbox: PropTypes.bool.isRequired,
  isAllSelected: PropTypes.bool.isRequired,
  checkboxRenderer: RendererType,
  filterRenderer: RendererType,
  filterTrigger: RendererType,
  data: PropTypes.array.isRequired,
  onHeaderDragEnd: PropTypes.func.isRequired,
  onHeaderDragStart: PropTypes.func.isRequired,
  onHeaderDragOver: PropTypes.func.isRequired,
  onAutoResizeColumn: PropTypes.func.isRequired,
  cellIndex: PropTypes.number.isRequired
};

HeaderCell.defaultProps = {
  isCheckbox: false,
  isSortable: true
};
