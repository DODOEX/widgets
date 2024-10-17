import React from 'react';

export enum SubPeggedVersionE {
  DSP = 'dsp',
  GSP = 'gsp',
}

export enum Version {
  /** DVM; public pool */
  standard = 'standard',
  /** DVM: quoteReserve = 0; public pool */
  singleToken = 'single-token',
  /** DSP or GSP */
  pegged = 'pagged',
  /** DPP; private pool */
  marketMakerPool = 'market-maker-pool',
}

export interface VersionItem {
  version: Version;
  title: string;
  description: string;
  exampleImgUrl: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  exampleDarkImgUrl: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  // doc link
  docUrl: string;
  // Init price label
  initPriceLabel: string;
  // Init price tips
  initPriceTips?: string;
  initPriceTipsLink?: string;
}

export type SectionStatusT = 'waiting' | 'running' | 'completed';

export interface RadioButtonT {
  title: string;
  description: string;
  value: string;
  tag?: string;
  tagColor?: string;
  tagBackgroundColor?: string;
}
