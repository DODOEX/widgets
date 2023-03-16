import { t } from '@lingui/macro';
import { basicTokenMap, ChainId } from '../../constants/chains';

export default function getExecutionErrorMsg(
  chainId: ChainId,
  message: string,
) {
  const EtherTokenSymbol = basicTokenMap[chainId]?.symbol;
  const KnownDialogErros = [
    {
      error: 'insufficient',
      msg: t`Insufficient funds - Please retry after depositing more ${EtherTokenSymbol} into your wallet`,
    },
    {
      error: ['External Swap execution Failed', 'Return amount is not enough'],
      msg: t`Price impact exceeds the slippage tolerance you set. Try increasing the slippage tolerance.`,
    },
    {
      error: 'SafeERC20: low-level call failed',
      msg: t`SafeERC20: low-level call failed. Please contact the DODO team.`,
    },
    {
      error: ['User denied', 'cancel', 'User rejected', 'user rejected'],
      msg: t`User denied transaction signature.`,
    },
    {
      error: [
        `Cannot set properties of undefined (setting 'loadingDefauIts'){"originalError":{`,
        `[ethjs-query]while formatting outputs from RPC'["value":["code":-32000,"message":"header not found"))`,
      ],
      msg: t`RPC node data exception`,
    },
    {
      error: [`execution reverted:FORCESTOP ["originalError"`],
      msg: t`ForceStop exception`,
    },
    {
      error: [
        'replacement transaction underpriced',
        'Gasprice too low',
        'transaction underprice',
      ],
      msg: t`Gas price is too low, please adjust in your wallet and try again`,
    },
    {
      error: ['MINT_INVALID'],
      msg: t`No ForceStop access`,
    },
    {
      error: ['NOT_PHASE_EXE'],
      msg: t`Unable to SETTLE during the cooling-off period`,
    },
    {
      error: [
        'params specify an EIP-1559transaction but the currentnetwork does not support',
      ],
      msg: t`Wallet incompatibility`,
    },
    {
      error: ['ALREADY_SETTLED'],
      msg: t`This CP has been settled by other addrs`,
    },
    {
      error: ['create RFQ order failed]:LESS_THAN_FEE_LIMIT'],
      msg: t`Service update, please wait and try again`,
    },
  ];

  let errorMsg = '';
  KnownDialogErros.some((item) => {
    if (Array.isArray(item.error)) {
      return item.error.some((error) => {
        if (message.indexOf(error) > -1) {
          errorMsg = item.msg;
          return true;
        }
        return false;
      });
    }
    if (message.indexOf(item.error) > -1) {
      errorMsg = item.msg;
      return true;
    }
    return false;
  });
  return errorMsg || message;
}
