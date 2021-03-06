import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Swap from "./contracts/Swap.json";
import getWeb3 from "./getWeb3";
import { BoxLoading, CoffeeLoading, CircleToBlockLoading } from 'react-loadingg';
import Main from './components/Main'
import Navbar from './components/Navbar'
import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Swap.networks[networkId];
      const instance = new web3.eth.Contract(
        Swap.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods._balanceOf(accounts[0], 1).call();

    // Update state with the result.
    //this.setState({ storageValue: response });
  };

  render() {
    let content
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...<CircleToBlockLoading /></div>;
    } else {
      content = <Main
        accounts={this.state.accounts }
        contract={this.state.contract}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        web3={this.state.web3}
      />
    }
    return (
      <div className="App">
        <div>
          <Navbar account={this.state.account} />
          <div className="container-fluid mt-5">
            <div className="row">
              <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1000px' }}>
                <div className="content mr-auto ml-auto">

                  {content}

                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
