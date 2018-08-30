import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FilterCell extends Component {
  render() {
    const { data, dataKey } = this.props;
    return (
      <span>
        {data.slice(0, 10).map((row, ind) => {
          return <span key={ind}>{row[dataKey]}</span>;
        })}
      </span>
    );
  }
}

FilterCell.propTypes = {
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired
};
