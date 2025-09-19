import { Address, TonClient } from '@ton/ton';

async function main() {
  // Initializaing TON HTTP API client
  const tonClient = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  // Calling method on HTTP API
  // Full API: https://testnet.toncenter.com/api/v2/#/accounts/get_transactions_getTransactions_get
  const transactions = await tonClient.getTransactions(
    // Replace with your Testnet address to fetch transactions
    Address.parse('0QArAJPiEbfybbhm4XYU2ve5fIMozDvZvqU7wpVoKd-xJcRd'),
    {
      limit: 10, // Maximum number of received transactions
      archival: true, // Search the entire history
    },
  );

  const firstTx = transactions[0];
  const { inMessage } = firstTx;

  console.log('Timestamp:', firstTx.now);
  if (inMessage?.info?.type === 'internal') {
    console.log('Value:', inMessage.info.value.coins);
    console.log('Sender:', inMessage.info.src.toString({ testOnly: true }));
  }
}

main();
