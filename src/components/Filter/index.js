import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { renderElement } from '../../util';
import {
  filtersStyles,
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
          !this.menu.contains(e.target))
      ) {
        this.toggleDropdownVisibility(false);
      }
    }
  };

  render() {
    const { filterRenderer, data, dataKey } = this.props;
    return (
      <span>
        {filterRenderer ? (
          <div
            className="Sticky-React-Table--Header-Column-Filter"
            style={filtersStyles}
          >
            <div
              className="Sticky-React-Table--Header-Column-Filter-Icon"
              onClick={this.handleIconClick}
              ref={this.handleIconRef}
              style={filterIconStyles}
            >
              :
            </div>
            {this.state.visible && (
              <div
                className="Sticky-React-Table--Header-Column-Filter-Dropdown"
                ref={this.handleMenuRef}
                style={filterDropdownStyles}
              >
                {renderElement(filterRenderer, { data, dataKey }, null)}
              </div>
            )}
          </div>
        ) : null}
      </span>
    );
  }
}

Filter.propTypes = {
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  filterRenderer: RendererType
};
