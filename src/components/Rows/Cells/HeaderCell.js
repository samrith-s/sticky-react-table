import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import classNames from 'classnames';

export default class HeaderCell extends PureComponent {
  handleDragHandleRef = ref => {
    this.dragHadle = ref;
  };

  handleSort = () => {
    this.props.onSort(omit(this.props, 'onSort'));
  }


  render() {
    const { title, style, isLastSticky, renderer, onDragEnd, onSort, isSortable, sortedColumn, dataKey } = this.props;
    const isSorted = sortedColumn && sortedColumn.dataKey === dataKey;
    const sortDir = sortedColumn ? sortedColumn.dir : '';

    return (
      <div
        className={classNames('React-Sticky-Table--Header-Cell', {
          'React-Sticky-Table--is-Last-Sticky': isLastSticky
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
        {(isSortable && isSorted) && <div className={"React-Sticky-Table-Sort-Icon"} >
          <i className={classNames('fas', {
            'fa-arrow-up': sortDir === 'ASC',
            'fa-arrow-down': sortDir === 'DESC'
          })} />
        </div>}
      </div>
    );
  }
}
