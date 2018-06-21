import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

class ColumnSwitcher extends Component {
  state = {
    visible: false
  };

  toggleDropdownVisibility = () => {
    this.setState(prevState => ({
      visible: !prevState.visible
    }));
  };

  render() {
    const { columns, onChange } = this.props;

    return (
      <div className="React-Sticky-Table--Header-Column-Switcher-Container">
        <div
          className="React-Sticky-Table--Header-Column-Switcher-Container-Icon"
          onClick={this.toggleDropdownVisibility}
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
