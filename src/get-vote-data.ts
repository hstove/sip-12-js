import { VoteData } from './common/types';
import { getBTCVoteTransactions } from './get-btc-vote-txs';
import { transformVotes } from './common/transform';

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
    totals.support += BigInt(v.amount);
  });
  no.forEach(v => {
    totals.reject += BigInt(v.amount);
  });

  return {
    votes: {
      support: yes,
      reject: no,
    },
    totals: {
      support: totals.support.toString(10),
      reject: totals.reject.toString(10),
    },
  };
}
