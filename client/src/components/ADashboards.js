import React, { Component } from 'react'
import { Table } from 'react-bootstrap';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import "./ADashboards.css";
import Chart from "react-apexcharts";
class ADashboards extends Component {
    constructor(props) {
        super(props)
        this.state = {
            output: '0',
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: ['MCoin', 'UCoin', 'YCoin']
                }
            },
            series: [
                {
                    name: "series-1",
                    data: [1,1,1]
                }
            ],
            rates: []
        };
    }

    componentDidMount = async () => {
        const { accounts, contract } = this.props;
        console.log(await contract.methods.getRate(0, 1).call());
        this.state.rates = [
            await contract.methods.getRate(0, 1).call(),
            await contract.methods.getRate(0, 2).call(),
            await contract.methods.getRate(1, 2).call(),
        ];
        console.log(this.state.rates[0]);
    };

    render() {
        return (


            <div id="wrapper">

                <div className="content-area">
                    <div className="container-fluid">
                        <div className="main">


                            <div className="row mt-12">
                                <div className="col-md-12">
                                    <div className="mixed-chart">
                                        <Chart
                                            options={this.state.options}
                                            series={this.state.series}
                                            type="bar"
                                            width="500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="float-right edit-on-codepen">

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="content-area">
                    <div className="container-fluid">
                        <div className="main">


                            <div className="row mt-12">
                                <div className="col-md-12">
                                    <div className="box  mt-12">
                                        <Table striped bordered hover variant="dark">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Coin</th>
                                                    <th>Last Name</th>
                                                    <th>Rate/Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td>MCoin</td>
                                                    <td>UCoin</td>
                                                    <td>{this.state.rates[0]}</td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>MCoin</td>
                                                    <td>YCoin</td>
                                                    <td>-{this.state.rates[1]}</td>
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td>UCoin</td>
                                                    <td>YCoin</td>
                                                    <td>{this.state.rates[2]}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default ADashboards;
