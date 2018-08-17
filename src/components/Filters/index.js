import React, { Component } from 'react';

class Filter extends Component {
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
    debugger;
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

  render() {
    const { columnData } = this.props;
    const { visibility } = this.state;
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
            {Object.keys(columnData).map(value => {
              return (
                <div
                  className="Sticky-React-Table--Header-Filter-Dropdown-Item"
                  key={value}
                >
                  <label htmlFor={value}>
                    <input
                      type="checkbox"
                      id={value}
                      name="column"
                      onChange={this.handleChange}
                    />
                    <span className="Sticky-React-Table--Header-Filter-Dropdown-Row">
                      <span className="Sticky-React-Table--Header-Filter-Dropdown-Value">
                        {value}
                      </span>
                      <span className="Sticky-React-Table--Header-Filter-Dropdown-Count">
                        {columnData[value].count}
                      </span>
                    </span>
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

export default Filter;
