import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilterItem from './FilterItem';

import { RendererType } from '../../constants';

import { renderElement } from '../../util';

export default class Filter extends Component {
  state = {
    visibility: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClose, true);
    document.addEventListener('keyup', this.handleClose, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClose, true);
    document.removeEventListener('keyup', this.handleClose, true);
  }

  toggleFilterVisibility = visibility => {
    this.setState(() => ({
      visibility
    }));
  };

  handleChange = e => {
    e.stopPropagation();
  };

  handleIconClick = e => {
    e.stopPropagation();
    if (this.state.visibility) {
      this.toggleFilterVisibility(false);
    } else {
      this.toggleFilterVisibility(true);
    }
  };

  handleClose = e => {
    if (this.state.visibility) {
      if (
        e.key === 'Escape' ||
        (this.icon &&
          this.menu &&
          e.target !== this.icon &&
          !this.menu.contains(e.target))
      ) {
        this.toggleFilterVisibility(false);
      }
    }
  };

  handleMenuRef = ref => {
    this.menu = ref;
  };

  handleIconRef = ref => {
    this.icon = ref;
  };

  isChecked = (dataKey, value) => {
    return this.props.filters[dataKey] && this.props.filters[dataKey][value];
  };

  render() {
    const { data, dataKey, filterRenderer, onFilterChange } = this.props;
    const { visibility } = this.state;

    const columnData = data.reduce((values, row) => {
      if (values[row[dataKey]]) {
        values[row[dataKey]].count++;
      } else {
        values[row[dataKey]] = {
          id: row.id,
          value: row[dataKey],
          count: 1
        };
      }
      return values;
    }, {});

    const headerFilters = Object.keys(columnData).map(value => (
      <FilterItem
        value={value}
        count={columnData[value].count}
        onChange={onFilterChange}
        dataKey={dataKey}
        key={value}
        isChecked={this.isChecked(dataKey, value)}
      />
    ));

    return (
      <div className="Sticky-React-Table--Header-Filter">
        <div
          className="Sticky-React-Table--Header-Filter-Icon"
          onClick={this.handleIconClick}
          ref={this.handleIconRef}
        >
          {' '}
          F
        </div>
        {visibility && (
          <div
            className="Sticky-React-Table--Header-Filter-Dropdown"
            ref={this.handleMenuRef}
          >
            {renderElement(
              filterRenderer,
              {
                ...this.props
              },
              headerFilters
            )}
          </div>
        )}
      </div>
    );
  }
}

Filter.propTypes = {
  data: PropTypes.array.isRequired,
  filters: PropTypes.object.isRequired,
  dataKey: PropTypes.string.isRequired,
  filterRenderer: RendererType,
  onFilterChange: PropTypes.func
};
