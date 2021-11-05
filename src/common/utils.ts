import { b58ToC32 } from 'micro-stacks/crypto';
import { BTC_VOTE_ADDRESSES } from './constants';

export function btcToStxAddress(btcAddress: string) {
  return b58ToC32(btcAddress);
}

function getVoteAddress(approve: boolean) {
  if (approve) return BTC_VOTE_ADDRESSES.YES;
  return BTC_VOTE_ADDRESSES.NO;
}

export function voteTransactionsUrl(approve: boolean) {
  return `https://mempool.space/api/address/${getVoteAddress(approve)}/txs/chain/`;
}
