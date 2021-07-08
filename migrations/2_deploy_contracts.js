//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
//var MExchange = artifacts.require("./MExchange.sol");
var Swap = artifacts.require("./Swap.sol");
var Coin1 = artifacts.require("./Coin1.sol");
var Coin2 = artifacts.require("./Coin2.sol");
var Coin3 = artifacts.require("./Coin3.sol");

module.exports = async function (deployer) {
  /*deployer.deploy(Swap).then(function () {
    temp = Swap.address;
    return Swap;
  });*/

  //deployer.deploy(Swap);
  let temp = await deployer.deploy(Swap);
  let tempAdd = await Swap.deployed();
  let temp1 = await deployer.deploy(Coin1, Swap.address, 'Yussuf Coin', 'YCoin');
  let temp2 = await deployer.deploy(Coin2, Swap.address, 'UniCoin', 'UCoin');
  let temp3 = await deployer.deploy(Coin3, Swap.address, 'Mandombe Coin', 'MCoin');
  let _s = await Coin1.deployed();
  let _ss = await Coin2.deployed();
  let _sss = await Coin3.deployed();
  let state_1 = await tempAdd.addCoin(Coin1.address);
  let state_2 = await tempAdd.addCoin(Coin2.address);
  let state_3 = await tempAdd.addCoin(Coin3.address);
};
