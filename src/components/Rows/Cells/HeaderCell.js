import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { omit } from 'lodash';
import classNames from 'classnames';

export default class HeaderCell extends PureComponent {
  handleDragHandleRef = ref => {
    this.dragHadle = ref;
  };

  render() {
    const {
      title,
      style,
      isSticky,
      isLastSticky,
      renderer,
      onDragEnd
    } = this.props;

    return (
      <div
        className={classNames('React-Sticky-Table--Header-Cell', {
          'React-Sticky-Table--is-Sticky': isSticky,
          'React-Sticky-Table--is-Sticky--is-Last': isLastSticky
        })}
        style={style}
      >
        {renderer ? renderer(omit(this.props, 'renderer')) : title}
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

HeaderCell.propTypes = {
  title: PropTypes.string,
  style: PropTypes.object.isRequired,
  isSticky: PropTypes.bool.isRequired,
  isLastSticky: PropTypes.bool.isRequired,
  renderer: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired
};
