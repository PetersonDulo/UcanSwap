// CdBy mand0mb3
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import 'openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol';

contract MExchange is ERC1155{

    uint32 public constant UCOIN = 0;
    uint32 public constant MCOIN = 1;
    uint32 public constant YCOIN = 2;
    uint32 public constant MAX_NUMBER_COIN = 3;
    uint32 public constant DECIMAL = 12;

    address private owner;

    struct Account{
        uint32 id;
        string name;
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
    mapping(uint32=>mapping(uint32=>uint256)) private _totalsupply;

    modifier someOneReal(address someone){
        require(someone!=address(0), "Endereco Invalido!");
        _;
    }
    modifier onlyOwner(){
        require(msg.sender==owner, "Acesso restrito apenas para Admin!");
        _;
    }
    modifier onlyReal(){
        require(msg.sender!=address(0), "Endereco Invalido!");
        _;
    }

    constructor() public ERC1155("Me2") {
        owner = msg.sender;

        _mint(msg.sender, UCOIN, 10**18, "");
        _mint(msg.sender, MCOIN, 10**18, "");
        _mint(msg.sender, YCOIN, 10**18, "");

        /*
        _mint(address(this), UCOIN, 10**15, "");
        _mint(address(this), MCOIN, 10**15, "");
        _mint(address(this), YCOIN, 10**15, "");
        totalsupply[UCOIN][MCOIN] = 0;
        totalsupply[MCOIN][UCOIN] = 0;
        totalsupply[UCOIN][YCOIN] = 0;
        totalsupply[YCOIN][UCOIN] = 0;
        totalsupply[YCOIN][MCOIN] = 0;
        totalsupply[MCOIN][YCOIN] = 0;
        */
    }

    function donateCoin(uint32 _id, string memory _name) public onlyReal returns(bool){
        proprietarios[msg.sender]=Account(_id, _name);
        return true;
    }

    function decimals() public  view returns (uint32){
        return DECIMAL;
    }

    function totalSupply(uint32 id_from, uint32 id_to) public view  returns (uint256){
        return _totalsupply[id_from][id_to];
    }
    function _balanceOf(address account, uint256 id) public  view someOneReal(account) returns (uint256){
        return balanceOf( account, id);
    }
    function transfer(address from, address to, uint32 id, uint256 amount) public onlyOwner returns (bool){
        safeTransferFrom(from, to,  id, amount, '');
        return true;
    }
    function approve(address operator, bool approved) public  returns (bool){
        setApprovalForAll( operator,  approved);
        return approved;
    }
    function getRate(uint32 id_from, uint32 id_to) public view  returns (uint256){
        return 1 + (_totalsupply[id_from][id_to]*100/10**15);
    }
    function swapTokens(uint32 id_from, uint32 id_to, uint256 amount) public payable returns(bool) {
        // Calculate the number of tokens to buy
        uint tokenAmount = amount ;//* getRate(id_from, id_to);
        uint price = getRate(id_from, id_to);
        setApprovalForAll( owner,  true);

        //transfer(msg.sender, owner, id_from, amount*price);
        //transfer(owner, msg.sender, id_to, amount*price);
        safeTransferFrom(msg.sender, owner, id_from, amount*price, '');
        safeTransferFrom(owner, msg.sender, id_to, amount*price, '');
        _totalsupply[id_from][id_to] += amount*price;

        // Emit an event
        emit TokensSwap(msg.sender, id_from, id_to, tokenAmount, price);
        return true;
    }

}

// Learn about automatic market to study formule to