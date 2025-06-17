import { Box, BoxProps } from '@dodoex/components';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { DexConfigI, LpTokenPlatformID } from '../../types';
import { ReactComponent as DODOImg } from '../dodo.svg';
import { ReactComponent as PancakeImg } from '../pancake.svg';
import { ChainId } from '@dodoex/api';
import { dexKeysMap } from '../../../../constants/chains';
import React from 'react';

export type DexKey = 'dodo' | 'pancakeV2';

export function useDexList() {
  const { dappMetadata } = useUserOptions();
  const dexListObj: Record<DexKey, DexConfigI> = React.useMemo(
    () => ({
      dodo: {
        name: dappMetadata?.logoUrl ? dappMetadata.name : 'ZUNO Dex',
        Icon: dappMetadata?.logoUrl
          ? (
              props: React.SVGProps<SVGSVGElement> & {
                title?: string | undefined;
              },
            ) => {
              return (
                <Box
                  component="img"
                  src={dappMetadata.logoUrl}
                  alt={dappMetadata.name}
                  {...(props as BoxProps)}
                />
              );
            }
          : DODOImg,
        createMiningEnable: true,
        platformID: LpTokenPlatformID.dodo,
      },
      pancakeV2: {
        name: 'Pancake V2',
        Icon: PancakeImg,
        createMiningEnable: true,
        platformID: LpTokenPlatformID.pancakeV2,
      },
    }),
    [dappMetadata],
  );

  const getChainDexList = (
    chainId: ChainId,
    filterCreateMiningEnable?: boolean,
  ) => {
    const dexKeys = dexKeysMap[chainId] as DexKey[];
    const { name, Icon } = dexListObj.dodo;
    const defaultDexList = [
      {
        key: 'dodo' as DexKey,
        value: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Icon
              style={{
                width: 24,
                height: 24,
              }}
            />
            {name}
          </Box>
        ),
      },
    ];
    if (!dexKeys) {
      return defaultDexList;
    }
    return [
      ...defaultDexList,
      ...dexKeys
        .filter((key) => {
          if (filterCreateMiningEnable) {
            return dexListObj[key]?.createMiningEnable ?? false;
          }
          return true;
        })
        .map((key) => {
          const { name, Icon } = dexListObj[key];
          return {
            key,
            value: (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Icon
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
                {name}
              </Box>
            ),
          };
        }),
    ];
  };

  const BSC_SWAPINFO = [
    {
      // price comparison
      name: dexListObj['pancakeV2'].name,
      factoryAddress: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
      initHash:
        '0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5',
      fee: 25,
    },
  ];

  const GetGeneralUniInfo = (
    chainId: number,
  ): {
    name: string;
    factoryAddress: string;
    initHash: string;
    fee?: number;
  }[] => {
    switch (chainId) {
      case 56:
      case 86:
        return BSC_SWAPINFO;

      default:
        return [];
    }
  };

  return {
    dexListObj,
    GetGeneralUniInfo,
    getChainDexList,
  };
}
