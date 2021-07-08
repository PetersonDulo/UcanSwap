// CdBy mand0mb3
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';


contract Coin2 is ERC20{

    address private owner;

    constructor(address exchange_, string memory name_, string memory symbol_) public ERC20(name_,symbol_) {
        owner = msg.sender;
        _mint(exchange_, 10**18);
        _mint(msg.sender, 10**18);
        approve(exchange_, 10**15);
    }

}

// Learn about automatic market to study formule to