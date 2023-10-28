// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://staking.estatex.eu/api/',
  pledgeApiUrl: 'https://pledge.estatex.eu/api/',
  pledgeWebUrl: 'https://pledge.estatex.eu/',
  config: {
    base_url: "http://localhost:4200",
    blockchain: "Ethereum Mainnet",
    blockchain_url: "https://goerli.etherscan.io/",
    Token		: "0x73da84ad118aea1327d0fdec3549356c963218c1",
    ETH_NETWORK : {
      StakingContractAddress: "0x5b87b33307783a6705BD76DA0a638Dcf741EEa94",
      PledgeContractAddress: "0x63Be7845A10BAEB064ecFfB4fe58e269f4F33121",
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
      PledgeContractAddress: "0x97315D3EEbAe38C1cdAc5bee24f2806601bEbACE",
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