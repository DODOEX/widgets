import { useMemo } from 'react';
import { getPmmModel } from '@dodoex/api';
import { Version } from '../types';

export enum PoolTemplate {
  standard = 1,
  singleToken,
  pagged,
  // private pool
  marketMaker,
}

export const useCreatePmm = ({
  selectedVersion,
  baseAmount,
  quoteAmount,
  initPrice,
  slippageCoefficient,
}: {
  selectedVersion: Version;
  baseAmount?: string;
  quoteAmount?: string;
  initPrice: string;
  slippageCoefficient: string;
}) => {
  const pmmParams = useMemo(() => {
    const isPublic = [Version.standard, Version.singleToken].includes(
      selectedVersion,
    );
    const isSingle = selectedVersion === Version.singleToken;
    if (!baseAmount || (!isSingle && !quoteAmount)) return undefined;
    const i = Number(initPrice);
    // Currently, private pools are all customized, so this situation is not considered.
    // if (quoteAmount && baseAmount && isPrivate && isStandardTemplate) {
    //   i = quoteAmount / baseAmount;
    // }
    const baseAmountNumber = Number(baseAmount);
    const quoteAmountNumber = Number(quoteAmount);
    const slippageCoefficientNumber = Number(slippageCoefficient);
    return {
      i,
      k: slippageCoefficientNumber,
      b: baseAmountNumber,
      b0: baseAmountNumber,
      q: quoteAmountNumber,
      q0: slippageCoefficientNumber === 0 || !isPublic ? quoteAmountNumber : 0,
      R: slippageCoefficientNumber === 0 || !isPublic ? 0 : 1,
    };
  }, [
    baseAmount,
    initPrice,
    quoteAmount,
    selectedVersion,
    slippageCoefficient,
  ]);

  const pmmModel = useMemo(() => {
    if (!pmmParams) return undefined;
    return getPmmModel(pmmParams);
  }, [pmmParams]);

  const midPrice = useMemo(() => {
    if (!pmmModel) return undefined;
    return pmmModel.getMidPrice();
  }, [pmmModel]);

  return {
    pmmParams,
    pmmModel,
    midPrice,
  };
};
