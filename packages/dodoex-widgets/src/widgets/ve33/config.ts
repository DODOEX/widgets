import { ChainId } from '@dodoex/api';

/**
 "WETH": "0x5300000000000000000000000000000000000011",

{
  "AERO": "0x42EDf453F8483c7168c158d28D610A58308517D1",
  "AirdropDistributor": "0x4c0dC92e49473Ad6691f34a6615FD53f8A0bDC8d",
  "ArtProxy": "0xaf6c1052A1114C7816C24a5e8bC485b180C49Deb",
  "Distributor": "0xBb5a0bF38C0BeA6829fDFef931B7988c8fF00a78",
  "FactoryRegistry": "0x620572bEE4ECF35B2FEBB1F644F939A032cd7044",
  "Forwarder": "0xB6362C3Ef78CDe47446a819B8131eC540a949EF8",
  "GaugeFactory": "0xe77C7e8fE14662e07346A8e2797fee18809aCcEa",
  "ManagedRewardsFactory": "0x69485b9B95df04dDbbF8669A33865C97E9B293B4",
  "Minter": "0xF7d33BB55C74048352DC0413733095Cc8e273A74",
  "PoolFactory": "0x2dA6Bf29baAB9Ac23Bb8E7fB04F6D9a20bbdfC82",
  "Router": "0x468e60B84b11B3B1532D7C41FcBb79DA352aa12d",
  "Voter": "0x74CAd58eD9712e3236D61dea8696B6Dced3da2b6",
  "VotingEscrow": "0x00Fc0223442630e2AaDAB831d2Ee1FD27ee8A6B2",
  "VotingRewardsFactory": "0x64e4a9BDA0670Cdb30664383244dA60158Af847B"
}
{
// https://explorer-holesky.morphl2.io/address/0x64610da3092153a188278815c1f2072009F9Df1e?tab=contract
// https://github.com/Skyewwww/aerodrome-contracts/blob/deploy-morph/contracts/Pool.sol
  // vAMM-WETH/AERO
  "Pool": "0x98EcC0D3F774a7bDA38918bf5830a476dD5A606C",
  "Gauge": "0x7B156830fDbC76d327a48a19B0143663e16A95ba",
  "FeesVotingReward": "0x0266a69Ed8D4E9ef2781BB7B1BB9437E15Cf5639",
  "BribeVotingReward": "0x6d3dCd05D0576a1379aA9587aBB4D968cF2fD8df"
}
{
  "GaugeFactory": "0xd648A03cE42bf7c7F5D4c7885eb76d89daEcB988",
  "GaugeImplementation": "0x054aC9d1DD99C49a4B3A6314717aE49D09606d46",
  "MixedQuoter": "0x9aE45C6566e4c032C119665Cfd38Eaa3f3859D06",
  "NonfungiblePositionManager": "0x2b36c1be2a16ACb71E6F6CccfCd7D20cdfE01867",
  "NonfungibleTokenPositionDescriptor": "0x0d3a1033d9F76A0bC5a444CdFB8fdE85B1290542",
  "PoolFactory": "0x0d1B0d0d709292d35AB7455fF6DBA0Eed40Cc49b",
  "PoolImplementation": "0xE2714F696039Fa207E4Fd1348d0D5bbD27fBe964",
  "Quoter": "0xB725b88b32868266782398ae7Ab6bDCcebe90368",
  "SwapFeeModule": "0x5ffDad8a7D2E9E45FCF88A0C5baDdd80a421f605",
  "SwapRouter": "0xA0abF41a231BaCeB1feB624Dca843B71c10311e8",
  "UnstakedFeeModule": "0xfa1824E71CFF5D315b63CBc91c0b859462B7EA30"
}
{
  // CL200-WETH/AERO
  "Pool": "0x2f63A87bf42dc4c021af8BE085CecE16269e3b67",
  "Gauge": "0x640be2253A65740152dC933FAb757606e9c7BD52",
  "FeesVotingReward": "0x87BA1438fa2d2Fd6aD66162B7c1afAAB25b7CE83",
  "BribeVotingReward": "0xA7a1790B8Cd1737278b464c295517408f38b4726"
}
 */

export interface Ve33Config {
  chainId: number;
  /**
   * https://explorer-holesky.morphl2.io/address/0x2dA6Bf29baAB9Ac23Bb8E7fB04F6D9a20bbdfC82?tab=contract
   */
  PoolFactory: string;
  /**
   * https://explorer-holesky.morphl2.io/address/0x0d1B0d0d709292d35AB7455fF6DBA0Eed40Cc49b
   */
  CLFactory: string;
}

export const ve33Config: Map<ChainId, Ve33Config> = new Map([
  [
    ChainId.MORPH_HOLESKY_TESTNET,
    {
      chainId: ChainId.MORPH_HOLESKY_TESTNET,
      PoolFactory: '0x2dA6Bf29baAB9Ac23Bb8E7fB04F6D9a20bbdfC82',
      CLFactory: '0x0d1B0d0d709292d35AB7455fF6DBA0Eed40Cc49b',
    },
  ],
]);
