import React, { Component } from 'react'
import { Card, Input, Button, Table } from 'antd';
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import 'antd/dist/antd.css';
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};


var A = [], B = [], matrixA = [], matrixB = [], x, epsilon, dataInTable = [], count = 1, matrixX = []
var columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    }
];
class Jacobi extends Component {

    constructor() {
        super();
        this.state = {
            row: 0,
            column: 0,
            showDimentionForm: true,
            showMatrixForm: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.jacobi = this.jacobi.bind(this);

    }


    jacobi(n) {
        this.initMatrix();
        var temp;
        var xold;
        epsilon = new Array(n);
        do {
            temp = [];
            xold = JSON.parse(JSON.stringify(x));
            for (var i = 0; i < n; i++) {
                var sum = 0;
                for (var j = 0; j < n; j++) {
                    if (i !== j) { //else i == j That is a divide number
                        sum = sum + A[i][j] * x[j];
                    }
                }
                temp[i] = (B[i] - sum) / A[i][i]; //update x[i]

            }
            x = JSON.parse(JSON.stringify(temp));
        } while (this.error(x, xold)); //if true , continue next iteration

        this.setState({
            showOutputCard: true
        });

    }
    error(xnew, xold) {
        for (var i = 0; i < xnew.length; i++) {
            epsilon[i] = Math.abs((xnew[i] - xold[i]) / xnew[i])
        }
        this.appendTable(x, epsilon);
        for (i = 0; i < epsilon.length; i++) {
            if (epsilon[i] > 0.000001) {
                return true;
            }
        }
        return false;
    }
    createMatrix(row, column) {
        A = []
        B = []
        matrixA = []
        matrixB = []
        matrixX = []
        x = []
        dataInTable = []
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "55px",
                    height: "30px",
                    //marginInlineEnd: "5%",
                    //marginBlockEnd: "5%",
                    fontSize: "18px",
                    //fontWeight: "bold"
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }
            matrixA.push(<br />)
            matrixB.push(<Input style={{
                width: "55px",
                height: "30px",
                //marginInlineEnd: "5%",
                //marginBlockEnd: "5%",
                fontSize: "18px",
                //fontWeight: "bold"
            }}

            id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
            matrixB.push(<br />)
            matrixX.push(<Input style={{
                width: "55px",
                height: "30px",
                //marginInlineEnd: "5%",
                //marginBlockEnd: "5%",
                fontSize: "18px",
                //fontWeight: "bold"
            }}
            id={"x" + i} key={"x" + i} placeholder={"x" + i} />)
            matrixX.push(<br />)

        }

        this.setState({
            showDimentionForm: true,
            showMatrixForm: true,
        })

    }
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            for (var j = 0; j < this.state.column; j++) {
                A[i][j] = (parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
            x.push(parseFloat(document.getElementById("x" + (i + 1)).value));
        }
    }

    initialSchema(n) {
        for (var i = 1; i <= n; i++) {
            columns.push({
                title: "X" + i,
                dataIndex: "x" + i,
                key: "x" + i
            })
        }
        for (i = 1; i <= n; i++) {
            columns.push({
                title: "Error" + i,
                dataIndex: "error" + i,
                key: "error" + i
            })
        }
    }

    appendTable(x, error) {
        var tag = ''
        tag += '{"iteration": ' + count++ + ',';
        for (var i = 0; i < x.length; i++) {
            tag += '"x' + (i + 1) + '": ' + x[i].toFixed(8) + ', "error' + (i + 1) + '": ' + error[i].toFixed(8);
            if (i !== x.length - 1) {
                tag += ','
            }
        }
        tag += '}';
        dataInTable.push(JSON.parse(tag));
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({
            method: "get",
            url: "http://localhost:5000/database/jacobi",
        }).then((response) => {
            console.log("response: ", response.data);
            api = response.data;
        });
        await this.setState({
            row: api.row,
            column: api.column
        });
        matrixA = [];
        matrixB = [];
        matrixX = [];
        await this.createMatrix(api.row, api.column);
        await this.initialSchema(this.state.row);
        for (let i = 1; i <= api.row; i++) {
            for (let j = 1; j <= api.column; j++) {
                document.getElementById("a" + i + "" + j).value =
                    api.matrixA[i - 1][j - 1];
            }
            document.getElementById("b" + i).value = api.matrixB[i - 1];
            document.getElementById("x" + i).value = api.matrixX[i - 1];
        }
        this.jacobi(parseInt(this.state.row));
    }

    render() {
        return (
            <body>
                <h1><b><u>Jacobi Iteration</u></b></h1>
                <br></br>
                <Container>
                    <Container>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Row</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Input your Row"
                                name="row"
                                style={{ width: 250 }}
                                onChange={this.handleChange}
                                value={this.state.row}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Column</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="Input your Row"
                                name="column"
                                style={{ width: 250 }}
                                onChange={this.handleChange}
                                value={this.state.column}
                            />
                        </InputGroup>
                        <Button id="dimention_button"
                            type="submit"
                            variant="success"
                            size="lg" block
                            style={{
                                width: "540px",
                                height: "40px"
                            }}
                            onClick={
                                () => {
                                    this.createMatrix(this.state.row, this.state.column);
                                    this.initialSchema(this.state.row)
                                }
                            }>
                            สร้าง Matrix
                        </Button>

                        <Button type="submit"
                            variant="success"
                            size="lg" block
                            style={{
                                width: "540px",
                                height: "40px"
                            }}
                            onClick={() => this.dataapi()}>
                            API
                        </Button>
                    </Container>
                    <Container style={{ textAlign: 'center', fontSize: '21px' }}>
                        <br></br>
                        <Container >
                            {this.state.showMatrixForm &&
                                <Container>
                                    <div  style={{ display: "flex" }}>
                                        <br />
                                        <Container><h2 style={{ textAlign: 'center', fontSize: '30px' }}>Matrix [A]</h2><br />{matrixA}</Container>
                                        <Container><h2 style={{ textAlign: 'center', fontSize: '30px' }}>Vector [B]<br /><br></br></h2>{matrixB}</Container>
                                        <Container><h2 style={{ textAlign: 'center', fontSize: '30px' }}>Vector [X]<br /><br></br></h2>{matrixX}</Container>
                                        <br />
                                        <br></br>
                                    </div>
                                    <br></br>
                                    <Button
                                        id="matrix_button" size="large"
                                        style={{ width: "400px", color: "black" }}
                                        onClick={() => this.jacobi(this.state.row)}>
                                        Submit
                                    </Button>
                                </Container>
                            }
                        </Container>
                    </Container>
                    <br></br>
                    <div className="col">
                        {this.state.showOutputCard &&
                            <Card
                                title={"Result"}
                                bordered={true}
                                style={{ width: "100%", background: "while", color: "#FFFFFFFF" }}
                                id="outputCard"
                            >
                                <Table columns={columns} bordered dataSource={dataInTable} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "black", overflowX: "scroll", border: "2px solid white" }}></Table>
                            </Card>
                        }
                    </div>
                </Container>
            </body>
        );
    }
}
export default Jacobi;



