import {
  morph,
  nero,
  neox,
  plume,
  plumeTestnet,
  arbsepolia,
  riseTestnet,
  bitlayer,
  zircuitMainnet,
  xLayer,
  zeroMainnet,
  hashkey,
  hemi,
  pharosTestnet,
} from '@dodoex/dodo-contract-request';
import { ChainId } from './chain';

const contractMap: {
  [key in ChainId]: {
    /** MulticallWithValid */
    MULTI_CALL: string;
    DODO_APPROVE: string;
    /** ERC20Helper */
    ERC20_HELPER: string;

    /** DODOV2RouteHelper */
    ROUTE_V2_DATA_FETCH: string;
    /** DODOV1PmmHelper */
    ROUTE_V1_DATA_FETCH: string;
    /** DODOCalleeHelper */
    CALLEE_HELPER: string;
    /** DODOV2Proxy02 */
    DODO_PROXY: string;
    /** DODODspProxy */
    DODO_DSP_PROXY: string;
    /** DODODppProxy */
    DODO_DPP_PROXY: string;
    /** DODOV1Proxy */
    DODO_V1_PAIR_PROXY?: string;

    /** DODOMineV3Proxy */
    DODO_MINEV3_PROXY: string;
  };
} = {
  [ChainId.MAINNET]: {
    MULTI_CALL: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
    DODO_APPROVE: '0xCB859eA579b28e02B87A1FDE08d087ab9dbE5149',
    ERC20_HELPER: '0x4F99cba8aAEad26fc970dc6CC4ea435779Fa9016',

    ROUTE_V2_DATA_FETCH: '0x9337cA090c390667984869193e10c3D4f9a17da8',
    ROUTE_V1_DATA_FETCH: '0x6373ceB657C83C91088d328622573FB766064Ac4',
    CALLEE_HELPER: '0x45a7E2E9D780613E047f7e78a9d3902ff854B522',

    DODO_PROXY: '0xa356867fDCEa8e71AEaF87805808803806231FdC',
    DODO_DSP_PROXY: '0x4599ed18F34cFE06820E3684bF0aACB8D75c644d',
    DODO_DPP_PROXY: '0xfF7C8F518e6f1435957ed3d3E0692C94676dAE7a',
    DODO_V1_PAIR_PROXY: '0x8dD0Fea5FA2f7df535F87f312641Cc15d8B151BA',
    DODO_MINEV3_PROXY: '0x0d9685D4037580F68D9F77B08971f17E1000bBdc',
  },
  [ChainId.GOERLI]: {
    MULTI_CALL: '0x696E25A5e2AEd1C55E6d6Cfa0532Bbda9020165d',
    DODO_APPROVE: '0xC9143e54021f4a6d33b9b89DBB9F458AaEdd56FB',
    ERC20_HELPER: '0x24549FC74B3076A962624A26370ed556c467F74C',

    ROUTE_V2_DATA_FETCH: '0x7E9c460d0A10bd0605B15F0d0388e307d34a62E6',
    ROUTE_V1_DATA_FETCH: '0xAC716E87b0853C0712674e8E3a8435a489F276b4',
    CALLEE_HELPER: '0x5B2fd46E6E3Ff1E479d651ec0b210882Aa9871dF',

    DODO_PROXY: '0xbce44767af0a53A108b3B7ba4F740E03D228Ec0A',
    DODO_DSP_PROXY: '0x8d9ccc26CbF3D49bbA76E9920C3E6ed29e06b5cc',
    DODO_DPP_PROXY: '0xc4A1a152812dE96b2B1861E433f42290CDD7f113',
    DODO_MINEV3_PROXY: '0x99d69565EdA438E3ebAA0627A407968ABD0f755b',
  },
  [ChainId.SEPOLIA]: {
    MULTI_CALL: '0x0fcB5237A1997C4700Ffa2BB4522EA38d4F851Fc',
    DODO_APPROVE: '0x66c45FF040e86DC613F239123A5E21FFdC3A3fEC',
    ERC20_HELPER: '0x297da061D1dE0132D241Fafed224288B34d81005',

    ROUTE_V2_DATA_FETCH: '0x03e89fC55A5ad0531576E5a502c4CA52c8bf391B',
    ROUTE_V1_DATA_FETCH: '0x3dD629473A2eD7f3C6299FFD9F3e0C283d073f11',
    CALLEE_HELPER: '0xCD536b4DECFD2fa0443666B6becD145F8aDe2E48',

    DODO_PROXY: '0x6292e8f7647b3b9dDf5795b1Fb77D0187e30E0F9',
    DODO_DSP_PROXY: '0x987bFBE33c9cF18cAA665B792Db66339a9c16D32',
    DODO_DPP_PROXY: '0x5e1251f4873248a030e1c92FFEB133AF1513277f',

    DODO_MINEV3_PROXY: '0xBbD59b9316eE65526DbBdEc2A748Cc05A285d54C',
  },
  [ChainId.BSC]: {
    MULTI_CALL: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
    DODO_APPROVE: '0xa128Ba44B2738A558A1fdC06d6303d52D3Cef8c1',
    ERC20_HELPER: '0x5B9E4c3056227C316a3da3296031DdC7a8d6a867',

    // ROUTE_V2_DATA_FETCH: "0xf2cd74A4206E6A4281c709c0274e2d0e286Cd617",//origin
    ROUTE_V2_DATA_FETCH: '0x35b8F92AcFE368afb90d37555f6d075Fc569a6BA', // "0xd9d39391959e281284512b71bf79E0c88e9c4468",cutting
    ROUTE_V1_DATA_FETCH: '0x2BBD66fC4898242BDBD2583BBe1d76E8b8f71445',
    CALLEE_HELPER: '0x2673E5333620bb22BD1bFB3af9Fc7012008E3b4B',

    DODO_PROXY: '0x8F8Dd7DB1bDA5eD3da8C9daf3bfa471c12d58486',
    DODO_DSP_PROXY: '0x2442A8B5cdf1E659F3F949A7E454Caa554D4E65a',
    DODO_DPP_PROXY: '0x624FC8368fE11BE00D8B2F3fE0B9D0053BEc21b9',
    DODO_V1_PAIR_PROXY: '0x4Fc222194862081866FC636893DDeCB3E4341A10',
    DODO_MINEV3_PROXY: '0x8f3fB1f9148dC473453163bF31de1d830Eb5c590',
  },
  [ChainId.POLYGON]: {
    MULTI_CALL: '0xc9eD9B18e447e600238fe50e944B9062B664DEa4',
    DODO_APPROVE: '0x6D310348d5c12009854DFCf72e0DF9027e8cb4f4',
    ERC20_HELPER: '0xfd24312Ec7871A6D1a31e454D5AbB16c6c25a9b3',

    ROUTE_V2_DATA_FETCH: '0x1870854754d1E76C58B0a56a153E12Ff868eE3C6', // "0xF077f9fB6a48d8722247C544c0C66AE0D7505d66",
    // ROUTE_V2_DATA_FETCH: "0x494C11BaC7699C1c780E2fFeeFc443B6B62bc35C",//cuttingHelper
    ROUTE_V1_DATA_FETCH: '0x18DFdE99F578A0735410797e949E8D3e2AFCB9D2',
    CALLEE_HELPER: '0x261F6cF4dF0e5c1432739cDAFD9299150FEd3dFc',

    DODO_PROXY: '0xa222e6a71D1A1Dd5F279805fbe38d5329C1d0e70',
    DODO_DSP_PROXY: '0xA3dfF6ae0F73f0970E31Da63B3736F7D3CEF683e',
    DODO_DPP_PROXY: '0xF6f1A1Ef2f5b56bb289993F75C12Eb41e4abC2f7',
    DODO_V1_PAIR_PROXY: '0x58E27C46c162F2a781d750BbE1119E1b2DfE82e0',
    DODO_MINEV3_PROXY: '0x47a65e74dd6b6B5E3243dBb01EDEd9D55ba234Ad',
  },
  [ChainId.ARBITRUM_ONE]: {
    MULTI_CALL: '0xF718F2bd590E5621e53f7b89398e52f7Acced8ca',
    DODO_APPROVE: '0xA867241cDC8d3b0C07C85cC06F25a0cD3b5474d8',
    ERC20_HELPER: '0x7C062B9C584fA6eC2504270790D38240A2c5fE72',

    ROUTE_V2_DATA_FETCH: '0x0C420970b2e5efcBB6e833601772D6E707155eA6',
    ROUTE_V1_DATA_FETCH: '0x4EE6398898F7FC3e648b3f6bA458310ac29cD352',
    CALLEE_HELPER: '0xe3B40F8D8346d428EAB28d9Fd672b784d921cfBD',

    DODO_PROXY: '0x88CBf433471A0CD8240D2a12354362988b4593E5',
    DODO_DSP_PROXY: '0x36E5238B4479d1ba0bFE47550B0B8e4f4f500EAA',
    DODO_DPP_PROXY: '0xE8C9A78725D0451FA19878D5f8A3dC0D55FECF25',
    DODO_V1_PAIR_PROXY: '0x49186E32fEd50fd6B5604A2618c7B0b03Cd41414',
    DODO_MINEV3_PROXY: '0x7E820457780Ac99B9A042Cd5f875b274855A1eE9',
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    MULTI_CALL: arbsepolia.MulticallWithValid,
    DODO_APPROVE: arbsepolia.DODOApprove,
    ERC20_HELPER: arbsepolia.ERC20Helper,

    ROUTE_V2_DATA_FETCH: arbsepolia.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: arbsepolia.DODOV1PmmHelper,
    CALLEE_HELPER: arbsepolia.DODOCalleeHelper,

    DODO_PROXY: arbsepolia.DODOV2Proxy02,
    DODO_DSP_PROXY: arbsepolia.DODODspProxy,
    DODO_DPP_PROXY: arbsepolia.DODODppProxy,
    DODO_MINEV3_PROXY: arbsepolia.DODOMineV3ProxyWithoutPlatform,
  },
  [ChainId.AURORA]: {
    MULTI_CALL: '0x989DcAA95801C527C5B73AA65d3962dF9aCe1b0C',
    DODO_APPROVE: '0x335aC99bb3E51BDbF22025f092Ebc1Cf2c5cC619',
    ERC20_HELPER: '0xE8C9A78725D0451FA19878D5f8A3dC0D55FECF25',

    ROUTE_V2_DATA_FETCH: '0x49eAB58AAE044F31d3b136212058a00b282b2845',
    ROUTE_V1_DATA_FETCH: '0xbAb9F4ff4A19a0e8EEBC56b06750253228ffAc6E',
    CALLEE_HELPER: '0x738Ebf387A0CE0eb46b0eF8Fa5DEa2EaE6B1Df51',

    DODO_PROXY: '0xd9deC7c3C06e62a4c1BeEB07CadF568f496b14c2',
    DODO_DSP_PROXY: '0x53233ABD9108761258a4B6B7822abFD6716B129B',
    DODO_DPP_PROXY: '0x357c5E9cfA8B834EDcef7C7aAbD8F9Db09119d11',
    DODO_MINEV3_PROXY: '0x4775b1858f1e417C9609D455C3Ad8751ec01daC4',
  },
  [ChainId.OKCHAIN]: {
    MULTI_CALL: '0x5e84190a270333aCe5B9202a3F4ceBf11b81bB01',
    DODO_APPROVE: '0x7737fd30535c69545deeEa54AB8Dd590ccaEBD3c',
    ERC20_HELPER: '0x4775b1858f1e417C9609D455C3Ad8751ec01daC4',

    ROUTE_V2_DATA_FETCH: '0x10Dd6d8A29D489BEDE472CC1b22dc695c144c5c7',
    ROUTE_V1_DATA_FETCH: '0xDfaf9584F5d229A9DBE5978523317820A8897C5A',
    CALLEE_HELPER: '0x3CD6D7F5fF977bf8069548eA1F9441b061162b42',

    DODO_PROXY: '0x6B4Fa0bc61Eddc928e0Df9c7f01e407BfcD3e5EF',
    DODO_DSP_PROXY: '0x5515363c0412AdD5c72d3E302fE1bD7dCBCF93Fe',
    DODO_DPP_PROXY: '0xa222e6a71D1A1Dd5F279805fbe38d5329C1d0e70',
    DODO_MINEV3_PROXY: '0x958f79e2998DFe417208b9A07D799265B0298e58',
  },
  [ChainId.OPTIMISM]: {
    MULTI_CALL: '0xb98Ac2fEFc8b73aeAE33D02BB00c26E12afCa9Df',
    DODO_APPROVE: '0xa492d6eABcdc3E204676f15B950bBdD448080364',
    ERC20_HELPER: '0x42E456ea0dd7538ea103fBb1d0388D14C97bB5b2',

    ROUTE_V2_DATA_FETCH: '0xC48A8e689a644de96F80786ACb69E6F76D057F25',
    ROUTE_V1_DATA_FETCH: '0x6281E0628eb2B37fE9943279EA39725D5f0E0dBe',
    CALLEE_HELPER: '0x0BD7426f008737FeeD575ED8e2aA1bd4Fc49112D',

    DODO_PROXY: '0xfD9D2827AD469B72B69329dAA325ba7AfbDb3C98',
    DODO_DSP_PROXY: '0x61721e89a498dADa7aD579482BDC2aE60a9C5D54',
    DODO_DPP_PROXY: '0x51A70a33655FE1c5fae3286890DcE3bE332E85dD',
    DODO_MINEV3_PROXY: '0xaEdbD08D92ECccaA9A93b1A8D66D1d356e470c78',
  },
  [ChainId.AVALANCHE]: {
    MULTI_CALL: '0x97f0153E7F5749640aDF3Ff9CFC518b79D6Fe53b',
    DODO_APPROVE: '0xCFea63e3DE31De53D68780Dd65675F169439e470',
    ERC20_HELPER: '0xC3528D128CC227fd60793007b5e3FdF7c2945282',

    ROUTE_V2_DATA_FETCH: '0x686984f0aa37585504f51DEbA0Eb45B0f0CB7e4a',
    ROUTE_V1_DATA_FETCH: '0x790B4A80Fb1094589A3c0eFC8740aA9b0C1733fB',
    CALLEE_HELPER: '0x4EfF1D851366b8cc51d553a87e2d12dA8Da46F2a',

    DODO_PROXY: '0x2cD18557E14aF72DAA8090BcAA95b231ffC9ea26',
    DODO_DSP_PROXY: '0xeCEaDe494FD5F913Fd937C5CAc4577236395Dc32',
    DODO_DPP_PROXY: '0xe44F14BFDe673B7339734a28152cCd6b821753C9',
    DODO_MINEV3_PROXY: '0x5D6e6A0BFB2176AFCc4FB809822D8e009216b245',
  },
  [ChainId.CONFLUX]: {
    MULTI_CALL: '0x696e25a5e2aed1c55e6d6cfa0532bbda9020165d',
    DODO_APPROVE: '0x5BaF16d57620Cb361F622232F3cb4090e35F3da2',
    ERC20_HELPER: '0x24549FC74B3076A962624A26370ed556c467F74C',

    ROUTE_V2_DATA_FETCH: '0x7E9c460d0A10bd0605B15F0d0388e307d34a62E6',
    ROUTE_V1_DATA_FETCH: '0xAC716E87b0853C0712674e8E3a8435a489F276b4',
    CALLEE_HELPER: '0x5B2fd46E6E3Ff1E479d651ec0b210882Aa9871dF',

    DODO_PROXY: '0xbce44767af0a53A108b3B7ba4F740E03D228Ec0A',
    DODO_DSP_PROXY: '0x8d9ccc26cbf3d49bba76e9920c3e6ed29e06b5cc',
    DODO_DPP_PROXY: '0x99d69565EdA438E3ebAA0627A407968ABD0f755b',
    DODO_MINEV3_PROXY: '0x14F7B8Fb0c1447DdE7bcf92a8d9BB058c8A5FE64',
  },
  [ChainId.BASE]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0x89872650fA1A391f58B4E144222bB02e44db7e3B',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',

    ROUTE_V2_DATA_FETCH: '0xa5fc92Ca57a21C87AA0477b1c8fE8B9Bbf69d6C2',
    ROUTE_V1_DATA_FETCH: '0x17644d3B366273faC75A07996E2F90A99A2946a7',
    CALLEE_HELPER: '0x44023441f2Bad375b6b5C6354B03c3E9AD01E269',

    DODO_PROXY: '0x4CAD0052524648A7Fa2cfE279997b00239295F33',
    DODO_DSP_PROXY: '0x49186E32fEd50fd6B5604A2618c7B0b03Cd41414',
    DODO_DPP_PROXY: '0x0B1467f71c082D8d410aF4376C685D9A6893cF36',
    DODO_MINEV3_PROXY: '0x2F66C5aAF006Bd9c51615D617589C16c0ed35fD3',
  },
  [ChainId.LINEA]: {
    MULTI_CALL: '0xa7b9C3a116b20bEDDdBE4d90ff97157f67F0bD97',
    DODO_APPROVE: '0x6de4d882a84A98f4CCD5D33ea6b3C99A07BAbeB1',
    ERC20_HELPER: '0xbcd2FDC3B884Cf0dfD932f55Ec2Fe1fB7e8c62Da',

    ROUTE_V2_DATA_FETCH: '0xa5fc92Ca57a21C87AA0477b1c8fE8B9Bbf69d6C2',
    ROUTE_V1_DATA_FETCH: '0xa5fc92Ca57a21C87AA0477b1c8fE8B9Bbf69d6C2',
    CALLEE_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',

    DODO_PROXY: '0x4CAD0052524648A7Fa2cfE279997b00239295F33',
    DODO_DSP_PROXY: '0x6D3bd005A8a75d6522C9cFE7d309BB1Cf9650e03',
    DODO_DPP_PROXY: '0xCDA4a6cc5997002B87f28D46852F9F0aA0f3c897',
    DODO_MINEV3_PROXY: '0xA6d0066328Edbcf3220cf8F61e8527e589DD9719',
  },
  [ChainId.SCROLL]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0x20E77aD760eC9E922Fd2dA8847ABFbB2471B92CD',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',

    ROUTE_V2_DATA_FETCH: '0xf5048d8F9163AF17Db522Abe9FaF37735C911320',
    ROUTE_V1_DATA_FETCH: '0x17644d3B366273faC75A07996E2F90A99A2946a7',
    CALLEE_HELPER: '0x44023441f2Bad375b6b5C6354B03c3E9AD01E269',

    DODO_PROXY: '0xe49781e6186214d88aACFd9eBc8cE40E3CDc066D',
    DODO_DSP_PROXY: '0x7Dd8c909E1F48a68FfEF03492761AF17B1496EDc',
    DODO_DPP_PROXY: '0x99d69565EdA438E3ebAA0627A407968ABD0f755b',
    DODO_MINEV3_PROXY: '0x14F7B8Fb0c1447DdE7bcf92a8d9BB058c8A5FE64',
  },
  [ChainId.MANTA]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0x0226fCE8c969604C3A0AD19c37d1FAFac73e13c2',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',

    ROUTE_V2_DATA_FETCH: '0x4CAD0052524648A7Fa2cfE279997b00239295F33',
    ROUTE_V1_DATA_FETCH: '0x17644d3B366273faC75A07996E2F90A99A2946a7',
    CALLEE_HELPER: '0x44023441f2Bad375b6b5C6354B03c3E9AD01E269',

    DODO_PROXY: '0x2F86652dAEF5f1728c54191C955F065Ec3C188c7',
    DODO_DSP_PROXY: '0x0B1467f71c082D8d410aF4376C685D9A6893cF36',
    DODO_DPP_PROXY: '0xCDA4a6cc5997002B87f28D46852F9F0aA0f3c897',
    DODO_MINEV3_PROXY: '0xA6d0066328Edbcf3220cf8F61e8527e589DD9719',
  },
  [ChainId.MANTLE]: {
    MULTI_CALL: '0xf5Ec1a19e1570bDf0A3AaA6585274f27027270b1',
    DODO_APPROVE: '0xa71415675F68f29259ddD63215E5518d2735bf0a',
    ERC20_HELPER: '0xB5c7BA1EAde74800cD6cf5F56b1c4562De373780',

    ROUTE_V2_DATA_FETCH: '0xCDA4a6cc5997002B87f28D46852F9F0aA0f3c897',
    ROUTE_V1_DATA_FETCH: '0xa1609A1fa7DC16c025feA194c02b2822441b8c10',
    CALLEE_HELPER: '0x4aAe1d041C01078725dB016BA4D4F72455CaF931',

    DODO_PROXY: '0xe7979E2F3e77196Bb2AB206eaa67Ea278A3E33A2',
    DODO_DSP_PROXY: '0x2933c0374089D7D98BA0C71c5E02E1A0e09deBEE',
    DODO_DPP_PROXY: '0xa5fc92Ca57a21C87AA0477b1c8fE8B9Bbf69d6C2',
    DODO_MINEV3_PROXY: '0x6D3bd005A8a75d6522C9cFE7d309BB1Cf9650e03',
  },
  [ChainId.DODO_CHAIN_TESTNET]: {
    MULTI_CALL: '0xD0CF7dfbF09CAfaB8AEf00e0Ce19a4638004a364',
    DODO_APPROVE: '0x82B26eb18382f7532015248078AB1f6030413396',
    ERC20_HELPER: '0xE6cecb7460c9E52aA483cb1f0E87d78D7085686F',

    ROUTE_V2_DATA_FETCH: '0xA3148a1765897EC0A9bCA57f855C0B4718060b78',
    ROUTE_V1_DATA_FETCH: '0x2e50e3e18c19C7d80B81888a961A13aEE49b962E',
    CALLEE_HELPER: '0x2Ba2696c63fA8b67b395de6D12F849b17C3515F9',

    DODO_PROXY: '0x464518e33F7Bd5E61a92b98b4332782915442580',
    DODO_DSP_PROXY: '0x886F677605512351e554AA53BA77eA493058b460',
    DODO_DPP_PROXY: '0xB4f2E70DE64F94116A6e93ff4dF2D020E91e7a63',
    DODO_MINEV3_PROXY: '0x391f8D754E4BaC453d059BA7D2137C4905bF48d4',
  },
  [ChainId.TAIKO]: {
    MULTI_CALL: '0x388371233439cF57bB8C9f2e4835954841cfCb15',
    DODO_APPROVE: '0x2629E610dB4AC081c108cCDf8b19ED39D702df43',
    ERC20_HELPER: '0x0c76F95a2952DC171B26b152f2b30cA8968e79D5',

    ROUTE_V2_DATA_FETCH: '0xC7EaBEc77Be175432DC20c0056Cce4c2C78B84F3',
    ROUTE_V1_DATA_FETCH: '0x187210CE04F5B3179F0e483FCf292c34BA7568Dd',
    CALLEE_HELPER: '0x94B66F3156353a12A6004d098A16F2fCfF9E8348',

    DODO_PROXY: '0xfcd8EF54A4dA96dE6B2DDF67C6265C7405a3A9c6',
    DODO_DSP_PROXY: '0x928e9762B5223d5A2ac1F5b13E8A61907aCaa9Bd',
    DODO_DPP_PROXY: '0x38886EDE1Fc92886F9a11C37a1f5e75474858eaa',
    DODO_MINEV3_PROXY: '0x1dFd36964e21a2eb633991f0B95b4241c20e1db3',
  },
  [ChainId.PLUME]: {
    MULTI_CALL: plume.MulticallWithValid,
    DODO_APPROVE: plume.DODOApprove,
    ERC20_HELPER: plume.ERC20Helper,

    ROUTE_V2_DATA_FETCH: plume.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: plume.DODOV1PmmHelper,
    CALLEE_HELPER: plume.DODOCalleeHelper,

    DODO_PROXY: plume.DODOV2Proxy02,
    DODO_DSP_PROXY: plume.DODODspProxy,
    DODO_DPP_PROXY: plume.DODODppProxy,
    DODO_MINEV3_PROXY: plume.DODOMineV3Proxy,
  },
  [ChainId.PLUME_TESTNET]: {
    MULTI_CALL: plumeTestnet.MulticallWithValid,
    DODO_APPROVE: plumeTestnet.DODOApprove,
    ERC20_HELPER: plumeTestnet.ERC20Helper,

    ROUTE_V2_DATA_FETCH: plumeTestnet.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: plumeTestnet.DODOV1PmmHelper,
    CALLEE_HELPER: plumeTestnet.DODOCalleeHelper,

    DODO_PROXY: plumeTestnet.DODOV2Proxy02,
    DODO_DSP_PROXY: plumeTestnet.DODODspProxy,
    DODO_DPP_PROXY: plumeTestnet.DODODppProxy,
    DODO_MINEV3_PROXY: plumeTestnet.DODOMineV3Proxy,
  },
  [ChainId.NEOX]: {
    MULTI_CALL: neox.MulticallWithValid,
    DODO_APPROVE: neox.DODOApprove,
    ERC20_HELPER: neox.ERC20Helper,

    ROUTE_V2_DATA_FETCH: neox.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: neox.DODOV1PmmHelper,
    CALLEE_HELPER: neox.DODOCalleeHelper,

    DODO_PROXY: neox.DODOV2Proxy02,
    DODO_DSP_PROXY: neox.DODODspProxy,
    DODO_DPP_PROXY: neox.DODODppProxy,
    DODO_MINEV3_PROXY: neox.DODOMineV3Proxy,
  },
  [ChainId.MORPH]: {
    MULTI_CALL: morph.MulticallWithValid,
    DODO_APPROVE: morph.DODOApprove,
    ERC20_HELPER: morph.ERC20Helper,

    ROUTE_V2_DATA_FETCH: morph.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: morph.DODOV1PmmHelper,
    CALLEE_HELPER: morph.DODOCalleeHelper,

    DODO_PROXY: morph.DODOV2Proxy02,
    DODO_DSP_PROXY: morph.DODODspProxy,
    DODO_DPP_PROXY: morph.DODODppProxy,
    DODO_MINEV3_PROXY: morph.DODOMineV3Proxy,
  },
  [ChainId.RISE_TESTNET]: {
    MULTI_CALL: riseTestnet.MulticallWithValid,
    DODO_APPROVE: riseTestnet.DODOApprove,
    ERC20_HELPER: riseTestnet.ERC20Helper,

    ROUTE_V2_DATA_FETCH: riseTestnet.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: riseTestnet.DODOV1PmmHelper,
    CALLEE_HELPER: riseTestnet.DODOCalleeHelper,

    DODO_PROXY: riseTestnet.DODOV2Proxy02,
    DODO_DSP_PROXY: riseTestnet.DODODspProxy,
    DODO_DPP_PROXY: riseTestnet.DODODppProxy,
    DODO_MINEV3_PROXY: riseTestnet.DODOMineV3Proxy,
  },
  [ChainId.NEROCHAIN]: {
    MULTI_CALL: nero.MulticallWithValid,
    DODO_APPROVE: nero.DODOApprove,
    ERC20_HELPER: nero.ERC20Helper,

    ROUTE_V2_DATA_FETCH: nero.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: nero.DODOV1PmmHelper,
    CALLEE_HELPER: nero.DODOCalleeHelper,

    DODO_PROXY: nero.DODOV2Proxy02,
    DODO_DSP_PROXY: nero.DODODspProxy,
    DODO_DPP_PROXY: nero.DODODppProxy,
    DODO_MINEV3_PROXY: nero.DODOMineV3Proxy,
  },
  [ChainId.BITLAYER]: {
    MULTI_CALL: bitlayer.MulticallWithValid,
    DODO_APPROVE: bitlayer.DODOApprove,
    ERC20_HELPER: bitlayer.ERC20Helper,

    ROUTE_V2_DATA_FETCH: bitlayer.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: bitlayer.DODOV1PmmHelper,
    CALLEE_HELPER: bitlayer.DODOCalleeHelper,

    DODO_PROXY: bitlayer.DODOV2Proxy02,
    DODO_DSP_PROXY: bitlayer.DODODspProxyWithoutGSP,
    DODO_DPP_PROXY: bitlayer.DODODppProxy,
    DODO_MINEV3_PROXY: bitlayer.DODOMineV3Proxy,
  },
  [ChainId.ZIRCUIT]: {
    MULTI_CALL: zircuitMainnet.MulticallWithValid,
    DODO_APPROVE: zircuitMainnet.DODOApprove,
    ERC20_HELPER: zircuitMainnet.ERC20Helper,

    ROUTE_V2_DATA_FETCH: zircuitMainnet.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: zircuitMainnet.DODOV1PmmHelper,
    CALLEE_HELPER: zircuitMainnet.DODOCalleeHelper,

    DODO_PROXY: zircuitMainnet.DODOV2Proxy02,
    DODO_DSP_PROXY: zircuitMainnet.DODODspProxyWithoutGSP,
    DODO_DPP_PROXY: zircuitMainnet.DODODppProxy,
    DODO_MINEV3_PROXY: zircuitMainnet.DODOMineV3Proxy,
  },
  [ChainId.X_LAYER]: {
    MULTI_CALL: xLayer.MulticallWithValid,
    DODO_APPROVE: xLayer.DODOApprove,
    ERC20_HELPER: xLayer.ERC20Helper,

    ROUTE_V2_DATA_FETCH: xLayer.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: xLayer.DODOV1PmmHelper,
    CALLEE_HELPER: xLayer.DODOCalleeHelper,

    DODO_PROXY: xLayer.DODOV2Proxy02,
    DODO_DSP_PROXY: xLayer.DODODspProxy,
    DODO_DPP_PROXY: xLayer.DODODppProxy,
    DODO_MINEV3_PROXY: xLayer.DODOMineV3Proxy,
  },
  [ChainId.ZERO]: {
    MULTI_CALL: zeroMainnet.MulticallWithValid,
    DODO_APPROVE: zeroMainnet.DODOApprove,
    ERC20_HELPER: zeroMainnet.ERC20Helper,

    ROUTE_V2_DATA_FETCH: zeroMainnet.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: zeroMainnet.DODOV1PmmHelper,
    CALLEE_HELPER: zeroMainnet.DODOCalleeHelper,

    DODO_PROXY: zeroMainnet.DODOV2Proxy02,
    DODO_DSP_PROXY: zeroMainnet.DODODspProxy,
    DODO_DPP_PROXY: zeroMainnet.DODODppProxy,
    DODO_MINEV3_PROXY: zeroMainnet.DODOMineV3Proxy,
  },
  [ChainId.HASHKEY]: {
    MULTI_CALL: hashkey.MulticallWithValid,
    DODO_APPROVE: hashkey.DODOApprove,
    ERC20_HELPER: hashkey.ERC20Helper,

    ROUTE_V2_DATA_FETCH: hashkey.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: hashkey.DODOV1PmmHelper,
    CALLEE_HELPER: hashkey.DODOCalleeHelper,

    DODO_PROXY: hashkey.DODOV2Proxy02,
    DODO_DSP_PROXY: hashkey.DODODspProxyWithoutGSP,
    DODO_DPP_PROXY: hashkey.DODODppProxy,
    DODO_MINEV3_PROXY: hashkey.DODOMineV3Proxy,
  },
  [ChainId.HEMI]: {
    MULTI_CALL: hemi.MulticallWithValid,
    DODO_APPROVE: hemi.DODOApprove,
    ERC20_HELPER: hemi.ERC20Helper,

    ROUTE_V2_DATA_FETCH: hemi.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: hemi.DODOV1PmmHelper,
    CALLEE_HELPER: hemi.DODOCalleeHelper,

    DODO_PROXY: hemi.DODOV2Proxy02,
    DODO_DSP_PROXY: hemi.DODODspProxyWithoutGSP,
    DODO_DPP_PROXY: hemi.DODODppProxy,
    DODO_MINEV3_PROXY: hemi.DODOMineV3Proxy,
  },
  [ChainId.PHAROS_TESTNET]: {
    MULTI_CALL: pharosTestnet.MulticallWithValid,
    DODO_APPROVE: pharosTestnet.DODOApprove,
    ERC20_HELPER: pharosTestnet.ERC20Helper,

    ROUTE_V2_DATA_FETCH: pharosTestnet.DODOV2RouteHelper,
    ROUTE_V1_DATA_FETCH: pharosTestnet.DODOV1PmmHelper,
    CALLEE_HELPER: pharosTestnet.DODOCalleeHelper,

    DODO_PROXY: pharosTestnet.DODOV2Proxy02,
    DODO_DSP_PROXY: pharosTestnet.DODODspProxy,
    DODO_DPP_PROXY: pharosTestnet.DODODppProxy,
    DODO_MINEV3_PROXY: pharosTestnet.DODOMineV3Proxy,
  },
};

export default contractMap;
