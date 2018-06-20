import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import classNames from 'classnames';

import { dragHandlerSizing } from '../../../Utils';

export default class Cell extends PureComponent {
  handleDragHandleRef = ref => {
    this.dragHandle = ref;
  };

  render() {
    const { cellData, style, isLastSticky, renderer, onDragEnd } = this.props;

    return (
      <div
        className={classNames('React-Sticky-Table--Row-Cell', {
          'React-Sticky-Table--is-Last-Sticky': isLastSticky
        })}
        style={style}
      >
        {renderer ? renderer(omit(this.props, 'renderer')) : cellData}
        <div
          className="React-Sticky-Table-Resize-Handler"
          draggable={true}
          onDragEnd={onDragEnd}
          ref={this.handleDragHandleRef}
        />
      </div>
    );
  }
}
