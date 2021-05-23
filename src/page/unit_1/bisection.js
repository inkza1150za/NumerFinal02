// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import React, { Component } from 'react';
import { Input, Typography, Button, Table } from 'antd';
import { range, compile, evaluate, simplify, parse, abs } from 'mathjs'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import table from 'react-bootstrap/Table'
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { background } from 'plotly.js/dist/plotly-cartesian';

const axios = require("axios")

const columns = [
    {
        title: 'Iteration',
        dataIndex: 'iteration',
        key: 'iteration'
    },
    {
        title: 'XL',
        dataIndex: 'xl',
        key: 'xl'
    },
    {
        title: 'XR',
        dataIndex: 'xr',
        key: 'xr'
    },
    {
        title: 'XM',
        dataIndex: 'xm',
        key: 'xm'
    },
    {
        title: 'Error',
        dataIndex: 'error',
        key: 'error'
    },
];

var dataTable = [];
var api;

class Bisection extends React.Component {
    constructor() {
        super();
        this.state = {
            fxr: [],
            fxl: [],
            fx: "",
            xl: 0,
            xr: 0,
            showTable: false
        };


        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    func(x) {
        let scope = { x: parseFloat(x) };
        var expr = compile(this.state.fx);
        return expr.evaluate(scope)
    }

    error(xo, xm) {
        return Math.abs((xm - xo) / xm);
    }


    createTable(xl, xr, xm, error) {
        dataTable = []
        var i = 0;
        for (i = 1; i < error.length; i++) {
            dataTable.push({
                key: i,
                iteration: i,
                xl: xl[i],
                xr: xr[i],
                xm: xm[i],
                error: error[i],
            });
        }
    }

    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(this.state);
    }

    async ex() {
        await axios({ method: "get", url: "http://localhost:5000/database/bisection", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            fx: api.fx,
            xl: api.xl,
            xr: api.xr
        })
    }

    onSubmit() {
        var fx = this.state.fx;
        var xl = this.state.xl;
        var xr = this.state.xr;
        var xo = 0;
        var xm = 0;
        var i = 0;
        var error = 1;
        var data = []
        data['xl'] = []
        data['xr'] = []
        data['xm'] = []
        data['error'] = []
        data['iteration'] = []

        while (error >= 0.000001) {
            xm = (parseFloat(xl) + parseFloat(xr)) / 2;
            //console.log(xm)

            if (this.func(xm) == 0) {
                break;
            } else if (this.func(xm) * this.func(xr) < 0) {
                this.state.fxl = this.func(xl);
                xl = xm;
                this.state.xl = xm;
            } else {
                this.state.fxr = this.func(xr);
                xr = xm;
                this.state.xr = xm;
            }

            error = this.error(xo, xm);

            data['iteration'][i] = i;
            data['xl'][i] = parseFloat(xl).toFixed(6);
            data['xr'][i] = parseFloat(xr).toFixed(6);
            data['xm'][i] = parseFloat(xm).toFixed(6);
            data['error'][i] = error.toFixed(6);
            xo = xm;
            i++;
        }
        console.log(this.state);

        this.createTable(data['xl'], data['xr'], data['xm'], data['error']);
        this.setState({ showTable: true, showGrap: false })
    }

    plot() {
        const xl_plot = this.state.xll;
        const yl_plot = this.state.fxl;
        const xr_plot = this.state.xrr;
        const yr_plot = this.state.fxr;

        var data = [
            {
                type: "scatter",
                x: xl_plot,
                y: yl_plot,
                marker: {
                    color: "#0066FF"
                },
                name: "XL"
            },
            {
                type: "scatter",
                x: xr_plot,
                y: yr_plot,
                marker: {
                    color: "#FF33FF"
                },
                name: "XR"
            }
        ];
        return data;
    }

    render() {
        let data = this.plot();
        return (
            <div>
                <body style={{ background: '#ffffff' }}>
                    <Container>
                        <h1><b><u>Bisection</u></b></h1>
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Equation</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Input your Function"
                                name="fx"
                                style={{ width: 250 }}
                                onChange={this.onInputChange}
                                value={this.state.fx}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text>Xl</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Input your XL"
                                name="xl"
                                style={{ width: 200 }}
                                onChange={this.onInputChange}
                                value={this.state.xl}
                            />
                            <InputGroup.Prepend>
                                <InputGroup.Text>Xr</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Input your XR"
                                name="xr"
                                style={{ width: 200 }}
                                onChange={this.onInputChange}
                                value={this.state.xr}
                            />
                        </InputGroup>

                    </Container>
                    <Container style={{ display: "flex" }}>
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
                    </Container>
                    <Container>
                        {this.state.showTable === true ?

                            <div>
                                <h2 className="mt-4"></h2>
                                <Table pagination={{ defaultPageSize: 99999 }} columns={columns} dataSource={dataTable} size="middle" />
                            </div>
                            : ''
                        }
                    </Container>
                </body>
            </div>
        );
    }
}
export default Bisection;