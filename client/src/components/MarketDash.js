import React, { Component } from 'react'
import { Table } from 'react-bootstrap';
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import "./ADashboards.css";
import Chart from "react-apexcharts";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import  Table_Market  from './Table_Market'

am4core.useTheme(am4themes_animated);

//am4core.useTheme(am4themes_material);
class MarketDash extends Component {

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
                    data: [1, 1, 1]
                }
            ],
            rates: []
        };
    }

    componentDidMount = async () => {
        let chart = am4core.create("chartdiv", am4charts.ChordDiagram);

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
        let maxCoin = await contract.methods.getCoinsLength().call();
        let data = [];
        for (let i = 0; i < maxCoin; i++) {
            let c1 = await contract.methods.getCoinSymbol(i).call();
            for (let j = i+1; j < maxCoin; j++) {
                let c2 = await contract.methods.getCoinSymbol(j).call();
                data.push({
                    from: c1, to: c2, value: await web3.utils.fromWei(await contract.methods.priceCoinAt(i, j).call())
                })
                data.push({
                    from: c2, to: c1, value: await web3.utils.fromWei(await contract.methods.priceCoinAt(j, i).call())
                })
                
            }
        }
        console.log(data);
        chart.data = data;


        chart.dataFields.fromName = "from";
        chart.dataFields.toName = "to";
        chart.dataFields.value = "value";

        // make nodes draggable
        var nodeTemplate = chart.nodes.template;
        nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
        nodeTemplate.showSystemTooltip = true;

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
                    <div className="row mt-12" style={{ backgroundColor: '#fff' }}>
                    <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>
                    </div>
                    <div className="row mt-12" style={{ backgroundColor: '#fff' }}>
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
    }
}

export default MarketDash;
