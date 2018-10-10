import PropTypes from 'prop-types';
import React, { Component } from 'react';
import memoize from 'memoize-one';

import ColumnSwitcherItem from './ColumnSwitcherItem';

import { columnSwitcherStyle } from '../../styles/column.styles';
import { RendererType } from '../../constants';

class ColumnSwitcher extends Component {
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

  getSwitchableColumns = memoize(columns =>
    columns
      .map((column, seq) => ({ ...column, seq }))
      .filter(this.isColumnSwitchable)
  );

  isColumnSwitchable = column =>
    !column.isCheckbox &&
    !column.alwaysVisible &&
    column.dataKey &&
    column.title;

  render() {
    const { onChange, checkboxRenderer, columns } = this.props;
    const switchableColumns = this.getSwitchableColumns(columns);

    return (
      <div
        className="Sticky-React-Table--Header-Column-Switcher"
        style={columnSwitcherStyle}
      >
        <div
          className="Sticky-React-Table--Header-Column-Switcher-Icon"
          onClick={this.handleIconClick}
          ref={this.handleIconRef}
        >
          :
        </div>

        {this.state.visible && (
          <div
            className="Sticky-React-Table--Header-Column-Switcher-Dropdown"
            ref={this.handleMenuRef}
          >
            {switchableColumns.map(
              ({ title, dataKey, visible: isChecked, seq }) => (
                <ColumnSwitcherItem
                  key={dataKey}
                  columnIndex={seq}
                  {...{
                    isChecked,
                    title,
                    dataKey,
                    onChange,
                    checkboxRenderer
                  }}
                />
              )
            )}
          </div>
        )}
      </div>
    );
  }
}

ColumnSwitcher.propTypes = {
  columns: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  checkboxRenderer: RendererType
};

export default ColumnSwitcher;
