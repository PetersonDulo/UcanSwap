// CdBy mand0mb3
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';


contract Swap{

    address private owner;

    struct Account{
        uint32 id;
        string name;
        bool received;
        //uint256 balance;
    }

    event TokensSwap(
        address account,
        uint id_from,
        uint id_to,
        uint amount,
        uint rate
    );

    mapping(address=>Account) private proprietarios;
    mapping(address=>uint256) private max;
    mapping(address=>mapping(address=>uint256)) private rates;

    address[] private coins;
    uint256 private price = 10;

    modifier onlyOwner(){
        require(msg.sender==owner, "Acesso restrito apenas para Admin!");
        _;
    }
    modifier onlyReal(){
        require(msg.sender!=address(0), "Endereco Invalido!");
        _;
    }

    constructor(){
        owner = msg.sender;
    }

    function signUp(uint32 id_, string memory name_) public onlyReal returns(bool){
        require(proprietarios[msg.sender].id==0,"Conta existente");
        proprietarios[msg.sender]=Account({id:id_, name:name_, received:false});
        for (uint256 index = 0; index < coins.length; index++) {
            ERC20 temp = ERC20(coins[index]);
            temp.approve(address(this),10**10);
        }
        return true;
    } 


    function donateCoin(address student, uint256 amount) public onlyOwner returns(bool){
        require(proprietarios[student].received==false, "Conta ja doada");
        for (uint256 index = 0; index < coins.length; index++) {
            ERC20 temp = ERC20(coins[index]);
            temp.transferFrom(owner,student,amount);
        }
        proprietarios[student].received=true;
        return true;
    } 

    function addCoin(address coin) public returns(bool){
        require(keccak256(bytes(ERC20(coin).name()))!=keccak256(bytes("")), "Endereco da Coin Invalido");
        for (uint256 index = 0; index < coins.length; index++) {
            if (coin == coins[index]) return false;
        }
        coins.push(coin);
        max[coin]=ERC20(coin).balanceOf(address(this))/10**ERC20(coin).decimals();
        return true;
    }

    function priceCoin(address _coinFrom, address _coinTo) public view returns(uint256){
        return price +  price*(rates[_coinFrom][_coinTo]*100/max[_coinTo]);
    }
    function getRate(address _coinFrom, address _coinTo) public view returns(uint256){
        return rates[_coinFrom][_coinTo];
    }
    function getMax(address _coinFrom) public view returns(uint256){
        return max[_coinFrom];
    }

    function swap(address _coinFrom, address _coinTo, uint256 amount) public returns(bool){
        ERC20 coinFrom_ = ERC20(_coinFrom);
        ERC20 coinTo_ = ERC20(_coinTo);

        uint256 temp_price = price +  price*(rates[_coinFrom][_coinTo]*100/max[_coinTo]);
        coinFrom_.approve(address(this), amount);
        coinFrom_.transferFrom(msg.sender, address(this), amount);
        sendCoin(msg.sender, coinTo_, amount/temp_price);
        rates[_coinFrom][_coinTo] += amount/temp_price;

        
        return true;
    }

    function sendCoin(address target, ERC20 coinTo_, uint256 amount) internal virtual{
        coinTo_.transfer(target, amount);
    }

}

// Learn about automatic market to study formule to