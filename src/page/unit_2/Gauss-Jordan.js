import React, { Component } from 'react'
import { Card, Input, Button } from 'antd';
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

var A = [], B = [], matrixA = [], matrixB = [], output = []
class Jordan extends Component {

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
        this.jordan = this.jordan.bind(this);

    }

    jordan(n) {
        this.initMatrix();
        if (A[0][0] === 0) { //pivoting
            var tempRow = JSON.parse(JSON.stringify(A[0]));
            var tempColumn = B[0];
            A[0] = A[1];
            A[1] = tempRow;
            B[0] = B[1];
            B[1] = tempColumn;
        }
        //Forward eliminate
        for (var k = 0; k < n; k++) {
            for (var i = k + 1; i < n; i++) {
                var factor = A[i][k] / A[k][k];
                for (var j = k; j < n; j++) {
                    A[i][j] = A[i][j] - factor * A[k][j];
                }
                B[i] = B[i] - factor * B[k];
                //B[i] = parseFloat(B[i]).toFixed(0);

            }
        }
        //Backward Substitution
        for (k = n - 1; k >= 0; k--) {
            for (i = k; i >= 0; i--) {

                if (i === k) {//Identity matrix
                    factor = 1 / A[i][k];

                    for (j = 0; j < n; j++) {
                        A[i][j] = A[i][j] * factor;
                    }
                    B[i] = B[i] * factor;
                    B[i].toFixed(0);
                    //B[i] = parseFloat(B[i]).toFixed(0);

                }
                else {
                    factor = A[i][k] / A[k][k];
                    for (j = 0; j < n; j++) {
                        A[i][j] = A[i][j] - factor * A[k][j];
                    }
                    B[i] = B[i] - factor * B[k];
                    B[i].toFixed(0);
                    //B[i] = parseFloat(B[i]).toFixed(0);
                }
            }
        }
        for (i = 0; i < n; i++) {
            // output.push("x" + (i + 1) + " = " + B[i]);
            output.push(<h5>X<sub>{i}</sub>&nbsp;=&nbsp;&nbsp;{B[i]}</h5>);
            // if(i < n){
            //     output.push(<br></br>)
            // }
        }
        this.setState({
            showOutputCard: true
        });


    }
    createMatrix(row, column) {
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
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/gauss",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
          row: api.row,
          column: api.column,
        });
        matrixA = [];
        matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
          for (let j = 1; j <= api.column; j++) {
            document.getElementById("a" + i + "" + j).value =
              api.matrixA[i - 1][j - 1];
          }
          document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.jordan(api.row);
      }

      render() {
        let { row, column } = this.state;
        return (
            <div style={{ textAlign: 'center' }}>
                <h1><b><u>Gauss-Jordan</u></b></h1>
                <br />
                <body style={{ background: '#ffffff' }}>
                    <div style={{ display: "flex" }}>
                        <Container style={{ background: '#ffffff' }}>

                            <div style={{ textAlign: 'center' }}>
                                {this.state.showDimentionForm &&
                                    <div>
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
                                                width: "555px",
                                                height: "40px"
                                            }}
                                            onClick={
                                                () => this.createMatrix(row, column)
                                            }>
                                            สร้าง Matrix
                                        </Button>

                                        <Button type="submit"
                                            variant="success"
                                            size="lg" block
                                            style={{
                                                width: "555px",
                                                height: "40px"
                                            }}
                                            onClick={() => this.dataapi()}>
                                            API
                                        </Button>
                                    </div>
                                }
                                <Container>
                                    <Container style={{ display: "flex" }}>
                                        {this.state.showMatrixForm &&
                                            <Container>
                                                <div style={{ display: "" }}>
                                                    <br />
                                                    <div >
                                                        <br />
                                                        <h5 >Matrix [A]</h5>{matrixA}<br />
                                                    </div>

                                                    <div style={{ display: "" }}>
                                                        <br />
                                                        <h5 >Vector [B]</h5>{matrixB}<br />
                                                    </div>
                                                    <br />
                                                </div>
                                                <Container>
                                                    <br />
                                                    <Button
                                                        size="large"
                                                        id="matrix_button"
                                                        style={{ width: 150, color: "black" }}
                                                        onClick={() => this.jordan()}>
                                                        คำนวณ
                                                </Button>
                                                </Container>
                                            </Container>
                                        }
                                        <Container>
                                            <br />
                                            <br />
                                            {this.state.showOutputCard &&
                                                <Card
                                                    title={"Result"}
                                                    bordered={true}
                                                    style={{ width: "100%", background: "while", color: "#000000" }}
                                                    onChange={this.handleChange}>
                                                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{output}</p>
                                                </Card>
                                            }
                                        </Container>
                                    </Container>
                                </Container>
                                <br />
                                <br />
                            </div>
                            <br />
                            <br />

                        </Container>

                        {/* <div>
                                {this.state.showOutputCard &&
                                    <Card
                                        title={"Output"}
                                        bordered={true}
                                        style={{ width: "100%", background: "while", color: "#000000" }}
                                        onChange={this.handleChange}>
                                        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{answer}</p>
                                    </Card>
                                }
                            </div>
                            <br />
                            <br /> */}

                    </div>
                </body>
            </div>
        );
    }
}
export default Jordan;


