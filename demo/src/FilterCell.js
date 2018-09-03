import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FilterCell extends Component {
  render() {
    const { data, dataKey } = this.props;
    return (
      <div>
        {data.slice(0, 10).map((row, ind) => {
          return <span key={ind}>{row[dataKey]}</span>;
        })}
      </div>
    );
  }
}

FilterCell.propTypes = {
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired
};
