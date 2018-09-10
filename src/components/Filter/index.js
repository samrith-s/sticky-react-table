import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { renderElement } from '../../util';
import {
  filterDropdownStyles,
  filterIconStyles
} from '../../styles/filter.styles';
import { RendererType } from '../../constants';

export default class Filter extends Component {
  state = {
    visible: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClose, true);
    document.addEventListener('keyup', this.handleClose, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClose, true);
    document.removeEventListener('keyup', this.handleClose, true);
  }

  toggleDropdownVisibility = visible => {
    this.setState(() => ({
      visible
    }));
  };

  handleMenuRef = ref => {
    this.menu = ref;
  };

  handleIconRef = ref => {
    this.icon = ref;
  };

  handleIconClick = () => {
    if (this.state.visible) {
      this.toggleDropdownVisibility(false);
    } else {
      this.toggleDropdownVisibility(true);
    }
  };

  handleClose = e => {
    if (this.state.visible) {
      if (
        e.key === 'Escape' ||
        (this.icon &&
          this.menu &&
          e.target !== this.icon &&
          !this.icon.contains(e.target) &&
          !this.menu.contains(e.target))
      ) {
        this.toggleDropdownVisibility(false);
      }
    }
  };

  getFilterAlignment = () => {
    const { filterAlignment } = this.props;

    if (filterAlignment !== 'left' && filterAlignment !== 'right') {
      return 'left';
    }

    return filterAlignment;
  };

  render() {
    const { data, dataKey, filterRenderer, filterTrigger } = this.props;
    const { visible } = this.state;
    return (
      <Fragment>
        <span
          className="Sticky-React-Table--Header-Column-Filter-Icon"
          onClick={this.handleIconClick}
          ref={this.handleIconRef}
          style={filterIconStyles}
        >
          {renderElement(filterTrigger, {}, ':')}
        </span>
        {visible && (
          <div
            className="Sticky-React-Table--Header-Column-Filter-Dropdown"
            ref={this.handleMenuRef}
            style={filterDropdownStyles(this.getFilterAlignment())}
          >
            {renderElement(filterRenderer, { data, dataKey }, null)}
          </div>
        )}
      </Fragment>
    );
  }
}

Filter.propTypes = {
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  filterRenderer: RendererType,
  filterTrigger: RendererType,
  filterAlignment: PropTypes.string
};
