// CdBy mand0mb3
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

//import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol";
import 'openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';
import './ABDKMathQuad.sol';
import './Coin1.sol';

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
        address id_from,
        address id_to,
        uint amount,
        uint rate
    );

    event Approve(address _coinFrom, uint256 amount);

    mapping(address=>Account) private proprietarios;
    mapping(address=>uint256) private max;
    mapping(address=>uint256) private iCapital;
    mapping(address=>mapping(address=>uint256)) private rates;

    address[] private coins;
    address[] private students;
    uint256 private price = 1*(uint256(10)**18);
    uint256 constant fee = 34*(uint256(10)**16);

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
//OBS ADD EVENTS ON THE FUNCTIONS---------------->
    function signUp(uint32 id_, string memory name_) public onlyReal returns(bool){
        require(proprietarios[msg.sender].id==0,"Conta existente");
        require(proprietarios[msg.sender].id!=id_,"Conta existente_");
        for (uint256 index = 0; index < students.length; index++) {
            //if (proprietarios[students[index]].id == id_) return false;
            require(proprietarios[students[index]].id!=id_,"Id Existente!");
        }
        
        for (uint256 index = 0; index < coins.length; index++) {
            ERC20 temp = ERC20(coins[index]);
            temp.transferFrom(owner,msg.sender,2000*(uint256(10)**18));
        }
        students.push(msg.sender);
        proprietarios[msg.sender]=Account({id:id_, name:name_, received:true});
        return true;
    } 


    function donateCoin(address student, uint256 amount) public onlyOwner returns(bool){
        require(proprietarios[student].received==false, "Conta ja doada");
        for (uint256 index = 0; index < coins.length; index++) {
            ERC20 temp = ERC20(coins[index]);
            temp.transferFrom(owner,student,amount*(uint256(10)**18));
        }
        proprietarios[student].received=true;
        return true;
    } 

    function addCoin(address coin) public returns(bool){
        require(keccak256(bytes(ERC20(coin).name()))!=keccak256(bytes("")), "Endereco da Coin Invalido");
        for (uint256 index = 0; index < coins.length; index++) {
            if (coin == coins[index]) return false;
            /*for (uint256 index_ = index+1; index_ < coins.length; index_++) {
                initPar(coins[index],coins[index_]);
            }*/
        }
        coins.push(coin);
        max[coin]=div(ERC20(coin).balanceOf(address(this)),10**ERC20(coin).decimals());
        iCapital[coin]=ERC20(coin).balanceOf(address(this));
        return true;
    }

    function getPercent(address _coinFrom) public view returns(uint256){
        ERC20 temp = ERC20(_coinFrom);
        uint256 val1;
        uint256 val2;
        uint256 i_capital = iCapital[_coinFrom];
        uint256 balance_of = temp.balanceOf(address(this));
        if (iCapital[_coinFrom] > temp.balanceOf(address(this))){
            val1 = iCapital[_coinFrom];
            val2 = balance_of;
        }
        else {
            val1 = balance_of;
            val2 = iCapital[_coinFrom];
        }
        return (val1 - val2) * 100 / iCapital[_coinFrom] ;//+ div(rates[_coinFrom][_coinTo],fee);
    }

    function priceCoin(address _coinFrom, address _coinTo) public view returns(uint256){
        if (rates[_coinFrom][_coinTo]<=0) return 1*(uint256(10)**18);
        ERC20 temp = ERC20(_coinTo);
        uint256 i_capital = iCapital[_coinTo];
        uint256 balance_of = temp.balanceOf(address(this));
        if (i_capital > balance_of){
            return rates[_coinFrom][_coinTo] + rates[_coinFrom][_coinTo]*getPercent(_coinTo) ;
        }
        //return 1*(uint256(10)**17) + div(rates[_coinFrom][_coinTo],fee);
        return rates[_coinFrom][_coinTo] - rates[_coinFrom][_coinTo]*getPercent(_coinTo) ;//+ div(rates[_coinFrom][_coinTo],fee);
    }

    function priceCoinAt(uint index_1, uint index_2) public view returns(uint256){
        require(index_1<getCoinsLength(),"Index Out of Range");
        require(index_2<getCoinsLength(),"Index Out of Range");
        uint256 temp = rates[coins[index_1]][coins[index_2]];
        if (temp<=0) return 1*(uint256(10)**18);
        uint256 percent = getPercent(coins[index_2]);
        ERC20 temp_ = ERC20(coins[index_2]);
        if (iCapital[coins[index_2]] > temp_.balanceOf(address(this))){
            return temp + (temp*percent) ;
        }
        //return 1*(uint256(10)**17) + div(rates[coins[index_1]][coins[index_2]],fee);
        return temp - (temp * percent); //+ div(rates[coins[index_1]][coins[index_2]],fee);
    }
    function getRate(address _coinFrom, address _coinTo) public view returns(uint256){
        return rates[_coinFrom][_coinTo];
    }
    function getMax(address _coinFrom) public view returns(uint256){
        return max[_coinFrom];
    }
    function getStudentsLength() public view returns(uint256){
        return students.length;
    }
    function getCoinsLength() public view returns(uint256){
        return coins.length;
    }
    function getStudent(uint256 index) public view returns(Account memory){
        require(index<getStudentsLength(),"Index Out of Range");
        return proprietarios[students[index]];
    }
    function getCoinSymbol(uint256 index) public view returns(string memory){
        require(index<getCoinsLength(),"Index Out of Range");
        return ERC20(coins[index]).symbol();
    }
    function approve(address _coinFrom, uint256 amount) public virtual {
        require(msg.sender!=address(this),"Invalid Operation");
        ERC20 coinFrom_ = ERC20(_coinFrom);
        coinFrom_.increaseAllowance(address(this), amount*(10**uint256(18)));
        emit Approve(address(this), amount*(10**uint256(18)));
    }
    function approveAt(uint256 _coinFrom, uint256 amount) public virtual {
        require(_coinFrom<getCoinsLength(),"Index Out of Range");
        require(msg.sender!=address(this),"Invalid Operation");
        ERC20 coinFrom_ = ERC20(coins[_coinFrom]);
        coinFrom_.increaseAllowance(address(this), amount*(10**uint256(18)));
        emit Approve(address(this), amount*(10**uint256(18)));
    }
    function balanceOf(address _coinFrom) public view onlyReal returns(uint256){
        ERC20 coinFrom_ = ERC20(_coinFrom);
        return coinFrom_.balanceOf(msg.sender);
    }
    function balanceOfAt(uint256 index_U, uint256 index_C) public view onlyReal returns(uint256){
        require(index_C<getCoinsLength(),"Index Out of Range");
        require(index_U<getStudentsLength(),"Index Out of Range");
        ERC20 coinFrom_ = ERC20(coins[index_C]);
        return coinFrom_.balanceOf(students[index_U]);
    }

    function swap(address _coinFrom, address _coinTo, uint256 amount) public returns(bool){
        ERC20 coinFrom_ = ERC20(_coinFrom);
        ERC20 coinTo_ = ERC20(_coinTo);

        if (rates[_coinFrom][_coinTo]<=0) rates[_coinFrom][_coinTo]=1*(uint256(10)**18);
        if (rates[_coinTo][_coinFrom]<=0) rates[_coinTo][_coinFrom]=1*(uint256(10)**18);
        
        uint256 temp_ = priceCoin(_coinFrom, _coinTo);
        require(amount>=temp_, "Valor insuficente para swap");
        uint256 value_to_pay = div(amount,div(temp_,1*(uint256(10)**18)));
        coinFrom_.transferFrom(msg.sender, address(this), amount);//mul(amount,(uint256(10)**18)));
        sendCoin(msg.sender, coinTo_, value_to_pay);
        //sendCoin(msg.sender, coinTo_, value_to_pay - div(fee*100,value_to_pay));
        //temp_ +=  div(/*mul(*/amount/*,(uint256(10)**18)) */,rates[_coinFrom][_coinTo]);

        rates[_coinFrom][_coinTo] = priceCoin(_coinFrom, _coinTo);
        rates[_coinTo][_coinFrom] = priceCoin(_coinTo, _coinFrom);
        emit TokensSwap(
            msg.sender, _coinFrom, _coinTo, amount, fee
        );
    }

    function sendCoin(address target, ERC20 coinTo_, uint256 amount) internal virtual{
        coinTo_.transfer(target, amount);
    }

    function initPar(address _coinFrom, address _coinTo) internal virtual{
        if (rates[_coinFrom][_coinTo]<=0) rates[_coinFrom][_coinTo]=1*(uint256(10)**18);
        if (rates[_coinTo][_coinFrom]<=0) rates[_coinTo][_coinFrom]=1*(uint256(10)**18);
    }

    function div(uint256 x, uint256 y) public pure returns(uint256){
        return ABDKMathQuad.toUInt(
            ABDKMathQuad.div(ABDKMathQuad.fromUInt(x),ABDKMathQuad.fromUInt(y))
        );
    }

    function mul(uint256 x, uint256 y) public pure returns(uint256){
        return ABDKMathQuad.toUInt(
            ABDKMathQuad.mul(ABDKMathQuad.fromUInt(x),ABDKMathQuad.fromUInt(y))
        );
    }

    function value(uint256 a) public pure returns (uint256) {
        return mul(a ,(uint256(10)**10));
    }

}

// Learn about automatic market to study formule to