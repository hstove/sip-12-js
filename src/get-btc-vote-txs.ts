import { VoteTransaction } from './common/types';
import { btcToStxAddress, voteTransactionsUrl } from './common/utils';
import { Tx } from '@mempool/mempool.js/lib/interfaces/bitcoin/transactions';

export async function getBTCVoteTransactions(approve: boolean): Promise<VoteTransaction[]> {
  const url = voteTransactionsUrl(approve);
  const response = await fetch(url);
  const txs: Tx[] = await response.json();

  return txs.map(tx => {
    const [input] = tx.vin;
    const btcAddress = input.prevout.scriptpubkey_address;
    const stxAddress = btcToStxAddress(btcAddress);
    return {
      stxAddress,
      txid: tx.txid,
      btcAddress,
      approve,
    };
  });
}
