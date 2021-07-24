import React, { Component, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Table } from 'react-bootstrap';
import { BoxLoading, CoffeeLoading, CircleToBlockLoading } from 'react-loadingg';

class Table_Market extends Component {
    constructor(props) {
        super(props)
        this.state = {
            coins: [],
        }
    }


    componentDidMount = () => {
        this.timer = setInterval(this.renderTableData, 5000);


    };
    componentWillUnmount = async () => {
        clearInterval(this.renderTableData);
        clearInterval(this.timer);



    };
    renderTableData = async () => {
        const { accounts, contract, web3 } = this.props;
        let symbol1 = await contract.methods.getCoinSymbol(0).call();
        let symbol2 = await contract.methods.getCoinSymbol(1).call();
        let symbol3 = await contract.methods.getCoinSymbol(2).call();

        let maxCoin = await contract.methods.getCoinsLength().call();
        let data = [];
        for (let i = 0; i < maxCoin; i++) {
            let c1 = await contract.methods.getCoinSymbol(i).call();
            for (let j = i + 1; j < maxCoin; j++) {
                let c2 = await contract.methods.getCoinSymbol(j).call();
                data.push({
                    par: c1 + " -> " + c2, price: (await contract.methods.priceCoinAt(i, j).call()) + " " + c2
                })
                data.push({
                    par: c2 + " -> " + c1, price: (await contract.methods.priceCoinAt(j, i).call()) + " " + c1
                })

            }
        }
        //console.log(document.getElementById('tbody'))
        //console.log(data)
        this.state.coins = data
        /*console.log(this.state.students)
        this.state.done = true;*/
        const element = (
            <Table striped bordered hover id='students'>
                <thead>
                    <th>Par</th>
                    <th>Preço</th>
                    <th>Historico</th>
                </thead>
                <tbody id='tbody'>
                    {this.state.coins.map(coin => <tr key={coin.id}>
                        <td>{coin.par}</td>
                        <td>{coin.price}</td>
                        <td>
                            <button
                                className="btn btn-info"
                                onClick={(event) => {
                                    this.setState({ currentForm: 'swap' })
                                }}
                            >
                                Visualizar
                            </button>
                        </td>
                    </tr>)}
                </tbody>
            </Table>
        );
        ReactDOM.render(element, document.getElementById('students'));
    }
    render() {
        return (
            <div>
                <h1 id='title'>Tabela de $$$$$$$</h1>
                <Table striped bordered hover id='students'>
                    <thead>
                        <th>Par</th>
                        <th>Preço</th>
                        <th>Historico</th>
                    </thead>
                    <tbody id='tbody'>
                        <tr><td colSpan='3'><h3>Carregando... </h3><BoxLoading/></td></tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Table_Market