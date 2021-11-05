import { VoteTransaction } from './common/types';
import { btcToStxAddress, voteTransactionsUrl } from './common/utils';
import { Tx } from '@mempool/mempool.js/lib/interfaces/bitcoin/transactions';

export async function getBTCVotesRecursive(approve: boolean, txs: Tx[]): Promise<Tx[]> {
  let lastTxid = '';
  if (txs.length !== 0) {
    lastTxid = txs[txs.length - 1].txid;
  }
  const baseUrl = voteTransactionsUrl(approve);
  const url = `${baseUrl}${lastTxid}`;
  const response = await fetch(url);
  const newTxs: Tx[] = await response.json();
  if (newTxs.length === 0) {
    return txs;
  }
  txs.push(...newTxs);
  return getBTCVotesRecursive(approve, txs);
}

export async function getBTCVoteTransactions(approve: boolean): Promise<VoteTransaction[]> {
  const txs: Tx[] = await getBTCVotesRecursive(approve, []);

  const votes: VoteTransaction[] = [];

  txs.forEach(tx => {
    const [input] = tx.vin;
    const btcAddress = input.prevout.scriptpubkey_address;
    try {
      const stxAddress = btcToStxAddress(btcAddress);
      votes.push({
        stxAddress,
        txid: tx.txid,
        btcAddress,
        approve,
      });
    } catch (error) {
      console.error('Invalid address:', btcAddress);
    }
  });
  return votes;
}
