import '@nomiclabs/hardhat-ethers';

const mainnetFork = {
  url: 'https://eth-mainnet.public.blastapi.io',
  blockNumber: 15632834,
};

module.exports = {
  networks: {
    hardhat: {
      chainId: 1,
      forking: mainnetFork,
      // loggingEnabled: true,
      accounts: {
        count: 1,
      },
    },
  },
};
