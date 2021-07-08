import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'
import ADashboards from './ADashboards'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'swap'
    }
  }

  render() {
    let content
    if(this.state.currentForm === 'swap') {
      content = <BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
        accounts={this.props.accounts}
        contract={this.props.contract}
      />
    } else if (this.state.currentForm === 'dashboard') {
      content = <ADashboards
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
        accounts={this.props.accounts}
        contract={this.props.contract}
      />
    }

    return (
      <div id="content" className="mt-3">

        <div className="d-flex justify-content-between mb-3">
          <button
              className="btn btn-light"
              onClick={(event) => {
                this.setState({ currentForm: 'swap' })
              }}
            >
            Swap
          </button>
          <span className="text-muted">&lt; &nbsp; &gt;</span>
          <button
            className="btn btn-light"
            onClick={(event) => {
              this.setState({ currentForm: 'dashboard' })
            }}
          >
            Dashboard
          </button>
        </div>


        {content}

      </div>
    );
  }
}

export default Main;
