# Sticky React Table

[![Travis](https://img.shields.io/travis/samrith-s/sticky-react-table/master.svg)][build]
[![npm package](https://img.shields.io/npm/v/sticky-react-table.svg)][npm]
[![GitHub issues](https://img.shields.io/github/issues/samrith-s/sticky-react-table.svg)][issues]
[![GitHub stars](https://img.shields.io/github/stars/samrith-s/sticky-react-table.svg)][stars]
[![GitHub license](https://img.shields.io/github/license/samrith-s/sticky-react-table.svg)][license]

Many large-scale applications require the use of tables somewhere, if not everywhere. Many a times the requirements for these tables are quite complex and difficult to manage. **Sticky React Table** aims to solve all of these problems for React developers, with a host of features including customizable cells, rows, and headers, column switching, column filtering, sorting, virtualization, column resizing, etc. All of that, provided in a declarative manner, and built ground-up, especially for React!

The package is still under development. We are working actively to get this package to a stable release as soon as possible. Please do not use this package in any production application.

### Todo: Complete README by 19/08/2018

## Table of Contents

- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Properties](#properties)
  - [Table](#table)
  - [Column](#column)

## Getting Started

Installing SRT is as simple as using your favourite package manager (ex. `yarn` or `npm`).

For NPM:

```
npm install sticky-react-table
```

For Yarn:

```
yarn add sticky-react-table
```

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

The simplest implementation of the above data as an SRT would be like so:

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Table, Column } from 'sticky-react-table';
import 'sticky-react-table/lib/sticky-react-table.css'; // Important!

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

**Note: You need to import the default stylesheet provided for the stickiness to work as expected. Going forward, the component will be updated such that requiring the stylesheet won't be mandatory.**

## Properties

SRT supports a host of properties which allow you to completely customize the look and feel of the table. You can find the properties supported by the two primary components exposed by the package.

### Table

#### Properties

| Property        | Type     | Default     | Description                                                         | Required |
| --------------- | -------- | ----------- | ------------------------------------------------------------------- | -------- |
| data            | `Array`  | `undefined` | The array of data to be used by the table to render rows and cells. | **Yes**  |
| children        | `Column` | `undefined` | The `Column` component. It does not accept any other children.      | **Yes**  |
| fixed           | `Number` | `undefined` | The number of fixed columns in the table.                           | No       |
| rowSelection    | `Bool`   | `true`      | This property determines whether checkbox column is rendered.       | No       |
| idKey           | `String` | `id`        | A key used to uniquely identify data.                               | No       |
| rowClassName    | `String` | `undefined` | Custom classes for a row.                                           | No       |
| headerClassName | `String` | `undefined` | Custom classes for the header row.                                  | No       |

#### Functions

| Property |             Description              | Parameters           |
| -------- | :----------------------------------: | -------------------- |
| onSort   | Pass a custom sorting functionality. | Array of column data |

[build]: https://travis-ci.org/samrith-s/sticky-react-table
[npm]: https://www.npmjs.org/package/sticky-react-table
[issues]: https://github.com/samrith-s/sticky-react-table/issues
[stars]: https://github.com/samrith-s/sticky-react-table/stargazers
[license]: https://github.com/samrith-s/sticky-react-table/blob/master/LICENSE
