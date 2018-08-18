import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { pick } from 'lodash';

import { cellPropKeys } from '../../constants';

class CheckboxCell extends Component {
  handleCellCheck = () => {
    this.props.onCheck(this.props.id);
  };

  render() {
    const { id, renderer, isChecked } = this.props;

    return renderer ? (
      renderer(pick(this.props, cellPropKeys))
    ) : (
      <div className="">
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
  id: PropTypes.oneOfType([(PropTypes.number, PropTypes.string)]).isRequired,
  isChecked: PropTypes.bool.isRequired,
  renderer: PropTypes.func
};

export default CheckboxCell;
