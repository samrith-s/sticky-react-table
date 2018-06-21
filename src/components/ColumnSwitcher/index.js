import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class ColumnSwitcher extends Component {
  state = {
    visible: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, true);
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

  handleOutsideClick = e => {
    if (
      this.icon &&
      this.menu &&
      e.target !== this.icon &&
      !this.menu.contains(e.target)
    ) {
      this.toggleDropdownVisibility(false);
    }
  };

  render() {
    const { columns, onChange } = this.props;

    return (
      <div className="React-Sticky-Table--Header-Column-Switcher-Container">
        <div
          className="React-Sticky-Table--Header-Column-Switcher-Container-Icon"
          onClick={this.handleIconClick}
          ref={this.handleIconRef}
        >
          :
        </div>
        <div
          className={classNames(
            'React-Sticky-Table--Header-Column-Switcher-Container-Dropdown',
            {
              'React-Sticky-Table--Hide': !this.state.visible
            }
          )}
          ref={this.handleMenuRef}
        >
          {columns.map(({ title, dataKey, visible }) => {
            return (
              <div className="dropdown-menu-item" key={title}>
                <input
                  type="checkbox"
                  id={dataKey}
                  name="column"
                  onChange={onChange}
                  checked={visible}
                />
                <label htmlFor={dataKey}>{title}</label>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

ColumnSwitcher.propTypes = {
  columns: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default ColumnSwitcher;
