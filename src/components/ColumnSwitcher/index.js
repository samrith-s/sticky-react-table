import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
    const { columns, onChange } = this.props;

    return (
      <div className="Sticky-React-Table--Header-Column-Switcher">
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
              .map(({ title, dataKey, visible }) => {
                return (
                  <div
                    className="Sticky-React-Table--Header-Column-Switcher-Item"
                    key={title}
                  >
                    <label htmlFor={dataKey}>
                      <input
                        type="checkbox"
                        id={dataKey}
                        name="column"
                        onChange={onChange}
                        checked={visible}
                      />
                      {title}
                    </label>
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
  onChange: PropTypes.func.isRequired
};

export default ColumnSwitcher;
