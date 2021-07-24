import React, { Component } from 'react'
import { Table } from 'react-bootstrap';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import "./ADashboards.css";
import Chart from "react-apexcharts";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import AmCharts4Wrapper from "react-amcharts4";

import { PieChart } from "@amcharts/amcharts4/charts";
import  Table_Market  from './Table_Market'

// Configure any reguired theme
import am4themes_material from "@amcharts/amcharts4/themes/material";
am4core.useTheme(am4themes_animated);
const config_ = {
    // Create pie series
    series: [
        {
            type: "PieSeries",
            dataFields: {
                value: "litres",
                category: "country"
            }
        }
    ],
    // Add data
    data: [
        { from: "A", to: "D", value: 10 },
        { from: "B", to: "D", value: 8 },
        { from: "B", to: "E", value: 4 },
        { from: "B", to: "C", value: 2 },
        { from: "C", to: "E", value: 14 },
        { from: "E", to: "D", value: 8 },
        { from: "C", to: "A", value: 4 },
        { from: "G", to: "A", value: 7 },
        { from: "D", to: "B", value: 1 }
    ],
    dataFields: [{ fromName : "from" }, { toName : "to" }, { value : "value" },]
};
const config = {
    // Create pie series
    series: [
        {
            type: "PieChart3D",
            dataFields: {
                value: "litres",
                category: "country"
            }
        }
    ],
    // Add data
    data: [
        {
            country: "Lithuania",
            litres: 501.9
        },
        {
            country: "Czech Republic",
            litres: 301.9
        },
        {
            country: "Ireland",
            litres: 201.1
        },
        {
            country: "Germany",
            litres: 165.8
        },
        {
            country: "Australia",
            litres: 139.9
        },
        {
            country: "Austria",
            litres: 128.3
        },
        {
            country: "UK",
            litres: 99
        },
        {
            country: "Belgium",
            litres: 60
        },
        {
            country: "The Netherlands",
            litres: 50
        }
    ]
};
//am4core.useTheme(am4themes_material);
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
        let chart = am4core.create("chartdiv", am4charts.XYChart);

        const { accounts, contract, web3 } = this.props;
        /*console.log(await contract.methods.getRate(0, 1).call());
        this.state.rates = [
            await contract.methods.getRate(0, 1).call(),
            await contract.methods.getRate(0, 2).call(),
            await contract.methods.getRate(1, 2).call(),
        ];*/
        let symbol1 = await contract.methods.getCoinSymbol(0).call();
        let symbol2 = await contract.methods.getCoinSymbol(1).call();
        let symbol3 = await contract.methods.getCoinSymbol(2).call();
        console.log(this.state.rates[0]);
        let maxUser = await contract.methods.getStudentsLength().call();
        let data = [];
        for (let index = 0; index < maxUser; index++) {
            let temp = (await contract.methods.getStudent(index).call())
            data.push({
                "category": 'Id: ' + temp[0] +', Nome: '+ temp[1],
                /*symbol1*/'YCoin': await web3.utils.fromWei(await contract.methods.balanceOfAt(index, 0).call()),
                /*symbol21*/ 'UCoin': await web3.utils.fromWei(await contract.methods.balanceOfAt(index, 1).call()),
                /*symbol31 */'MCoin': await web3.utils.fromWei(await contract.methods.balanceOfAt(index, 2).call())
            },)
        }
        console.log('YCoin',await web3.utils.fromWei(await contract.methods.balanceOfAt(0, 0).call()));
        console.log('UCoin',await web3.utils.fromWei(await contract.methods.balanceOfAt(0, 1).call()));
        console.log('MCoin',await web3.utils.fromWei(await contract.methods.balanceOfAt(0, 2).call()));
        chart.data = data;

        chart.colors.step = 2;
        chart.padding(30, 30, 10, 30);

        chart.legend = new am4charts.Legend();
        chart.legend.itemContainers.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.minGridDistance = 60;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.interactionsEnabled = false;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //valueAxis.min = 0;
        //valueAxis.max = 1000;
        valueAxis.strictMinMax = true;
        valueAxis.calculateTotals = true;

        valueAxis.renderer.minGridDistance = 20;
        valueAxis.renderer.minWidth = 35;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.tooltipText = "{valueY.formatNumber('#.00')} {name}";
        series1.columns.template.column.strokeOpacity = 1;
        series1.name = symbol1;
        series1.dataFields.categoryX = "category";
        series1.dataFields.valueY = symbol1;
        series1.dataFields.valueYShow = "totalPercent";
        series1.dataItems.template.locations.categoryX = 0.5;
        series1.stacked = true;
        series1.tooltip.pointerOrientation = "vertical";
        series1.tooltip.dy = - 20;
        series1.cursorHoverEnabled = false;

        var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
        bullet1.label.text = "{valueY.formatNumber('#.00')}";
        bullet1.locationY = 0.5;
        bullet1.label.fill = am4core.color("#ffffff");
        bullet1.interactionsEnabled = false;

        var series2 = chart.series.push(series1.clone());
        series2.name = symbol2;
        series2.dataFields.valueY = symbol2;
        series2.fill = chart.colors.next();
        series2.stroke = series2.fill;
        series2.cursorHoverEnabled = false;

        var series3 = chart.series.push(series1.clone());
        series3.name = symbol3;
        series3.dataFields.valueY = symbol3;
        series3.fill = chart.colors.next();
        series3.stroke = series3.fill;
        series3.cursorHoverEnabled = false;

        chart.scrollbarX = new am4core.Scrollbar();

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.behavior = "panX";

        this.chart = chart;
    };

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    render() {
        return (
            <div id="wrapper">

                <div className="content-area">
            <div id="chartdiv" style={{ backgroundColor: '#fff', width: "100%", height: "500px" }}></div>
                <div className="row mt-12" style={{ backgroundColor: '#fff'}}>
                    <div className="col-md-12">
                    <Table_Market
                    accounts={this.props.accounts}
                    contract={this.props.contract}
                    web3={this.props.web3}
                    />
                </div>
                </div>
            </div>
            </div>
        );
        /*return (


            <div id="wrapper">

                <div className="content-area">
                    <div className="container-fluid">
                        <div className="main">


                            <div className="row mt-12">
                                <div className="col-md-12">
                                    <div className="mixed-chart">
                                        <div style={{ width: "80%", margin: "0 auto" }}>
                                            <AmCharts4Wrapper
                                                config={config}
                                                id="amcharts-4"
                                                chartTypeClass={am4charts.PieChart3D}
                                            />
                                            <div id="chartdiv"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-12">
                                <div className="col-md-12">
                                    <div className="mixed-chart">
                                        <div style={{ width: "80%", margin: "0 auto" }}>
                                            <AmCharts4Wrapper
                                                config={config_}
                                                id="amcharts-4_"
                                                chartTypeClass={am4charts.ChordDiagram}
                                            />
                                        </div>
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
        );*/
    }
}

export default ADashboards;
