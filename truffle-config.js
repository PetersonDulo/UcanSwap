const path = require("path");
const mnemonicPhrase = " batom destaque outubro  metade textura  viga   volante  zangado  rapadura   paulada      vogal   "; // 12 word mnemonic
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      //host: "localhost",
      host: "192.168.43.176",
      port: 7545,
      network_id: "5777" // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "^0.8.4"
    }
  }
};
