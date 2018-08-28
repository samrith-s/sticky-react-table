import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { filterStyles } from '../../styles/filter.styles';

export default class FilterItem extends Component {
  handleChange = e => {
    e.stopPropagation();
    const { dataKey, value, count } = this.props;
    this.props.onChange(dataKey, value, count);
  };

  render() {
    const { value, count, isChecked } = this.props;
    return (
      <div
        className="Sticky-React-Table--Header-Filter-Dropdown-Item"
        style={filterStyles}
      >
        <label htmlFor={value}>
          <input
            type="checkbox"
            id={value}
            name="column"
            onClick={this.handleChange}
            checked={isChecked}
          />

          <span className="Sticky-React-Table--Header-Filter-Dropdown-Value">
            {value}
          </span>
        </label>

        <span className="Sticky-React-Table--Header-Filter-Dropdown-Count">
          {count}
        </span>
      </div>
    );
  }
}

FilterItem.propTypes = {
  value: PropTypes.string.isRequired,
  dataKey: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};
