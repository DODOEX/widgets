import { poolUtils } from '../pool/poolUtils';
import { AllV3TicksDocument } from './queries';

export interface AMMV3ApiProps {}

export class AMMV3Api {
  static graphql = {
    AllV3TicksDocument,
  };

  static utils = poolUtils;

  static encode = {};
}
