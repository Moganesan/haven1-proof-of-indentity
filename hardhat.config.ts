require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-solhint");
require("hardhat-contract-sizer");
require("@openzeppelin/hardhat-upgrades");
require("solidity-docgen");

module.exports = {
  networks: {
    polygon: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [
        "72a75a73567bf9f703fdf94c7d625b9b79290e6bbb879b01e5c0db14ca2ae69c",
      ],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
