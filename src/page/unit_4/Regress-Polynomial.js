
import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Card, Input, Button, Table,Layout } from 'antd';
import 'antd/dist/antd.css';
import { lusolve, squeeze, sum } from 'mathjs';
import axios from 'axios';
var api;
const InputStyle = {
    background: "#1890ff",
    color: "white",
    fontWeight: "bold",
    fontSize: "24px"

};
var columns = [
    {
        title: "No.",
        dataIndex: "no",
        key: "no"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    }
];
var x, y, tableTag, regressionMatrixX, regressionMatrixY, matrixA, matrixB, answer,output = [],set = 0

class Polynomial extends Component {

    constructor() {
        super();
        x = []
        y = []

        tableTag = []
        this.state = {
            nPoints: 0,
            m: 0,
            interpolatePoint: 0,
            showInputForm: true,
            showTableInput: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);


    }

    createTableInput(n, m) {
        output = []
        for (var i = 1; i <= n; i++) {
            x.push(<Input style={{
                width: "50%",
                height: "40%",
                // backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold",
                justifyContent: "center"
            }}
                id={"x" + i} key={"x" + i} placeholder={"x" + i} />);
            y.push(<Input style={{
                width: "50%",
                height: "40%",
                // backgroundColor: "black",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                color: "black",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"y" + i} key={"y" + i} placeholder={"y" + i} />);
                tableTag.push({
                no: i,
                x: x[i - 1],
                y: y[i - 1]
            })

        }
        regressionMatrixX = new Array(m + 1)
        regressionMatrixY = new Array(m + 1)
        for (i = 1; i <= m + 1; i++) {
            regressionMatrixX[i] = []
            for (var j = 1; j <= m + 1; j++) {
                regressionMatrixX[i][j] = []
            }
        }

        this.setState({
            showInputForm: true,
            showTableInput: true
        })
    }

    initialValue(n, m) {
        x = new Array(m + 1)
        y = []
        for (var i = 1; i <= n; i++) {
            x[i] = parseFloat(document.getElementById("x" + i).value);

        }
        for (i = 1; i <= n; i++) {
            y[i] = parseFloat(document.getElementById("y" + i).value);
        }
    }

    polynomial(n, m) {
        var exponent = 1
        //find matrix X
        for (var i = 1; i <= m + 1; i++) {
            for (var j = 1; j <= m + 1; j++) {
                if (i === 1 && j === 1) {
                    regressionMatrixX[i][j] = n
                    continue
                }
                regressionMatrixX[i][j] = this.summation(x, exponent)
                exponent++

            }
            exponent = i
        }
        //find matrix Y
        regressionMatrixY[1] = sum(y)
        for (i = 2; i <= m + 1; i++) {
            regressionMatrixY[i] = this.summationOfTwo(x, y, i - 1)
        }
        console.log(regressionMatrixY)
        this.findX(m)
        set = 1
    }

    findX(m) {
        matrixA = new Array(m + 1)
        matrixB = new Array(m + 1)
        for (var i = 0; i < m + 1; i++) {
            matrixA[i] = []
            for (var j = 0; j < m + 1; j++) {
                matrixA[i][j] = regressionMatrixX[i + 1][j + 1]
            }
            matrixB[i] = regressionMatrixY[i + 1]
        }
        answer = lusolve(matrixA, matrixB)
        console.log(answer)

        if(1 > 0){
            for (i = 0; i < answer.length; i++) {
                //output.push("x" + (i + 1) + " = " + answer[i]);
                output.push(<h5>X<sub>{i}</sub>&nbsp;=&nbsp;&nbsp;{answer[i]}</h5>);
                // if(i < n){
                //     output.push(<br></br>)
                // }
            }
        }
        this.setState({
            showOutputCard: true
        })
    }

    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/polynomial",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
            m:api.ordernumber,
            nPoints:api.numberpoint
        })
        
        await this.createTableInput(this.state.nPoints, this.state.m);
        // await this.initialValue(parseInt(this.state.nPoints), parseInt(this.state.m));
        // await this.polynomial(parseInt(this.state.nPoints), parseInt(this.state.m));
        for (let i = 1; i <= api.numberpoint; i++) {
          document.getElementById("x" + i).value = api.arrayX[i - 1];
          document.getElementById("y" + i).value = api.arrayY[i - 1];
        }
        this.initialValue(parseInt(this.state.nPoints), parseInt(this.state.m));
        this.polynomial(parseInt(this.state.nPoints), parseInt(this.state.m));
      }
      

    summation(A, exponent) {
        var sum = 0
        for (var i = 1; i < A.length; i++) {
            sum += Math.pow(A[i], exponent)
        }
        return sum
    }

    summationOfTwo(x, y, exponent) {
        var sum = 0
        for (var i = 1; i < y.length; i++) {
            sum += Math.pow(x[i], exponent) * y[i]
        }
        return sum
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        const { Header, Content, Footer } = Layout;
        return (
            <Container>
                <h1><b><u>Polynomial Regression</u></b></h1>
                <br></br>

                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Number of points(n)</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Input your points"
                        name="nPoints"
                        style={{ width: 250 }}
                        onChange={this.handleChange}
                        value={this.state.nPoints}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">Order(m)</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Input your points"
                        name="m"
                        style={{ width: 250 }}
                        onChange={this.handleChange}
                        value={this.state.m}
                    />
                </InputGroup>
                <Button id="dimention_button" size="large"
                    style={{
                        width: "555px",
                        height: "40px"
                    }}
                    onClick={
                        () => this.createTableInput(parseInt(this.state.nPoints), parseInt(this.state.m))}>
                    สร้างตาราง<br></br>
                </Button>
                <Button type="submit" size="large"
                    style={{
                        width: "555px",
                        height: "40px"
                    }}
                    onClick={() => this.dataapi()}>
                    API
                 </Button>
                 <Container style={{ display: "flex" }}>
                    <Container>
                        {this.state.showTableInput &&
                            <div> <br />
                                <Table columns={columns} dataSource={tableTag} pagination={false} bordered={true} bodyStyle={{ fontWeight: "bold", fontSize: "18px", color: "white", overflowY: "scroll", minWidth: 120, maxHeight: 300 }}></Table><br />
                                <Button
                                    id="matrix_button" size="large"
                                    style={{ width: "100%", color: "black" }}
                                    onClick={() => { this.initialValue(parseInt(this.state.nPoints), parseInt(this.state.m));
                                                     this.polynomial(parseInt(this.state.nPoints), parseInt(this.state.m)) }}>
                                    คำนวณ
                                </Button>
                                <br></br><br></br>
                            </div>
                        }
                    </Container>
                    <Container>
                        <br></br>
                        {this.state.showOutputCard &&
                            <Card
                                title={"Result"}
                                bordered={true}
                                style={{ background: "white ", color: "black" }}
                            >
                                <p style={{ fontSize: "24px", fontWeight: "bold" }}>{output}</p>
                            </Card>
                        }
                    </Container>
                </Container>


                
            </Container>
        );
    }
}
export default Polynomial;