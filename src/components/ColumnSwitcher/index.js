import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { columnSwitcherStyle } from '../../styles/column.styles';
import { RendererType } from '../../constants';

import { renderElement } from '../../util';

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

  render() {
    const { columns, onChange, checkboxRenderer } = this.props;

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
            {columns
              .filter(({ isCheckbox }) => !isCheckbox)
              .map(({ title, dataKey, visible: isChecked }, index) => {
                const checkbox = (
                  <label htmlFor={dataKey}>
                    <input
                      type="checkbox"
                      id={dataKey}
                      name="column"
                      onChange={onChange}
                      checked={isChecked}
                    />
                    {title}
                  </label>
                );

                return (
                  <div
                    className="Sticky-React-Table--Header-Column-Switcher-Item"
                    key={title || dataKey || index}
                  >
                    {renderElement(checkboxRenderer, {
                      checkbox,
                      id: dataKey,
                      dataKey,
                      onChange,
                      isChecked,
                      type: 'columnSwitcher'
                    })}
                  </div>
                );
              })}
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
