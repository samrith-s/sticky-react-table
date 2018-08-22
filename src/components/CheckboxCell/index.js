import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { pick } from 'lodash';

import { cellPropKeys } from '../../constants';

import { renderElement } from '../../util';

class CheckboxCell extends Component {
  handleCellCheck = () => {
    this.props.onCheck(this.props.id);
  };

  render() {
    const { id, renderer, isChecked } = this.props;

    return renderElement(
      renderer,
      pick(this.props, cellPropKeys),
      <div>
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={this.handleCellCheck}
        />
      </div>
    );
  }
}
CheckboxCell.propTypes = {
  onCheck: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isChecked: PropTypes.bool.isRequired,
  renderer: PropTypes.func
};

export default CheckboxCell;
