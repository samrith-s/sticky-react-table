import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class EmailCellRenderer extends Component {
  render() {
    const { id, dataKey } = this.props;
    return (
      <div>
        <div>{id}</div>
        <div>{dataKey}</div>
      </div>
    );
  }
}

EmailCellRenderer.propTypes = {
  id: PropTypes.number,
  dataKey: PropTypes.string.isRequired
};
