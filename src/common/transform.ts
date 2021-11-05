import { Vote, VoteTransaction } from './types';
import { getStackedAmount } from './stacking-club';

export async function transformVote(vote: VoteTransaction): Promise<Vote> {
  const amount = await getStackedAmount(vote);

  return {
    ...vote,
    amount: amount?.toString(10) || '0',
  };
}

export async function transformVotes(votes: VoteTransaction[]): Promise<Vote[]> {
  return Promise.all(votes.map(transformVote));
}
