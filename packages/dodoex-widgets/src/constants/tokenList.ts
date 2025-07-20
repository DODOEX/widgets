import { TokenInfo } from '../hooks/Token';

const tokenList: (TokenInfo & {
  id: number;
  logo: string;
  position: number;
  slippage: number | null;
})[] = [];

export default tokenList;
