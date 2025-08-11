import { BigNumber } from 'bignumber.js';
import { TokenList } from '../Token/type';
import {
  BridgeStep,
  CrossChainSwapZetachainRoute,
} from './useFetchRoutePriceBridge';

export function generateBridgeStep({
  omniPlan,
  tokenList,
}: {
  omniPlan: CrossChainSwapZetachainRoute['omniPlan'];
  tokenList: TokenList;
}): BridgeStep {
  const newIncludedSteps: BridgeStep['includedSteps'] = [];

  if (omniPlan) {
    omniPlan.forEach((plan, index) => {
      const estimateFromToken = tokenList.find(
        (token) =>
          token.address.toLowerCase() === plan.inToken.toLowerCase() &&
          token.chainId === Number(plan.inChainId),
      );
      const estimateToToken = tokenList.find(
        (token) =>
          token.address.toLowerCase() === plan.outToken.toLowerCase() &&
          token.chainId === Number(plan.outChainId),
      );
      const isGatewayType = plan.type === 'Gateway';
      const tool = isGatewayType ? 'null' : plan.inChainType;
      newIncludedSteps.push({
        id: `${plan.inChainType}-${plan.outChainType}-${plan.type}-${plan.inToken}-${plan.outToken}-${plan.inAmount}-${plan.outAmount}-${index}`,
        tool,
        toolDetails: {
          name: tool,
          logoURI: tool,
        },
        type: plan.type,
        estimate: {
          fromToken: estimateFromToken ?? {
            address: plan.inToken,
            symbol: plan.inToken.slice(0, 6),
            chainId: Number(plan.inChainId),
            decimals: 18,
            name: plan.inToken.slice(0, 6),
          },
          toToken: estimateToToken ?? {
            address: plan.outToken,
            symbol: plan.outToken.slice(0, 6),
            chainId: Number(plan.outChainId),
            decimals: 18,
            name: plan.outToken.slice(0, 6),
          },
          fromTokenAmount: new BigNumber(plan.inAmountWithOutDecimals),
          toTokenAmount: new BigNumber(plan.outAmountWithOutDecimals),
        },
        swapSteps: plan.swapSteps?.map((swap) => {
          const inputToken = tokenList.find(
            (token) =>
              token.address.toLowerCase() === swap.inputToken.toLowerCase() &&
              token.chainId === Number(plan.inChainId),
          );
          const outputToken = tokenList.find(
            (token) =>
              token.address.toLowerCase() === swap.outputToken.toLowerCase() &&
              token.chainId === Number(plan.inChainId),
          );
          return {
            ...swap,
            inputToken: inputToken ?? {
              address: swap.inputToken,
              symbol: swap.inputToken.slice(0, 6),
              chainId: Number(plan.inChainId),
              decimals: 18,
              name: swap.inputToken.slice(0, 6),
            },
            outputToken: outputToken ?? {
              address: swap.outputToken,
              symbol: swap.outputToken.slice(0, 6),
              chainId: Number(plan.inChainId),
              decimals: 18,
              name: swap.outputToken.slice(0, 6),
            },
          };
        }),
        hash: plan.hash,
        hashChainId: plan.hashChainId ? Number(plan.hashChainId) : undefined,
      });
    });
  }

  return {
    tool: 'zetachain',
    toolDetails: {
      name: 'zetachain',
      logoURI: 'zetachain',
    },
    type: 'Bridge',
    includedSteps: newIncludedSteps,
  };
}
