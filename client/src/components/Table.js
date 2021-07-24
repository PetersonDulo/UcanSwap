import React, { Component, useState,useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Table } from 'react-bootstrap';
import { BoxLoading, CoffeeLoading, CircleToBlockLoading } from 'react-loadingg';

class Table_ extends Component {
    constructor(props) {
        super(props)
        this.state = {
            students: [],
            counter: null,
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

        let maxUser = await contract.methods.getStudentsLength().call();
        let data = [];
        for (let index = 0; index < maxUser; index++) {
            let temp = (await contract.methods.getStudent(index).call())
            data.push({
                id: temp[0],
                name: temp[1],
                amountY: await web3.utils.fromWei(await contract.methods.balanceOfAt(index, 0).call()),
                amountU: await web3.utils.fromWei(await contract.methods.balanceOfAt(index, 1).call()),
                amountM: await web3.utils.fromWei(await contract.methods.balanceOfAt(index, 2).call())
            })
        }
        //console.log(document.getElementById('tbody'))
        //console.log(data)
        this.state.students = data
        /*console.log(this.state.students)
        this.state.done = true;*/
        const element = (
            <Table striped bordered hover id='students'>
                <thead>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>UCoin</th>
                    <th>YCoin</th>
                    <th>MCoin</th>
                </thead>
                <tbody id='tbody'>
                    
                    {this.state.students.map(student => <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.name}</td>
                        <td>{student.amountU}</td>
                        <td>{student.amountY}</td>
                        <td>{student.amountM}</td>
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
                        <th>Id</th>
                        <th>Nome</th>
                        <th>UCoin</th>
                        <th>YCoin</th>
                        <th>MCoin</th>
                    </thead>
                    <tbody id='tbody'>
                        <tr><td colSpan='5'><h3>Carregando... </h3><BoxLoading /></td></tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Table_