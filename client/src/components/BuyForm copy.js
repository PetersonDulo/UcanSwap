import React, { Component } from 'react'
import pesoLogo from '../peso.png'
import coinLogo from '../coin.png'
import coin1Logo from '../coin(1).png'
import Dropdown from 'react-bootstrap/Dropdown'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import DropdownButton from 'react-bootstrap/DropdownButton'

class BuyForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      output: '0',
      selected: '0',
      selected1: '1',
      accounts: props.accounts, 
      contract: props.contract,
      rate: 1,
      storageValue: " = "
    }
  }

  updateRate = async () => {
    const { accounts, contract } = this.props;
    let _nameLogos = ['MCoin', 'UCoin', 'YCoin']

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getRate(this.state.selected, this.state.selected1).call();

    // Update state with the result.
    this.setState({ storageValue: ("1 " + _nameLogos[this.state.selected] + " = " + response + " " + _nameLogos[this.state.selected1]), rate: response });
  };
  swap = async (amount) => {
    const { accounts, contract } = this.props;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    let test = await contract.methods.approve(accounts[0], true)
    //let test = await contract.methods.approve('0x8AFF144cE11a6c1A4D5172c69AcE7e18Aac51665', true)
    console.log(accounts[0])
    console.log(await contract.methods.swapTokens(this.state.selected, this.state.selected1, amount).send({ from: accounts[0] }))
    /*let selected = this.state.selected;
    let selected1 = this.state.selected1;
    const temp = await contract.methods.approve(contract.address, true).send({ from: accounts[0]},(err, txHash) => {
      console(err);
      if (!err && txHash)
        contract.methods.swapTokens(selected, selected1, amount).send({ from: accounts[0] }, (err1, txHash1) => {
          console(txHash1);
        });
    });*/
    // Update state with the result.
  };
  
  handleSelect = (e) => {
    this.setState({ selected: e });
    if (this.state.selected1==e)
      this.setState({ selected1: (e + 1) % 3});
    this.updateRate();
  }
  handleSelect1 = (e) => {
    this.setState({ selected1: e });
    if (this.state.selected == e)
      this.setState({ selected: (e + 1) % 3 });
    this.updateRate();
  }
  render() {
    let logos = [pesoLogo, coin1Logo, coinLogo]
    let nameLogos = ['MCoin', 'UCoin', 'YCoin']
    return (
      <div className="card mb-4" >

        <div className="card-body">
      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let amount
            amount = this.input.value.toString()
          //etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
            this.swap(amount)
        }}>
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
          </span>
        </div>
        <div className="input-group mb-4">
          <InputGroup>
            <FormControl
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              onChange={(event) => {
                const etherAmount = this.input.value.toString()
                this.setState({
                  output: etherAmount * this.state.rate
                })
              }}
              ref={(input) => { this.input = input }}
              className="form-control form-control-lg"
              placeholder="0"
              required
            />

            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              menuAlign={{ lg: 'right' }}
              title={<div className="">
                <img src={logos[this.state.selected]} height='32' alt="" />
                  &nbsp;&nbsp;&nbsp; {nameLogos[this.state.selected]}
            </div>}
              id="dropdown-menu-align-responsive-1"
              size="sm"
              onSelect={this.handleSelect}

            >
              <Dropdown.Item href="#" eventKey={(this.state.selected+1)%3}>
                <div className="">
                      <img src={logos[(this.state.selected + 1) % 3]} height='32' alt="" /> &nbsp;&nbsp;&nbsp; {nameLogos[(this.state.selected+1)%3]}
                  </div>
              </Dropdown.Item>
              <Dropdown.Item href="#" eventKey={(this.state.selected + 2) % 3}>
                <div className="">
                      <img src={logos[(this.state.selected + 2) % 3]} height='32' alt="" /> &nbsp;&nbsp;&nbsp; {nameLogos[(this.state.selected + 2) % 3]}
                  </div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#" disabled>
                <div className="">
                      <img src={logos[this.state.selected]} height='32' alt="" /> &nbsp;&nbsp;&nbsp; {nameLogos[this.state.selected]}
                  </div>
              </Dropdown.Item>
            </DropdownButton>
          </InputGroup>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
          </span>
        </div>
        <div className="input-group mb-2">
            <InputGroup>
              <FormControl
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                placeholder="0"
                value={this.state.output}
                size="lg"
                disabled
              />

              <DropdownButton
                as={InputGroup.Append}
                variant="outline-secondary"
                menuAlign={{ lg: 'right' }}
                title={<div className="">
                  <img src={logos[this.state.selected1]} height='32' alt="" />
                  &nbsp;&nbsp;&nbsp; {nameLogos[this.state.selected1]}
            </div>}
                id="dropdown-menu-align-responsive-2"
                size="sm"
                onSelect={this.handleSelect1}
              >
                <Dropdown.Item href="#" eventKey={(this.state.selected1 + 1) % 3}>
                  <div className="">
                      <img src={logos[(this.state.selected1 + 1) % 3]} height='32' alt="" /> &nbsp;&nbsp;&nbsp; {nameLogos[(this.state.selected1 + 1) % 3]}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item href="#" eventKey={(this.state.selected1 + 2) % 3}>
                  <div className="">
                      <img src={logos[(this.state.selected1 + 2) % 3]} height='32' alt="" /> &nbsp;&nbsp;&nbsp; {nameLogos[(this.state.selected1 + 2) % 3]}
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#" disabled>
                  <div className="">
                      <img src={logos[this.state.selected1]} height='32' alt="" /> &nbsp;&nbsp;&nbsp; {nameLogos[(this.state.selected1)]}
                  </div>
                </Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">{this.state.storageValue}</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP!</button>
          </form>
        </div>
      </div>
    );
  }
}

export default BuyForm;
