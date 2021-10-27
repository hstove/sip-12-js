import type { Tx } from '@mempool/mempool.js/lib/interfaces/bitcoin/transactions';
import { b58ToC32 } from 'micro-stacks/crypto';
import { getRewardData, getStackerData } from './stacking-club';

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

interface VoteTransaction {
  stxAddress: string;
  txid: string;
  btcAddress: string;
  approve: boolean;
}

interface Vote extends VoteTransaction {
  amount: bigint;
}

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

export async function haloGetBTCVoteTransactions(approve: boolean): Promise<VoteTransaction[]> {
  let url: string;
  if (approve) {
    url = 'https://sip12.halo.ms/btcApprove';
  } else {
    url = 'https://sip12.halo.ms/btcNoApprove';
  }
  const res = await fetch(url);
  return await res.json();
}

export async function transformVote(vote: VoteTransaction): Promise<Vote> {
  const [reward, stacker] = await Promise.all([
    getRewardData(vote.btcAddress),
    getStackerData(vote.stxAddress),
  ]);

  let amount = 0n;
  if (reward) {
    amount = reward;
  } else if (stacker) {
    amount = stacker;
  }
  return {
    ...vote,
    amount,
  };
}

export async function transformVotes(votes: VoteTransaction[]): Promise<Vote[]> {
  return Promise.all(votes.map(transformVote));
}

export interface VoteData {
  votes: {
    support: Vote[];
    reject: Vote[];
  };
  totals: {
    support: bigint;
    reject: bigint;
  };
}

export async function getVoteData(): Promise<VoteData> {
  const [yesVotes, noVotes] = await Promise.all([
    getBTCVoteTransactions(true),
    getBTCVoteTransactions(false),
  ]);

  const [yes, no] = await Promise.all([transformVotes(yesVotes), transformVotes(noVotes)]);

  const totals = {
    support: 0n,
    reject: 0n,
  };

  yes.forEach(v => {
    totals.support += v.amount;
  });
  no.forEach(v => {
    totals.reject += v.amount;
  });

  return {
    votes: {
      support: yes,
      reject: no,
    },
    totals,
  };
}

export async function haloGetVoteData(): Promise<VoteData> {
  const res = await fetch('https://sip12.halo.ms/votedata');
  const json = await res.json();
  return {
    votes: {
      support: json.votes.support,
      reject: json.votes.reject,
    },
    totals: {
      support: BigInt(json.totals.support),
      reject: BigInt(json.totals.reject),
    },
  };
}
