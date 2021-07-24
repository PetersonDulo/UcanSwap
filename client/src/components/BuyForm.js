import React, { Component } from 'react'
import pesoLogo from '../peso.png'
import coinLogo from '../coin.png'
import coin1Logo from '../coin(1).png'
import Table_ from './Table'
import { BoxLoading, CoffeeLoading, CircleToBlockLoading } from 'react-loadingg';

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accounts: props.accounts, 
      contract: props.contract,
      students: [],
      done:false
    }
  }

  
  isdone = async () =>{
    if (this.state.done) return true;
    else return false;
  }
  render() {
    let logos = [pesoLogo, coin1Logo, coinLogo]
    let nameLogos = ['MCoin', 'UCoin', 'YCoin']
    console.log(11111111111111)
    console.log(this.state.students)
    return (
      <div className="card mb-4" >

        <div className="card-body">
          <div>"sw->0xa58252F181a4A703ef0684aA6161A3fB571DE195
          c1->0xBbA50782e4d1066A865F67e2Bb8B60Bf1959fE85
          c2->0xC0b74357d95fA3e899F1dc1f4d8f3895BfAcE851
          c3->0x23212a6B2378dA11A18Fc06a1a7AB9D595c26638
          --->0xD605F3Ab23699AC513464B3a710fF3b8c58fb474

          "</div>
          <Table_
            accounts={this.props.accounts}
            contract={this.props.contract}
            web3={this.props.web3}
            />
        </div>
      </div>
    );
  }
}

export default BuyForm;
