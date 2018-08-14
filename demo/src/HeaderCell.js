import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HeaderCell extends Component {
  static propTypes = {
    title: PropTypes.string
  };
  render() {
    const { title } = this.props;
    return <div>{title}</div>;
  }
}

export default HeaderCell;
