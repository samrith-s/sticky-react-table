import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HeaderCell extends Component {
  static propTypes = {
    title: PropTypes.string
  };

  render() {
    const { title } = this.props;

    return (
      <div>
        <strong>{title}</strong>
      </div>
    );
  }
}
