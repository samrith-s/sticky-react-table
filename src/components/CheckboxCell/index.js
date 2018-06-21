import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CheckboxCell extends Component {
  handleCellCheck = () => {
    this.props.onCheck(this.props.id);
  };

  render() {
    const { id, renderer, isChecked } = this.props;

    return renderer ? (
      renderer(this.props)
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
