import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { generateData } from './utils/data-generator';

import { Table, Column } from '../../src';
import HeaderCell from './HeaderCell';

import '../../src/themes/light.scss';
import './style.css';

export default class App extends Component {
  state = {
    rowCount: 100,
    rows: []
  };

  componentDidMount() {
    this.setState({
      rows: generateData(this.state.rowCount)
    });
  }

  headerRenderer = props => {
    return <HeaderCell {...props} />;
  };

  rowRenderer = props => {
    return (
      <input
        type="text"
        defaultValue={props.cellData}
        className="form-control"
      />
    );
  };

  //eslint-disable-next-line
  handleSort = column => {};

  //eslint-disable-next-line
  handleRowCheck = e => {};

  render() {
    const { rows } = this.state;
    return (
      <div className="App">
        <Table data={rows} fixed={4} onRowCheck={this.handleRowCheck}>
          <Column
            title="Name"
            width={200}
            dataKey="name"
            headerRenderer={this.headerRenderer}
          />
          <Column title="Age" width={50} dataKey="age" />
          <Column title="Gender" width={75} dataKey="gender" />
          <Column title="Designation" width={200} dataKey="designation" />
          <Column title="Location" width={150} dataKey="location" />
          <Column title="Top Skill" width={250} dataKey="topSkill" />
          <Column
            title="Email"
            width={300}
            dataKey="email"
            rowRenderer={this.rowRenderer}
          />
          <Column title="Phone" width={200} dataKey="phone" />
          <Column title="Experience" width={100} dataKey="experience" />
          <Column title="Language" width={100} dataKey="language" />
          <Column title="Marital Status" width={150} dataKey="maritalStatus" />
          <Column title="Orientation" width={200} dataKey="orientation" />
          <Column title="Theism" width={200} dataKey="theism" />
          <Column title="Religion" width={200} dataKey="religion" />
        </Table>
      </div>
    );
  }
}

const rootElement = document.getElementById('demo');
ReactDOM.render(<App />, rootElement);
