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
    blockchain_url: "https://etherscan.io/",
    Token		: "0x4ad006e61d77453ce99f6e24ba45d59e1c194644",
    ETH_NETWORK : {
      PledgeContractAddress: "0x5EEee8B304Ad51447736F74A5675c2cB070e52A7",
      Web3Modal: {
        network: 1,
        rpcUrl:'https://rpc.ankr.com/eth/44f6564e08e537851827bcb2f908fbe9b409f6a885a8dd912289c47155194960',
        walletUrl:'https://rpc.ankr.com/eth/44f6564e08e537851827bcb2f908fbe9b409f6a885a8dd912289c47155194960',
        chainName: 'Ethereum Mainnet'
      },
      nativeCurrency: {
        name: 'Ethereum',
        symbol: 'ETH',
        decimals: 18
      },
      blockExplorerUrls:'https://etherscan.io/'
    },
    BSC_NETWORK : {
      StakingContractAddress: "0x5EEee8B304Ad51447736F74A5675c2cB070e52A7",
      PledgeContractAddress: "0x07d086Cc91BD3aad22C6ff76AFF6aefe15763258",
      Web3Modal: {
        network: 56,
        rpcUrl:'https://rpc.ankr.com/bsc/44f6564e08e537851827bcb2f908fbe9b409f6a885a8dd912289c47155194960',
        walletUrl:'https://rpc.ankr.com/bsc/44f6564e08e537851827bcb2f908fbe9b409f6a885a8dd912289c47155194960',
        chainName: 'Binance Smartchain',
      },
      nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18
      },
      blockExplorerUrls:'https://bscscan.com'
    }
  }
};