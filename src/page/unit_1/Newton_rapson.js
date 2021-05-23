import { range, compile, evaluate, simplify, parse, abs, derivative } from 'mathjs'
import Container from 'react-bootstrap/Container'
import React, { Component } from 'react';
import { Input, Typography, Button, Table } from 'antd';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import table from 'react-bootstrap/Table'
import 'antd/dist/antd.css';
import createPlotlyComponent from 'react-plotlyjs'
import Plotly from 'plotly.js/dist/plotly-cartesian'
import 'bootstrap/dist/css/bootstrap.min.css';

const axios = require("axios")

var dataGraph = []
const PlotlyComponent = createPlotlyComponent(Plotly)
//const { Title } = Typography;

const columns = [
    {
        title: 'Iteration',
        dataIndex: 'iteration',
        key: 'iteration'
    },
    {
        title: 'X0',
        dataIndex: 'x1',
        key: 'x1'
    },
    {
        title: 'X',
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

class NewtonRaph extends Component {
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
    //     await api.getFunctionByName("Newton").then(db => {
    //     this.setState({
    //         fx:db.data.data.fx,
    //         x1:db.data.data.x,
    //     })
    //     console.log(this.state.fx);
    //     console.log(this.state.x0);
    //     console.log(this.state.x1);
    //     })
    //   }

    Graph(x1) {
        dataGraph = [
            {
                type: 'scatter',
                x: x1,
                marker: {
                    color: '#3c753c'
                },
                name: 'X1'
            },
        ];

    }

    func(x) {
        let scope = { x: parseFloat(x) };
        var expr = compile(this.state.fx);
        return expr.evaluate(scope)
    }

    error(xm, x0) {
        return Math.abs(xm - x0);
    }


    createTable(x1, x2, error) {
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
        await axios({ method: "get", url: "http://localhost:5000/database/newtonraphson", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            fx: api.fx,
            x1: api.x1,
        })
    }


    Diff = (X) => {
        let scope = { x: X }; 
        var expr = derivative(this.state.fx, 'x'); 
        return expr.evaluate(scope) 

    }

    onSubmit() {
        var fx = this.state.fx;
        var x1 = this.state.x1;
        var x2 = 0;
        var xm = 0;
        var check = 0;
        var x0 = 0;
        var i = 0;
        var error = 1;
        var data = []
        data['x1'] = []
        data['x2'] = []
        data['error'] = []
        data['iteration'] = []

        check = this.func(x1) / this.Diff(x1);
        //console.log("diff" + " " + this.Diff(x1))
        while (abs(check) >= 0.000001) {
            check = this.func(x1) / this.Diff(x1);
            x2 = x2 - check;
            error = this.error(x2, x1);
            data['iteration'][i] = i;
            data['x1'][i] = parseFloat(x1).toFixed(6);
            data['x2'][i] = parseFloat(x2).toFixed(6);
            data['error'][i] = error.toFixed(6);

            x1 = x2;
            i++;
        }

        console.log(this.state);
        this.createTable(data['x1'], data['x2'], data['error']);
        this.setState({ showTable: true, showGrap: true })
        this.Graph(data['x1'])
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
                    <h1><b><u>Newton Rapson</u></b></h1>
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
                                <InputGroup.Text id="basic-addon1">Xi-1 </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                size="large"
                                placeholder="Input your Xl"
                                name="x1" style={{ width: 200 }}
                                onChange={this.onInputChange}
                                value={this.state.x1}
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

                        <Container>
                            {this.state.showTable === true ?

                                <div>
                                    <h2 className="mt-4"></h2>
                                    <Table pagination={{ defaultPageSize: 99999 }} columns={columns} dataSource={dataTable} size="middle" />
                                </div>
                                : ''
                            }
                        </Container>
                    </form>
                </Container>

            </div>

        );
    }
}

export default NewtonRaph;