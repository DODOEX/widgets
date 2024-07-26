import { ChainId } from '../../constants/chains';

const contractMap: {
  [key in ChainId]: {
    MULTI_CALL: string;
    DODO_APPROVE: string;
    ERC20_HELPER: string;
  };
} = {
  [ChainId.MAINNET]: {
    MULTI_CALL: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    DODO_APPROVE: '0xCB859eA579b28e02B87A1FDE08d087ab9dbE5149',
    ERC20_HELPER: '0xD9ef2d1583e8Aa196123e773BE38B539a4d149df',
  },
  [ChainId.GOERLI]: {
    MULTI_CALL: '0x696E25A5e2AEd1C55E6d6Cfa0532Bbda9020165d',
    DODO_APPROVE: '0xC9143e54021f4a6d33b9b89DBB9F458AaEdd56FB',
    ERC20_HELPER: '0x24549FC74B3076A962624A26370ed556c467F74C',
  },
  [ChainId.SEPOLIA]: {
    MULTI_CALL: '0x0fcB5237A1997C4700Ffa2BB4522EA38d4F851Fc',
    DODO_APPROVE: '0x66c45FF040e86DC613F239123A5E21FFdC3A3fEC',
    ERC20_HELPER: '0x297da061D1dE0132D241Fafed224288B34d81005',
  },
  [ChainId.BSC]: {
    MULTI_CALL: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    DODO_APPROVE: '0xa128Ba44B2738A558A1fdC06d6303d52D3Cef8c1',
    ERC20_HELPER: '0x566651Ad34f6306872FaC5fB95bbF4C9beE8D8F2',
  },
  [ChainId.POLYGON]: {
    MULTI_CALL: '0xc9eD9B18e447e600238fe50e944B9062B664DEa4',
    DODO_APPROVE: '0x6D310348d5c12009854DFCf72e0DF9027e8cb4f4',
    ERC20_HELPER: '0xfd24312Ec7871A6D1a31e454D5AbB16c6c25a9b3',
  },
  [ChainId.ARBITRUM_ONE]: {
    MULTI_CALL: '0xF718F2bd590E5621e53f7b89398e52f7Acced8ca',
    DODO_APPROVE: '0xA867241cDC8d3b0C07C85cC06F25a0cD3b5474d8',
    ERC20_HELPER: '0x7C062B9C584fA6eC2504270790D38240A2c5fE72',
  },
  [ChainId.AURORA]: {
    MULTI_CALL: '0x989DcAA95801C527C5B73AA65d3962dF9aCe1b0C',
    DODO_APPROVE: '0x335aC99bb3E51BDbF22025f092Ebc1Cf2c5cC619',
    ERC20_HELPER: '0xE8C9A78725D0451FA19878D5f8A3dC0D55FECF25',
  },
  [ChainId.OKCHAIN]: {
    MULTI_CALL: '0x5e84190a270333aCe5B9202a3F4ceBf11b81bB01',
    DODO_APPROVE: '0x7737fd30535c69545deeEa54AB8Dd590ccaEBD3c',
    ERC20_HELPER: '0x4775b1858f1e417C9609D455C3Ad8751ec01daC4',
  },
  [ChainId.OPTIMISM]: {
    MULTI_CALL: '0xb98Ac2fEFc8b73aeAE33D02BB00c26E12afCa9Df',
    DODO_APPROVE: '0xa492d6eABcdc3E204676f15B950bBdD448080364',
    ERC20_HELPER: '0x42E456ea0dd7538ea103fBb1d0388D14C97bB5b2',
  },
  [ChainId.AVALANCHE]: {
    MULTI_CALL: '0x97f0153E7F5749640aDF3Ff9CFC518b79D6Fe53b',
    DODO_APPROVE: '0xCFea63e3DE31De53D68780Dd65675F169439e470',
    ERC20_HELPER: '0xC3528D128CC227fd60793007b5e3FdF7c2945282',
  },
  [ChainId.CONFLUX]: {
    MULTI_CALL: '0x696e25a5e2aed1c55e6d6cfa0532bbda9020165d',
    DODO_APPROVE: '0x5BaF16d57620Cb361F622232F3cb4090e35F3da2',
    ERC20_HELPER: '0x24549FC74B3076A962624A26370ed556c467F74C',
  },
  [ChainId.BASE]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0x89872650fA1A391f58B4E144222bB02e44db7e3B',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',
  },
  [ChainId.LINEA]: {
    MULTI_CALL: '0xa7b9C3a116b20bEDDdBE4d90ff97157f67F0bD97',
    DODO_APPROVE: '0x6de4d882a84A98f4CCD5D33ea6b3C99A07BAbeB1',
    ERC20_HELPER: '0xbcd2FDC3B884Cf0dfD932f55Ec2Fe1fB7e8c62Da',
  },
  [ChainId.SCROLL]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0x20E77aD760eC9E922Fd2dA8847ABFbB2471B92CD',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',
  },
  [ChainId.MANTA]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0x0226fCE8c969604C3A0AD19c37d1FAFac73e13c2',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',
  },
  [ChainId.MANTLE]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0xa71415675F68f29259ddD63215E5518d2735bf0a',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',
  },
  [ChainId.DODO_CHAIN_TESTNET]: {
    MULTI_CALL: '0xD0CF7dfbF09CAfaB8AEf00e0Ce19a4638004a364',
    DODO_APPROVE: '0x82B26eb18382f7532015248078AB1f6030413396',
    ERC20_HELPER: '0xE6cecb7460c9E52aA483cb1f0E87d78D7085686F',
  },
};

export default contractMap;
