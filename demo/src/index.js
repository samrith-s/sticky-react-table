import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { generateData } from './utils/data-generator';

import { Table, Column } from '../../src';
import HeaderCell from './HeaderCell';
import FilterCell from './FilterCell';
import FilterIcon from './FilterIcon';
import EmailCellRenderer from './EmailCellRenderer';

import '../../src/themes/dark.scss';
import './style.css';

const dummyColumn = index => ({
  title: `Random column ${index}`,
  width: 200,
  dataKey: `column-${index}`
});

const dummyColumnCount = 10;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state.rows = generateData(30);
  }

  state = {
    rows: [],
    selectedRows: [],
    dummyColumns: false
  };

  componentDidMount() {
    this.renderDummyColumns();
  }

  //eslint-disable-next-line
  handleSort = column => {};

  handleRowCheck = selectedRows => {
    this.setState({
      selectedRows
    });
  };

  renderCheckbox = ({ checkbox }) => {
    return <span>{checkbox}</span>;
  };

  handleLoadMoreRows = () => {
    setTimeout(() => {
      this.setState(({ rows }) => ({
        rows: rows.concat(generateData(30))
      }));
    }, 1000);
  };

  dummyColumnRenderer = () => {
    const columns = [];
    for (let i = 0; i < dummyColumnCount; i++) {
      columns.push(<Column {...dummyColumn(i)} key={i} />);
    }
    return columns;
  };

  renderDummyColumns = () => {
    setTimeout(() => {
      this.setState({
        dummyColumns: true
      });
    }, 3000);
  };

  render() {
    const { rows, selectedRows, dummyColumns } = this.state;

    return (
      <div className="App">
        <Table
          data={rows}
          fixed={4}
          onRowCheck={this.handleRowCheck}
          selectedRows={selectedRows}
          checkboxRenderer={this.renderCheckbox}
          infiniteScrollLoadMore={this.handleLoadMoreRows}
          infiniteScrollTotalCount={300}
        >
          <Column
            title="Name"
            width={200}
            dataKey="name"
            headerRenderer={HeaderCell}
            filterRenderer={FilterCell}
            alwaysVisible
          />
          <Column title="Age" width={50} dataKey="age" />
          <Column
            title="Gender"
            width={75}
            dataKey="gender"
            filterRenderer={FilterCell}
            filterTrigger={FilterIcon}
          />
          <Column
            title="Designation"
            width={200}
            dataKey="designation"
            filterRenderer={FilterCell}
            filterTrigger={FilterIcon}
          />
          <Column title="Location" width={150} dataKey="location" />
          <Column title="Top Skill" width={250} dataKey="topSkill" />
          <Column
            title="Email"
            width={30}
            dataKey="email"
            cellRenderer={EmailCellRenderer}
          />
          <Column title="Phone" width={200} dataKey="phone" />
          <Column title="Experience" width={100} dataKey="experience" />
          <Column title="Language" width={100} dataKey="language" />
          <Column title="Marital Status" width={150} dataKey="maritalStatus" />
          <Column title="Orientation" width={200} dataKey="orientation" />
          <Column title="Theism" width={200} dataKey="theism" />
          <Column title="Religion" width={200} dataKey="religion" />
          {dummyColumns && this.dummyColumnRenderer()}
        </Table>
      </div>
    );
  }
}

const rootElement = document.getElementById('demo');
ReactDOM.render(<App />, rootElement);
