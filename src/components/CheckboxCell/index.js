import React, { Component } from 'react';

class CheckboxCell extends Component {
  handleCellCheck = () => {
    this.props.onCheck(this.props.id);
  };

  render() {
    const { id, renderer, checkedRows } = this.props;
    const isChecked = checkedRows.find(rowId => rowId === id);

    return renderer ? (
      renderer(this.props)
    ) : (
      <div className="React-Sticky-Table--Row-Cell-Checkbox">
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

export default CheckboxCell;
