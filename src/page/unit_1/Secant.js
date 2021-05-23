import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
//import api from '../api'
import Title from 'antd/lib/skeleton/Title';
var dataGraph = []
const PlotlyComponent = createPlotlyComponent(Plotly)
// const { Title } = Typography;

const axios = require("axios")

const columns = [
  {
    title: 'Iteration',
    dataIndex: 'iteration',
    key: 'iteration'
  },
  {
    title: 'X1',
    dataIndex: 'x1',
    key: 'x1'
  },
  {
    title: 'X2',
    dataIndex: 'x2',
    key: 'x2'
  },
  {
    title: 'Error',
    dataIndex: 'error',
    key: 'error'
  },
];
var dataTable = [];
var api;

class Secant extends Component {
  constructor() {
    super();
    this.state = {
      size: 'large',
      fx: "",
      x1: 0,
      x2: 0,
      x0: 0,
      showTable: false
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  //   componentDidMount = async() => { 
  //     await api.getFunctionByName("Secant").then(db => {
  //     this.setState({
  //         fx:db.data.data.fx,
  //         x2:db.data.data.xr,
  //         x1:db.data.data.xl,
  //     })
  //     console.log(this.state.fx);
  //     console.log(this.state.x0);
  //     console.log(this.state.x1);
  //     })
  //   }
  Graph(x1, x2) {
    dataGraph = [
      {
        type: 'scatter',
        x: x1,
        marker: {
          color: '#a32f0f'
        },
        name: 'X1'
      },
      {
        type: 'scatter',
        x: x2,
        marker: {
          color: '#3c753c'
        },
        name: 'X2'
      }];

  }

  func(x) {
    let scope = { x: parseFloat(x) };
    var expr = compile(this.state.fx);
    return expr.evaluate(scope)
  }

  error(xm, x0) {
    return Math.abs(xm - x0);
  }


  createTable(x1, x2, x0, error) {
    dataTable = []
    var i = 0;
    for (i = 1; i < error.length; i++) {
      dataTable.push({
        iteration: i,
        x1: x1[i],
        x2: x2[i],
        error: error[i],
      });
    }
    console.log(x1)
  }

  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(this.state);
  }

  async ex() {
    await axios({ method: "get", url: "http://localhost:5000/database/secant_test", }).then((response) => { console.log("response: ", response.data); api = response.data; });
    await this.setState({
      fx: api.fx,
      x1: api.x1,
      x2: api.x2
    })
  }

  onSubmit() {
    var fx = this.state.fx;
    var x1 = this.state.x1;
    var x2 = this.state.x2;
    var xm = 0;
    var check = 0;
    var x0 = 0;
    var i = 0;
    var error = 1;
    var data = []
    data['x1'] = []
    data['x2'] = []
    data['x0'] = []
    data['error'] = []
    data['iteration'] = []

    //if (this.func(x1) * this.func(x2) < 0) {
    do { 
      x0 = ((parseFloat(x1) * this.func(x2)) - (parseFloat(x2) * this.func(x1))) / (this.func(x2) - this.func(x1))
      check = this.func(x1) - this.func(x0)
      x1 = x2 
      x2 = x0 
      i++
      if (check == 0) {
        break;
      }
      xm = ((parseFloat(x1) * this.func(x2)) - (parseFloat(x2) * this.func(x1))) / (this.func(x2) - this.func(x1))
      error = this.error(xm, x0);

      data['iteration'][i] = i;
      data['x0'][i] = parseFloat(x0).toFixed(6);
      data['x1'][i] = parseFloat(x1).toFixed(6);
      data['x2'][i] = parseFloat(x2).toFixed(6);
      data['error'][i] = error.toFixed(6);
      // console.log(data['x1'] + " " + data['x2']);
    } while (abs(xm - x0) >= 0.00001);
    //}
    console.log(this.state);
    this.createTable(data['x1'], data['x2'], data['x0'], data['error']);
    this.setState({ showTable: true, showGrap: true })
    this.Graph(data['x1'], data['x2'])
    //this.bisection(parseFloat(this.state.xl),parseFloat(this.state.xr));
  }

  render() {

    let layout = {
      title: 'Bisection',
      xaxis: {
        title: 'X'
      }
    };
    let config = {
      showLink: false,
      displayModeBar: true
    };

    const { size } = this.state;
    return (
      <div>
        <Container>
          <h1><b><u>Secant</u></b></h1>
          <br></br>

          <form style={{ textAlign: 'center' }}
            onSubmit={this.onInputChange}
          >

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Equation</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                size="large"
                placeholder="Input your Function"
                name="fx" style={{ width: 300 }}
                onChange={this.onInputChange}
                value={this.state.fx}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text>Xi-1</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Input your Xi-1"
                name="x1"
                style={{ width: 200 }}
                onChange={this.onInputChange}
                value={this.state.x1}
              />
              <InputGroup.Prepend>
                <InputGroup.Text>Xi</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Input your Xi"
                name="x2"
                style={{ width: 200 }}
                onChange={this.onInputChange}
                value={this.state.x2}
              />
            </InputGroup>
            <div style={{ display: "flex" }}>
              <Button type="submit" variant="success" size="lg" block
                style={{
                  width: "555px",
                  height: "40px"
                }}
                onClick={this.onSubmit}>
                คำนวณ
                            </Button>
              <br></br>
              <Button type="submit" variant="success" size="lg" block
                style={{
                  width: "555px",
                  height: "40px"
                }}
                onClick={() => this.ex()}>
                Api
                            </Button>
            </div>
            <div>
              <br></br>
              <br></br>
              {this.state.showTable === true ?
                <div>
                  <Table columns={columns} dataSource={dataTable} size="middle" /></div> : ''}

              {/* {this.state.showGrap === true ?
                <PlotlyComponent data={dataGraph} Layout={layout} config={config} /> : ''
              } */}

            </div>
          </form>
        </Container>

      </div>

    );
  }
}

export default Secant;