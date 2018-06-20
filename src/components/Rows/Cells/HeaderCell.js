import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { omit } from 'lodash';
import classNames from 'classnames';

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
      isSticky
    } = this.props;
    const isSorted = sortedColumn && sortedColumn.dataKey === dataKey;
    const sortDir = sortedColumn ? sortedColumn.dir : '';

    return (
      <div
        className={classNames('React-Sticky-Table--Header-Cell', {
          'React-Sticky-Table--is-Sticky': isSticky,
          'React-Sticky-Table--is-Sticky--is-Last': isLastSticky
        })}
        style={style}
        onClick={this.handleSort}
      >
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
  dataKey: PropTypes.string.isRequired
};
