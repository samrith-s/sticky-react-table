import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { RendererType } from '../../constants';

import { renderElement } from '../../util';

export default class ColumnSwitcherItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    columnIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    isChecked: PropTypes.bool.isRequired,
    checkboxRenderer: RendererType
  };

  handleChange = () => {
    const { onChange, dataKey, columnIndex } = this.props;
    onChange(columnIndex, dataKey);
  };

  render() {
    const { dataKey, isChecked, title, checkboxRenderer } = this.props;

    const onChange = this.handleChange;

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
      <div className="Sticky-React-Table--Header-Column-Switcher-Item">
        {renderElement(
          checkboxRenderer,
          {
            checkbox,
            id: dataKey,
            dataKey,
            onChange,
            isChecked,
            title,
            type: 'columnSwitcher'
          },
          checkbox
        )}
      </div>
    );
  }
}
