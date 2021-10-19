import type { Tx } from '@mempool/mempool.js/lib/interfaces/bitcoin/transactions';
import { b58ToC32 } from 'micro-stacks/crypto';

export const YES_ADDRESS = '111111111111111111112czxoHN';
export const NO_ADDRESS = '111111111111111111112kmzDG2';

export const BTC_VOTE_ADDRESSES = {
  YES: YES_ADDRESS,
  NO: NO_ADDRESS,
} as const;

export type BTC_VOTE_ADDRESS = keyof typeof BTC_VOTE_ADDRESSES;

export function btcToStxAddress(btcAddress: string) {
  return b58ToC32(btcAddress);
}

function getVoteAddress(approve: boolean) {
  if (approve) return BTC_VOTE_ADDRESSES.YES;
  return BTC_VOTE_ADDRESSES.NO;
}

export function voteTransactionsUrl(approve: boolean) {
  const address = getVoteAddress(approve);
  const url = `https://mempool.space/api/address/${address}/txs`;
  return url;
}

export async function getBTCVoteTransactions(approve: boolean) {
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
    };
  });
}

// export async function getBTCVotes() {}
