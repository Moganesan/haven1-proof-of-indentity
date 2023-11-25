import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

const config: HardhatUserConfig = {
  networks: {
    polygon: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: [
        "20d56a188a8505d024da58053d057131aa891be2d75942eb0ab75e1baccdc818",
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

export default config;
