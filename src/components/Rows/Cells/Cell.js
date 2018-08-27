import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { pick } from 'lodash';
import classNames from 'classnames';

import CheckboxCell from '../../CheckboxCell';

import { cellPropKeys, RendererType } from '../../../constants';

import { getCellStyle, getClass, renderElement } from '../../../util';

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
      checkboxRenderer
    } = this.props;

    return (
      <div
        className={classNames(className, getClass('--Row-Cell'), {
          [getClass('--is-Sticky--is-Last')]: isLastSticky,
          [getClass('--Row-Cell-Checkbox')]: isCheckbox
        })}
        style={getCellStyle(style, isSticky)}
        tabIndex={0}
      >
        <div className={getClass('--Row-Cell-Content')}>
          {isCheckbox ? (
            <CheckboxCell
              {...{ id, onCheck, isChecked }}
              renderer={checkboxRenderer}
            />
          ) : (
            renderElement(renderer, pick(this.props, cellPropKeys), cellData)
          )}
        </div>

        <div
          className={getClass('-Resize-Handler')}
          draggable
          onDragEnd={onDragEnd}
          ref={this.handleDragHandleRef}
        />
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
  checkboxRenderer: RendererType
};

Cell.defaultProps = {
  isCheckbox: false
};
