import PropTypes from 'prop-types';
import React, { PureComponent, Fragment } from 'react';
import { pick } from 'lodash';
import classNames from 'classnames';

import CheckboxCell from '../../CheckboxCell';

import { cellPropKeys, RendererType } from '../../../constants';

import { getCellStyle, renderElement } from '../../../util';

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
      className,
      checkboxRenderer,
      cellIndex
    } = this.props;

    const { width, ...cellStyle } = style;

    return (
      <div
        className={classNames(
          className,
          `Sticky-React-Table--Row-Cell Sticky-React-Table--Row-Cell-${cellIndex}`,
          {
            'Sticky-React-Table--is-Sticky--is-Last': isLastSticky,
            'Sticky-React-Table--Row-Cell-Checkbox': isCheckbox
          }
        )}
        style={getCellStyle(cellStyle, isSticky)}
        tabIndex={0}
      >
        <div style={{ width }}>
          {isCheckbox ? (
            <CheckboxCell
              id={id}
              renderer={checkboxRenderer}
              onCheck={onCheck}
              isChecked={isChecked}
            />
          ) : (
            <Fragment>
              {renderElement(
                renderer,
                pick(this.props, cellPropKeys),
                cellData
              )}

              <div
                className="Sticky-React-Table-Resize-Handler"
                draggable={true}
                onDragEnd={onDragEnd}
                ref={this.handleDragHandleRef}
              />
            </Fragment>
          )}
        </div>
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
  className: PropTypes.string,
  checkboxRenderer: RendererType,
  cellIndex: PropTypes.number.isRequired
};

Cell.defaultProps = {
  isCheckbox: false
};
