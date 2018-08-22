import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { pick } from 'lodash';
import classNames from 'classnames';

import CheckboxCell from '../../CheckboxCell';

import { cellPropKeys } from '../../../constants';

import { getCellStyle } from '../../../util';

export default class Cell extends PureComponent {
  handleDragHandleRef = ref => {
    this.dragHandle = ref;
  };

  render() {
    const {
      cellData,
      style,
      isSticky,
      isLastSticky,
      renderer,
      onDragEnd,
      id,
      isChecked,
      onCheck,
      isCheckbox,
      className
    } = this.props;

    return (
      <div
        className={classNames(className, 'Sticky-React-Table--Row-Cell', {
          'Sticky-React-Table--is-Sticky--is-Last': isLastSticky
        })}
        style={getCellStyle(style, isSticky)}
        tabIndex={0}
      >
        {isCheckbox ? (
          <CheckboxCell
            id={id}
            renderer={renderer}
            onCheck={onCheck}
            isChecked={isChecked}
          />
        ) : (
          <Fragment>
            {renderer ? renderer(pick(this.props, cellPropKeys)) : cellData}
            <div
              className="Sticky-React-Table-Resize-Handler"
              draggable={true}
              onDragEnd={onDragEnd}
              ref={this.handleDragHandleRef}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

Cell.propTypes = {
  dataKey: PropTypes.string,
  cellData: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.bool,
    PropTypes.func,
    PropTypes.object
  ]),
  style: PropTypes.object.isRequired,
  isSticky: PropTypes.bool,
  isLastSticky: PropTypes.bool,
  renderer: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isChecked: PropTypes.bool.isRequired,
  isCheckbox: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired,
  className: PropTypes.string
};

Cell.defaultProps = {
  isCheckbox: false
};
