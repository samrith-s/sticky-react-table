import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { omit } from 'lodash';
import classNames from 'classnames';
import CheckboxCell from '../../CheckboxCell';

export default class HeaderCell extends PureComponent {
  handleDragHandleRef = ref => {
    this.dragHadle = ref;
  };

  handleSort = () => {
    this.props.onSort(omit(this.props, 'onSort'));
  };

  render() {
    const {
      title,
      style,
      isLastSticky,
      renderer,
      onDragEnd,
      isSortable,
      sortedColumn,
      dataKey,
      isSticky,
      id,
      checkedRows,
      onCheck,
      isCheckbox,
      isAllSelected
    } = this.props;
    const isSorted = sortedColumn && sortedColumn.dataKey === dataKey;
    const sortDir = sortedColumn ? sortedColumn.dir : '';

    return (
      <div
        className={classNames('React-Sticky-Table--Header-Cell', {
          'React-Sticky-Table--is-Sticky': isSticky,
          'React-Sticky-Table--is-Sticky--is-Last': isLastSticky,
          'React-Sticky-Table--Header-Cell-Checkbox': isCheckbox
        })}
        style={style}
        onClick={this.handleSort}
      >
        {isCheckbox ? (
          <CheckboxCell
            id={id}
            renderer={renderer}
            checkedRows={checkedRows}
            onCheck={onCheck}
            isChecked={isAllSelected}
          />
        ) : (
          <Fragment>
            {renderer ? renderer(omit(this.props, 'renderer')) : title}
            <div
              className="React-Sticky-Table-Resize-Handler"
              draggable={true}
              onDragEnd={onDragEnd}
              ref={this.handleDragHandleRef}
            />
            {isSortable &&
              isSorted && (
                <div className="React-Sticky-Table-Sort-Icon">
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
    );
  }
}

HeaderCell.defaultProps = {
  isSortable: true
};

HeaderCell.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object.isRequired,
  isSticky: PropTypes.bool.isRequired,
  isLastSticky: PropTypes.bool.isRequired,
  renderer: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired,
  onSort: PropTypes.func,
  isSortable: PropTypes.bool,
  sortedColumn: PropTypes.object,
  dataKey: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([(PropTypes.number, PropTypes.string)]).isRequired,
  checkedRows: PropTypes.array.isRequired,
  onCheck: PropTypes.func.isRequired,
  isCheckbox: PropTypes.bool.isRequired,
  isAllSelected: PropTypes.bool.isRequired
};

HeaderCell.defaultProps = {
  isCheckbox: false
};
