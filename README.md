# Sticky React Table

[![Travis](https://img.shields.io/travis/samrith-s/sticky-react-table/master.svg)][build]
[![npm package](https://img.shields.io/npm/v/sticky-react-table.svg)][npm]
[![GitHub issues](https://img.shields.io/github/issues/samrith-s/sticky-react-table.svg)][issues]
[![GitHub stars](https://img.shields.io/github/stars/samrith-s/sticky-react-table.svg)][stars]
[![GitHub license](https://img.shields.io/github/license/samrith-s/sticky-react-table.svg)][license]

Many large-scale applications require the use of tables somewhere, if not everywhere. Many a times the requirements for these tables are quite complex and difficult to manage. **Sticky React Table** aims to solve all of these problems for React developers, with a host of features including customizable cells, rows, and headers, column switching, column filtering, sorting, virtualization, column resizing, etc. All of that, provided in a declarative manner, and built ground-up, especially for React!

The package is still under development. We are working actively to get this package to a stable release as soon as possible. Please do not use this package in any production application.

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Important Properties](#important-properties)
  - [Table](#table)
  - [Column](#column)
  - [Cell Props][cell-props]
  - [Row Props][row-props]
- [Gotchas](#gotchas)
- [Contributing](#contributing)
- [Issues](#issues)
- [Roadmap](#roadmap)
- [License](#license)

<a name="getting-started"></a>

## Getting Started

Installing Sticky React Table is as simple as using your favourite package manager (ex. `yarn` or `npm`).

For NPM:

```
npm install sticky-react-table
```

For Yarn:

```
yarn add sticky-react-table
```

<a name="basic-usage"></a>

## Basic Usage

The `sticky-react-table` package exposes 2 major components: `Table` and `Column`.

Consider a sample data set:

```json
[
  {
    "name": "John Doe",
    "age": 24,
    "location": "Chicago",
    "occupation": "Research Analyst"
  },
  {
    "name": "Jane Delaney",
    "age": 22,
    "location": "London",
    "occupation": "Software Developer"
  },
  {
    "name": "Nishant Singh",
    "age": 28,
    "location": "Mumbai",
    "occupation": "Business Developer"
  }
]
```

The simplest implementation of the above data as an Sticky React Table would be like so:

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Column } from 'sticky-react-table';

import data from './data.json';

class MyTable extends Component {
  render() {
    return (
      <Table data={data}>
        <Column title="Name" width={200} dataKey="name" />
        <Column title="Age" width={50} dataKey="age" />
        <Column title="Occupation" width={200} dataKey="occupation" />
        <Column title="Location" width={150} dataKey="location" />
        <Column title="Top Skill" width={150} dataKey="topSkill" />
      </Table>
    );
  }
}

const rootElement = document.getElementById('root');
ReactDOM.render(<MyTable />, rootElement);
```

From here on, you can customize the cell, row or header renderers, add custom classes, style it however you need.

If you use SASS as a pre-processor, two default themes are provided: light and dark. To use the themes, simply import the relevant theme.

- Light Theme: `sticky-react-table/lib/themes/light.scss`
- Dark Theme: `sticky-react-table/lib/themes/dark.scss`

---

<a name="important-properties"></a>

## Important Properties

Sticky React Table supports a host of properties which allow you to completely customize the look and feel of the table. You can find the properties supported by the two primary components exposed by the package.

<a name="table"></a>

### Table

#### Properties:

| Property                     | Type                 | Default     | Description                                                         |
| ---------------------------- | -------------------- | ----------- | ------------------------------------------------------------------- |
| children                     | `Column`             | `undefined` | The `Column` component. It does not accept any other children.      |
| fixed                        | `Number`             | `undefined` | The number of fixed columns in the table.                           |
| rowSelection                 | `Bool`               | `true`      | This property determines whether checkbox column is rendered.       |
| idKey                        | `String`             | `id`        | A key used to uniquely identify data.                               |
| rowClassName                 | `String`             | `undefined` | Custom classes for a row.                                           |
| headerClassName              | `String`             | `undefined` | Custom classes for the header row.                                  |
| selectedRows                 | `Array`              | `undefined` | An array of ids to make the table a controlled component.           |
| infiniteScrollTotalCount     | `Number`             | `undefined` | Total number of rows which can be loaded using infinite loader.     |
| infiniteScrollLoadMore       | `Function`           | `undefined` | Invoked when a new page is requested when using infinite loader.    |
| infiniteScrollThreshold      | `Number`             | `10`        | The number of rows before the end of the table to trigger a call.   |
| infiniteScrollLoaderRowCount | `Number`             | `5`         | The number of additional rows to display at the bottom for loading. |
| infiniteScrollPageSize       | `Number`             | `30`        | A number of rows loaded with each portion.                          |
| infiniteScrollCellRenderer   | `Node` or `Function` | `undefined` | Custom content to display within cells of additional loader rows.   |

#### Callbacks:

| Name             | Description                          | Parameters                                                |
| ---------------- | ------------------------------------ | --------------------------------------------------------- |
| onSort           | Pass a custom sorting functionality. | Array of column data                                      |
| onRowCheck       | Handle checking of a row.            | Id of the checked row or `"all"` if all rows are checked. |
| checkboxRenderer | Custom renderer for checkbox column. | [Cell Props][cell-props]                                  |
| rowRenderer      | Custom row renderer                  | [Row Props][row-props]                                    |
| ref              | Get ref of inner component.          | Reference to inner component                              |

# <a name="null"></a>

<a name="column"></a>

### Column

#### Properties:

| Property        | Type                | Default     | Description                                                               |
| --------------- | ------------------- | ----------- | ------------------------------------------------------------------------- |
| dataKey         | `String`            | `undefined` | The data key for the value to be rendered into the cell                   |
| title           | `String`            | `undefined` | The title to be displayed in the header if no renderer is specified.      |
| width           | `Number`            | `0`         | The absolute width of the column.                                         |
| className       | `Array` or `String` | `undefined` | A custom class for the cell.                                              |
| alwaysVisible   | `Bool`              | `false`     | Defines whether the column should always be visible.                      |
| filterAlignment | `String`            | `left`      | Whether the filter should be aligned to the left or right of header cell. |

<a name="callbacks"></a>

#### Callbacks:

| Name           | Description                                                             | Parameters                   |
| -------------- | ----------------------------------------------------------------------- | ---------------------------- |
| cellRenderer   | A custom cell renderer to modify the default rendering.                 | [Cell Props][cell-props]     |
| headerRenderer | A custom header cell renderer to modify the default rendering.          | [Cell Props][cell-props]     |
| filterRenderer | A custom header filter renderer to add column filters.                  | [Filter Props][filter-props] |
| filterTrigger  | A custom header filter trigger renderer for showing the column filters. | None                         |

# <a name="null"></a>

<a name="cell-props"></a>

### Cell Props

The cell props allow you to access the data for the entire row, and some additional information about the cell. This particularly helps in customizing the cell, based on the information or the data for that row.

Every custom render function you use across the table, ex. `headerRenderer` and `cellRenderer`, get these props as the parameters of the renderer.

```js
propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rowData: PropTypes.object,
  cellData: PropTypes.any,
  isChecked: PropTypes.bool
  isCheckbox: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string, // Only available in headerRenderer
  isAllSelected: PropTypes.bool // Only available in headerRenderer
}
```

# <a name="null"></a>

<a name="filter-props"></a>

### Filter Props

The filter props allows you to access the data for the table and the dataKey of a column. This helps in creating a custom filters in any column, based on the data of the table.

```js
propTypes = {
  data: PropTypes.array,
  dataKey: PropTypes.string
};
```

# <a name="null"></a>

<a name="row-props"></a>

### Row Props

The row props allow you to access the data for the row, and some additional methods to help you render the defaults. Only the `rowRenderer` function gets access to row props.

```js
propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  rowIndex: PropTypes.number,
  rowData: PropTypes.object,
  columns: PropTypes.array,
  isChecked: PropTypes.bool,
  renderColumns: PropTypes.func,
  defaultRowRenderer: PropTypes.func
}
```

---

## Gotchas

<a name="gotchas"></a>

- While using `headerRenderer`, always render an inline element if you have either sorting or column filters in the cell. Otherwise the alignment will break.

<a name="contributing"></a>

## Contributing

Since we are still developing and this is a fairly large project, we would ❤️ contributions! We are looking for people who echo our sentiments and share the same idea about Sticky React Table.

Check out the [CONTRIBUTING.md][contributing] file for details.

<a name="issues"></a>

## Issues

For any issues or queries you might have about the table, please feel free to create one in the [issues section][issues].

<a name="roadmap"></a>

## Roadmap

We started developing Sticky React Table due to a lot of issues we faced while implementing tables in our application, with React. Leading up to `1.0.0`, we plan on supporting the following features:

- ✅ Fixed Columns
- ✅ Fixed Header
- ✅ Column Resizing
- ✅ Column Switching
- ✅ Column Reordering
- ✅ Column Sorting
- ✅ Column Filtering
- ✅ Cell Renderer
- ✅ Row Renderer
- ✅ Header Renderer
- ✅ Row Selection
- ✅ Infinite Scrolling
- ✅ Column resizing based on length of value (a la Excel)
- ❌ Keyboard Navigation (as per Gmail)
- ❌ More events (scroll, keyup, keydown, keypress, etc.)

In the future, we plan on implementing the following:

- Virtualization
- Better support for custom classes

Features at no point will we build:

- Row resizing or native subrow rendering (both of these can be achieved using a custom row renderer)

<a name="license"></a>

## License

This project is under the [MIT License][license-link]. You can checkout the [LICENSE][license] file for info.

Copyright &copy; 2018.

[build]: https://travis-ci.org/samrith-s/sticky-react-table
[npm]: https://www.npmjs.org/package/sticky-react-table
[issues]: https://github.com/samrith-s/sticky-react-table/issues
[stars]: https://github.com/samrith-s/sticky-react-table/stargazers
[contributing]: https://github.com/samrith-s/sticky-react-table/blob/master/CONTRIBUTING.md
[issues]: https://github.com/samrith-s/sticky-react-table/issues
[license]: https://github.com/samrith-s/sticky-react-table/blob/master/LICENSE
[license-link]: https://opensource.org/licenses/MIT
[cell-props]: #cell-props
[row-props]: #row-props
[filter-props]: #filter-props
