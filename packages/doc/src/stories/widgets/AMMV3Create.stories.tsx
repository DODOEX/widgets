import { AddLiquidityV3 } from '@dodoex/widgets';

export default {
  title: 'Widgets/AddLiquidityV3',
  component: 'div',
};

export const Primary = (props: any) => {
  return (
    <AddLiquidityV3
      handleGoBack={() => window.alert('handleGoBack')}
      handleGoToPoolList={() => window.alert('handleGoToPoolList')}
      params={{
        from: '0x8f2a9f23d5d70226491b0c10365de88f64cd4a01',
        to: '0xd05553bc85fa8c004073d91097b7611cd5e478f5',
        fee: '100',
      }}
    />
  );
};

Primary.args = {
  projectId: 'project2',
  apiKey: 'ee53d6b75b12aceed4',
  width: '100%',
  height: '100%',
  noDocumentLink: true,
  // onlyChainId: 1,
};
