import { ChainId } from './chain';

const contractMap: {
  [key in ChainId]: {
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
  [ChainId.SOON_TESTNET]: {
    MULTI_CALL: '',
    DODO_APPROVE: '',
    ERC20_HELPER: '',

    ROUTE_V2_DATA_FETCH: '',
    ROUTE_V1_DATA_FETCH: '',
    CALLEE_HELPER: '',

    DODO_PROXY: '',
    DODO_DSP_PROXY: '',
    DODO_DPP_PROXY: '',
    DODO_MINEV3_PROXY: '',
  },
  [ChainId.SOON]: {
    MULTI_CALL: '',
    DODO_APPROVE: '',
    ERC20_HELPER: '',

    ROUTE_V2_DATA_FETCH: '',
    ROUTE_V1_DATA_FETCH: '',
    CALLEE_HELPER: '',

    DODO_PROXY: '',
    DODO_DSP_PROXY: '',
    DODO_DPP_PROXY: '',
    DODO_MINEV3_PROXY: '',
  },
};

export default contractMap;
