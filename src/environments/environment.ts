// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'https://staking.estatex.eu/api/user',
  stakingApiUrl: 'https://staking.estatex.eu/api/user/',
  pledgeApiUrl: 'https://pledge.estatex.eu/api/pledge/',
  adminApiUrl: 'https://staking.estatex.eu/api/admin/',
  pledgeWebUrl: 'https://pledge.estatex.eu/',
  config: {
    blockchain: "Ethereum Mainnet",
    blockchain_url: "https://goerli.etherscan.io/",
    Token		: "0x73da84ad118aea1327d0fdec3549356c963218c1",
    ETH_NETWORK : {
      StakingContractAddress: "0x5b87b33307783a6705BD76DA0a638Dcf741EEa94",
      PledgeContractAddress: "0x56c7cC9199CaCcfb00824bA2DCb71CdD5c1893D4",
      Web3Modal: {
        network: 5,
        rpcUrl:'https://rpc.ankr.com/eth_goerli',
        walletUrl:'https://rpc.ankr.com/eth_goerli',
        chainName: 'Goerli test network'
      },
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrls:'https://goerli.etherscan.io/'
    },
    BSC_NETWORK : {
      PledgeContractAddress: "0x9ba6747497b2563c2477fA278658Ed3Fe8b20A7c",
      Web3Modal: {
        network: 97,
        rpcUrl:'https://rpc.ankr.com/bsc_testnet_chapel',
        walletUrl:'https://rpc.ankr.com/bsc_testnet_chapel',
        chainName: 'Binance TestChain',
      },
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18
      },
      blockExplorerUrls:'https://testnet.bscscan.com'
    }
  }
};

